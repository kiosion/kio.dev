defmodule Hexerei.BuildQuery do
  @moduledoc """
  Build a Sanity query from template
  """

  defp strip(str) do
    str
    |> String.trim()
    |> String.replace(~r/[\r\n]+/, " ")
    |> String.replace(~r/\s{2,}/, " ")
  end

  def postSingle(id) do
    if id == nil or id == "" do
      nil
    else
      "
        *[!(_id in path('drafts.**')) && _type == 'post' && (_id == '#{id}' || slug.current == '#{id}')] {
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

  def postMany(date, tags) do
    query = """
      *[!(_id in path('drafts.**')) && _type == 'post'#{if date != nil do " && date == '#{date}'" end}#{if tags != nil do " && tags[]->slug.current match '#{tags}'" end}] {
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
    """
    query |> strip()
  end

  def projectMany(date, tags) do
    "
      *[!(_id in path('drafts.**')) && _type == 'project'#{if date != nil do " && date == '#{date}'" end}#{if tags != nil do " && tags[]->slug.current match '#{tags}'" end}] {
        _id,
        'objectID': _id,
        _type,
        _rev,
        'author': {
          '_id': author->_id,
          '_type': author->_type,
          'name': author->name,
          'image': author->image,
          'slug': author->slug
        },
        body,
        desc,
        date,
        external,
        externalAuthor,
        externalLinks,
        externalUrl,
        image,
        language,
        'tags': tags[]->{
          _id,
          title,
          slug
        },
        slug,
        title
      }
    " |> strip()
  end

  # Fetch comment with '_id' of @id
  @spec comment(String.t()) :: String.t()
  def comment(id) do
    "
      *[!(_id in path('drafts.**')) && _type == 'comment' && _id == '#{id}']{
        _id,
        'objectID': _id,
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

  # Fetch comments on document @ref (slug || id), unless @force is provided, hide unapproved
  @spec commentsOn(String.t(), boolean() | nil) :: String.t()
  def commentsOn(ref, force) do
    "
      *[!(_id in path('drafts.**')) && _type == 'comment' && (document._ref == '#{ref}' || document->slug.current == '#{ref}')#{if force != true do " && approved == true" end}]{
        _id,
        'objectID': _id,
        _rev,
        _type,
        name,
        email,
        body,
        date,
        children[]->{
          _id,
          'objectID': _id,
          approved
        },
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

  # Fetch all children of comment @id
  @spec commentChildren(String.t(), boolean() | nil) :: String.t()
  def commentChildren(id, force) do
    "
      *[!(_id in path('drafts.**')) && _type == 'comment' && parent._ref == '#{id}'#{if force != true do " && approved == true" end}]{
        _id,
        'objectID': _id,
        _rev,
        _type,
        name,
        email,
        body,
        date,
        children[]->{
          _id,
          'objectID': _id,
          approved
        },
        'document': {
          '_id': document->_id,
          'slug': document->slug,
          'title': document->title
        },
        approved,
        verified
      }
    "
  end
end
