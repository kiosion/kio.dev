defmodule Hexerei.BuildQuery do
  @moduledoc """
  Build a Sanity query from template and params
  """

  defp strip(str) do
    Regex.replace(~r/\s{2,}/, str, " ") |> String.trim()
  end

  def postSingle(id, slug) do
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

  def postMany(limit, skip, s, o, date, tags) do
    if limit == nil and skip == nil and s == nil and o == nil and date == nil and tags == nil do
      nil
    else
      "
        *[!(_id in path('drafts.**')) && _type == 'post' && #{if date != nil do "date == '#{date}'" end} && #{if tags != nil do "tags[]->title match '#{tags}'" end}] | order(#{o} #{s}) [#{skip}...#{skip + limit}] {
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
        }
      " |> strip()
    end
  end
end
