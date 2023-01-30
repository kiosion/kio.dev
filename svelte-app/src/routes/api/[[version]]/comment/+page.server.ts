import type { Actions } from './$types';

export const actions: Actions = {
  post: async ({ cookies, request }) => {
    console.log({ cookies, request });

    // artificial timeout to test loading state
    await new Promise((resolve) => setTimeout(resolve, 4000));

    return { success: true };
  }
};
