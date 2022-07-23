import { writable } from 'svelte/store';

// Writables
const posts = writable([]);

// Fetch funcs
// Temp for now, just fetches from pokeapi. To be replaced with Sanity fetch
const fetchPosts = async (limit: number) => {
  const url = `https://pokeapi.co/api/v2/pokemon?limit=${limit}`;
  const res = await fetch(url);
  const data = await res.json();
  const loadedData = data.results?.map((item: any, index: number) => {
    return {
      name: item?.name,
      id: index + 1,
      image: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${
        index + 1
      }.png`
    };
  });
  posts.set(loadedData);
};

const getPost = async (id: number) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ title: id } as any);
    }, 1000);
  });
};

export { posts, fetchPosts, getPost };
