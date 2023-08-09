defmodule Hexerei.PT do
  require Logger

  def build_summary(blocks) do
    try do
      headings =
        blocks
        |> Enum.filter(fn b ->
          b["style"] != nil and b["style"] in ["h1", "h2", "h3", "h4", "h5", "h6"]
        end)
        |> Enum.map(&build_heading/1)

      make_tree(headings)
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

  defp make_tree(headings) do
    Enum.reduce(headings, {[], nil}, fn heading, {tree, prev} ->
      prev =
        case prev do
          nil ->
            heading

          _ ->
            prev
        end

      {updated_tree, updated_prev, updated_heading} =
        cond do
          prev.typeLevel < heading.typeLevel ->
            insert_child(tree, prev, heading)

          prev.typeLevel >= heading.typeLevel ->
            check_for_parent(tree, prev, heading)
        end

      updated_tree2 =
        update_tree(updated_tree, updated_prev)
        |> update_tree(updated_heading)

      {updated_tree2, updated_heading}
    end)
  end

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
    |> Enum.reduce(nil, fn t, acc ->
      case acc do
        nil ->
          cond do
            t.key == parent_key ->
              t

            t.children != [] ->
              find_parent(t.children, parent_key)

            true ->
              nil
          end

        _ ->
          acc
      end
    end)
  end

  defp insert_child(tree, prev, heading) do
    heading = heading |> Map.put(:parent, prev.key)
    prev = prev |> Map.put(:children, prev.children ++ [heading])
    {tree, prev, heading}
  end

  defp update_tree(tree, prev) do
    result =
      Enum.map(tree, fn t ->
        if t.key == prev.key do
          {:ok, prev}
        else
          t
        end
      end)

    case Enum.find(result, fn r -> r == {:ok, prev} end) do
      nil ->
        Enum.map(result, fn r ->
          if r.children != [] do
            Map.update!(r, :children, &update_tree(&1, prev))
          else
            r
          end
        end)

      _ ->
        result
        |> Enum.map(fn r ->
          case r do
            {:ok, prev} ->
              prev

            _ ->
              r
          end
        end)
    end
  end
end
