defmodule Hexerei.BuildQuery do
  @moduledoc """
  Build a Sanity query from template and params
  """

  defp strip(str) do
    Regex.replace(~r/\s{2,}/, str, " ") |> String.trim()
  end

  def singlePost(id, slug) do
    # If neither ID nor slug is provided, return nil
    if id == nil and slug == nil do
      nil
    else
      "
        *[!(_id in path('drafts.**')) && _type == 'post' && #{if id != nil do "_id == '#{id}'" else "slug.current == '#{slug}'" end}] {
          _id,
          'objectID': _id,
          _rev,
          _type,
          title,
          publishedAt,
          'author': {
            '_id': author->_id,
            '_type': author->_type,
            'name': author->name,
            'image': author->image,
            'slug': author->slug
          },
          tags[]->{
            _id,
            title,
            slug
          },
          slug,
          body,
          desc,
          date,
          'numberOfCharacters': length(pt::text(body)),
          'estimatedWordCount': round(length(pt::text(body)) / 5),
          'estimatedReadingTime': round(length(pt::text(body)) / 5 / 120 )
        }[0]
      " |> strip()
    end
  end
end
