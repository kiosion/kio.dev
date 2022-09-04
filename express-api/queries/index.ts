const POSTS_PROJECTION = `
{
  _type,
  _rev,
  "objectID": _id,
  _id,
  title,
  "author": {
    "_id": author->_id,
    "_type": author->_type,
    "name": author->name,
    "image": author->image,
    "slug": author->slug
  },
  body,
  desc,
  date,
  "tags": tags[]->{
    _id,
    title,
    slug
  }, 
 slug,
 "numberOfCharacters": length(pt::text(body)),
 "estimatedWordCount": round(length(pt::text(body)) / 5),
 "estimatedReadingTime": round(length(pt::text(body)) / 5 / 120 )
}
`;

export { POSTS_PROJECTION };
