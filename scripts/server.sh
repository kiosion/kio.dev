#!/bin/bash

procs=(api web)
pids=()

for proc in "${procs[@]}"; do
  make $proc | sed "s/^/[$proc] /" &
  pids+=($!)
done

trap "kill ${pids[*]}" SIGINT SIGTERM

for pid in "${pids[@]}"; do
  wait $pid
  kill -TERM $pid > /dev/null 2>&1 || true && sleep 3 && kill -KILL $pid > /dev/null 2>&1 || true
done

exit 0
