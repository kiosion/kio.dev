import SanityClient from '../client';

module SanityFetch {
  // Placeholder for the fetch function, to be replaced by the actual fetch function
  export const query = (query: string, params: any = {}) => {
    return SanityClient.client.fetch(query, params);
  }
  export const urlFor = (source: any) => {
    return SanityClient.urlFor(source);
  }
}

export default SanityFetch;
