import { defineQuery } from 'groq';

export const GetConfigQuery = defineQuery("*[_type == 'siteSettings'][0]");

export const GetPostQuery = defineQuery(
  `*[_type == 'post' && slug.current == $slug]{
  _id,
  'objectID': _id,
  _rev,
  _type,
  _createdAt,
  title,
  publishedAt,
  tags[]->{
    _id,
    title,
    slug
  },
  slug,
  body,
  desc,
  'date': select(
    defined(date) => date + 'T00:00:00Z',
    true => _createdAt
  ),
  'views': coalesce(views, 0),
  'numberOfCharacters': length(pt::text(body)),
  'estimatedWordCount': round(length(pt::text(body)) / 5),
  'estimatedReadingTime': round(length(pt::text(body)) / 5 / 120)
}[0]`,
);

export const GetPostsQuery = defineQuery(`*[_type == 'post']{
  _id,
  'objectID': _id,
  _rev,
  _type,
  _createdAt,
  title,
  publishedAt,
  tags[]->{
    _id,
    title,
    slug
  },
  slug,
  body,
  desc,
  'date': dateTime(select(
    defined(date) => date + 'T00:00:00Z',
    true => _createdAt
  )),
  'views': coalesce(views, 0),
  'numberOfCharacters': length(pt::text(body)),
  'estimatedWordCount': round(length(pt::text(body)) / 5),
  'estimatedReadingTime': round(length(pt::text(body)) / 5 / 120)
} | order(date desc) [$startNumber...$endNumber]`);

export const CountPostsQuery = defineQuery("count(*[_type == 'post'])");
