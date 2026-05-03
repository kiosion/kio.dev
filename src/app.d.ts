/* eslint-disable-next-line */
/// <reference types="@sveltejs/kit" />

declare namespace App {
  interface Error {
    message: string;
    cause?: (string | { message?: string; detail?: string | { message?: string } })[];
    stack?: string;
  }
}

declare module 'virtual:posts-manifest' {
  import type { PostMetadata } from '$lib/content';
  export const posts: (PostMetadata & { slug: string })[];
}
