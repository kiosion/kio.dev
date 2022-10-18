defmodule Hexerei.BuildQuery do
  @moduledoc """
  Build a Sanity query from template
  """

  defp strip(str) do
    Regex.replace(~r/\s{2,}/, str, " ") |> String.trim()
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
    "
      *[!(_id in path('drafts.**')) && _type == 'post'#{if date != nil do " && date == '#{date}'" end}#{if tags != nil do " && tags[]->title match '#{tags}'" end}] {
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

  def projectSingle(id) do
    "
      *[!(_id in path('drafts.**')) && _type == 'project' && (_id == '#{id}' || slug.current == '#{id}')] {
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
        image,
        tags[]->{
          _id,
          title,
          slug
        },
        slug,
        title
      }[0]
    " |> strip()
  end

  def projectMany(date, tags) do
    "
      *[!(_id in path('drafts.**')) && _type == 'post'#{if date != nil do " && date == '#{date}'" end}#{if tags != nil do " && tags[]->title match '#{tags}'" end}] {
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
        image,
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

  # Query all tag documents
  def tags(type) do
    if type not in ["post", "project"] do
      ^type = nil
    end
    "
      *[!(_id in path('drafts.**')) && _type == 'tag'] {
        _id,
        _rev,
        'objectID': _id,
        _type,
        title,
        slug,
        #{if type != nil do "'referencedBy': *[_type == '#{type}' && references(^._id)]._id" end}
      }
    " |> strip()
  end

  # Determine documents of @type referencing tag @id
  def tag(id, type) do
    if type not in ["post", "project"] do
      nil
    else
      "
      *[!(_id in path('drafts.**')) && _type == '#{type}' && references(*[!(_id in path('drafts.**')) && _type == 'tag' && slug.current == '#{id}']._id)] {
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

  # Fetch 'about' page content
  def about do
    "
      *[!(_id in path('drafts.**')) && _type == 'author' && _id == 'd50256da-3199-4208-ad93-359a818f01df']{
        _id,
        'objectID': _id,
        _rev,
        _type,
        bio,
        body,
        timeline[]{
          title,
          subtitle,
          range,
          skills[]->{
            _id,
            title,
            slug
          },
          body
        },
        image,
        name,
        slug
      }[0]
    " |> strip()
  end

  # Fetch site config
  def config do
    "
      *[!(_id in path(\'drafts.**\')) && _type == 'siteSettings'][0]
    " |> strip()
  end

  # Fetch comment with '_id' of @id
  def comment(id) do
    if id == nil || id == '' do
      nil
    else
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
  end

  # Fetch comments on document @ref (slug || id), unless @force is provided, hide unapproved
  def commentsOn(ref, force) do
    if ref == nil || ref == '' do
      nil
    else
      "
        *[!(_id in path('drafts.**')) && _type == 'comment' #{if force != true do " && approved == true " end}]{
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
        }
      " |> strip()
    end
  end
end
