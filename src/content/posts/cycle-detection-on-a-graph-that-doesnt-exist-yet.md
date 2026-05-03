---
layout: post
title: Cycle detection on a graph that doesn't exist yet
date: 2025-11-12
tags: [programming, algorithms]
desc: Cycle detection that runs against a live database and an in-memory request payload through the same code, by writing your validators against an interface that doesn't care which one it's walking.
---

Hierarchical groups come up a lot in the work I do, and they all have similar shapes, whether you're looking at LDAP, IAM, RBAC tiers, or some flavor of dependency graph: group A contains some users plus another group B, B contains some users plus group C, and so on, walking down to enumerate effective members, and walking up to enumerate ancestors. The single-edge version of cycle detection here is easy, since when someone calls your API to nest one group inside another, you can check the proposed edge against your live store, run a DFS upward from the new parent, and reject the request if the walk ever lands on the child.

## When the graph doesn't exist yet

The case I actually want to talk about is the one where you can't do that, because the graph you're meant to validate against doesn't yet exist. This shows up the moment you accept a bulk import, a snapshot from some upstream system like a directory sync, IaC apply, or config push, where dozens of mutually-referential nodes and edges land all at once with none of them in your store yet. "Validate this edge against live state" stops meaning anything, because the things the edge points at don't exist anywhere except in the request payload sitting in your handler, and you can't compose the result from individual single-edge checks either, since the validity of any one edge depends on the rest of the batch you haven't yet considered.

The bulk-import case forces you to treat the entire proposed graph as a single consistent unit, materialize it somewhere you can walk, and run validation against that. None of the actual algorithms (cycle detection, depth bounds, ancestor enumeration) change between the persisted and prospective cases, leaving the question of how to keep the validators from caring whether the thing they're walking is your live database or a fresh `map` populated from a request.

## Validators that don't care where they walk

The trick is to write your validators against a storage interface, rather than a concrete repository, so a real DB-backed store and an in-memory snapshot of a request payload both satisfy the same shape, and the validator has no way to tell which it's looking at. In Go, that looks something like this:

```go
type Group struct {
    Name    string
    Parents []string
}

type Store interface {
    Get(name string) (*Group, bool)
}

type Batch struct {
    groups map[string]*Group
}

func (b *Batch) Get(name string) (*Group, bool) {
    g, ok := b.groups[name]
    return g, ok
}

func (b *Batch) Add(g *Group) { b.groups[g.Name] = g }
```

Once `Batch` satisfies the same `Store` interface that your live store does, every validator you write against that interface is automatically both a single-edge validator and a bulk-import validator at the same time, with no second implementation and no risk of the two drifting apart later.

## A cycle check, as a worked example

The cycle detector is the obvious validator to build on top of this, and the version that bounds depth in the same pass looks like this:

```go
var (
    ErrWouldCycle = errors.New("edge would create a cycle")
    ErrTooDeep    = errors.New("hierarchy depth exceeded")
)

func checkInsert(s Store, parent, child string, maxDepth int) error {
    visited := make(map[string]struct{})
    var walk func(name string, depth int) error
    walk = func(name string, depth int) error {
        if name == child {
            return ErrWouldCycle
        }
        if depth > maxDepth {
            return ErrTooDeep
        }
        if _, ok := visited[name]; ok {
            return nil
        }
        visited[name] = struct{}{}
        g, ok := s.Get(name)
        if !ok {
            return nil
        }
        for _, p := range g.Parents {
            if err := walk(p, depth+1); err != nil {
                return err
            }
        }
        return nil
    }
    return walk(parent, 1)
}
```

The function walks up from the proposed parent along ancestor edges looking for the proposed child, with a depth bound layered in for the acyclic-but-pathological case where someone's nested fifty groups deep. Any traversal that walks the hierarchy in production pays the depth cost, so it's worth bounding once at insertion rather than discovering the problem the next time something OOMs at runtime.

The DFS is just basic graph machinery. `checkInsert` doesn't know or care whether the `Store` it got is your real database or a `Batch` populated from a request body, so the same call site validates a single new edge against persisted state and also validates an entire prospective graph against itself, depending only on what you hand it.

Once your validators are agnostic to where the graph lives, prospective and persisted graphs collapse into the same problem, single-edge inserts and entire bulk imports run through the same code, and the framing of "a graph that doesn't yet exist" just becomes a way of saying "a graph," since the validator can't tell the difference.
