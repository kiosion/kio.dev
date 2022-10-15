defmodule Hexerei.BuildQuery do
  @moduledoc """
  Build a Sanity query from template
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

  def projectSingle(_id, _slug) do
    # TODO
  end

  def projectMany(_limit, _skip, _s, _o, _date, _tags) do
    # TODO
  end

  # Query all tag documents
  def tags do
    # TODO
  end

  # Determine documents of @type referencing tag @slug
  def tagHas(_type, _slug) do
    # TODO
  end

  # Fetch comment with '_id' of @id
  def comment(id) do
    if id == nil || id == '' do
      nil
    else
      "
        *[!(_id in path('drafts.**')) && _type == 'comment' && _id == '#{id}']{
          _id,
          _rev,
          _type,
          title,
          body,
          'document': {
            '_id': document->_id,
            'slug': document->slug,
            'title': document->title
          },
          approved,
          verified
        }[0]
      " |> strip()
    end
  end

  # Fetch comments on document @ref (slug || id), unless @force is provided, hide unapproved
  def commentsOn(ref, force) do
    if ref == nil || ref == '' do
      nil
    else
      "
        *[!(_id in path('drafts.**')) && _type == 'comment' #{if force != true do " && approved == true " end}]{
          _id,
          _rev,
          _type,
          title,
          body,
          'document': {
            '_id': document->_id,
            'slug': document->slug,
            'title': document->title
          },
          approved,
          verified
        }
      " |> strip()
    end
  end
end
