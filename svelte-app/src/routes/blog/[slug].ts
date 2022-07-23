// Import DB fetch
import { getPost } from '@/stores/posts';

/** @type {import('./__types/[slug]').RequestHandler} */
export async function GET({ params }) {
  const post = await getPost(params.slug);

  if (post) {
    console.log('GET', post);
    return {
      status: 200,
      headers: {},
      body: { post }
    };
  }

  return {
    status: 404
  };
}
