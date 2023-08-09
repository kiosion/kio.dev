defmodule Hexerei.PT do
  require Logger

  def build_summary(blocks) do
    try do
      blocks
      |> Enum.filter(fn b ->
        b["style"] != nil and b["style"] in ["h1", "h2", "h3", "h4", "h5", "h6"]
      end)
      |> Enum.map(&build_heading/1)
      |> Enum.reduce({[], nil}, fn heading, {tree, prev} -> make_tree(tree, heading, prev) end)
      |> elem(0)
    rescue
      e ->
        Logger.error("Error building summary: #{inspect(e)}")
        []
    end
  end

  defp build_heading(block) do
    %{
      text: Enum.join(Enum.map(block["children"], & &1["text"]), ""),
      key: block["_key"],
      type: block["style"],
      typeLevel: String.at(block["style"], 1) |> String.to_integer(),
      children: [],
      parent: nil
    }
  end

  defp make_tree(tree, heading, nil), do: make_tree(tree, heading, heading)

  defp make_tree(tree, %{typeLevel: headingLevel} = heading, %{typeLevel: prevLevel} = prev)
       when prevLevel < headingLevel,
       do: insert_child(tree, prev, heading) |> update_tree()

  defp make_tree(tree, %{typeLevel: headingLevel} = heading, %{typeLevel: prevLevel} = prev)
       when prevLevel >= headingLevel,
       do: check_for_parent(tree, prev, heading) |> update_tree()

  defp update_tree({tree, prev, heading}),
    do: {tree |> update_tree(prev) |> update_tree(heading), heading}

  defp update_tree(tree, node) do
    Enum.reduce_while(tree, {[], false}, fn
      t, {acc, true} ->
        {:cont, {acc ++ [t], true}}

      t, {acc, false} ->
        case replace_top_level_or_update_children(t, node) do
          {:halt, replacement} -> {:cont, {acc ++ [replacement], true}}
          {:cont, updated} -> {:cont, {acc ++ [updated], false}}
        end
    end)
    |> case do
      {result, true} -> result
      {result, false} -> Enum.map(result, &update_children(&1, node))
    end
  end

  defp replace_top_level_or_update_children(%{key: key}, %{key: key_to_match} = node)
       when key == key_to_match do
    {:halt, node}
  end

  defp replace_top_level_or_update_children(%{children: children} = t, node)
       when children != [] do
    {:cont, %{t | children: update_tree(children, node)}}
  end

  defp replace_top_level_or_update_children(t, _node) do
    {:cont, t}
  end

  defp update_children(%{children: children} = t, node) when children != [] do
    %{t | children: update_tree(children, node)}
  end

  defp update_children(t, _), do: t

  defp check_for_parent(tree, prev, heading) do
    case find_parent(tree, prev.parent) do
      # No parent found, push to root
      nil ->
        {tree ++ [heading], prev, heading}

      # Same level, push to parent
      parent when prev.typeLevel == heading.typeLevel ->
        insert_child(tree, parent, heading)

      # Continue traversing backwards
      parent when parent.typeLevel >= heading.typeLevel ->
        check_for_parent(tree, parent, heading)

      # Found the right level or reached root
      _ ->
        insert_child(tree, prev, heading)
    end
  end

  # Since parent may be nested, we need to traverse the whole tree
  defp find_parent([], _parent_key), do: nil

  defp find_parent(_tree, nil), do: nil

  defp find_parent(tree, parent_key) do
    # Start by inverting; it's more likely to be near the end
    tree
    |> Enum.reverse()
    |> Enum.reduce(nil, &find_parent_reducer(&1, &2, parent_key))
  end

  defp find_parent_reducer(%{key: key} = t, nil, parent_key) when key == parent_key, do: t

  defp find_parent_reducer(%{children: children}, nil, parent_key) when children != [],
    do: find_parent(children, parent_key)

  defp find_parent_reducer(_t, nil, _parent_key), do: nil
  defp find_parent_reducer(_t, acc, _parent_key), do: acc

  defp insert_child(tree, prev, heading) do
    heading = heading |> Map.put(:parent, prev.key)
    prev = prev |> Map.put(:children, prev.children ++ [heading])
    {tree, prev, heading}
  end
end
