export const endpointResponse = (content: Record<string, unknown>, status = 200) => {
  return new Response(JSON.stringify(content), {
    headers: {
      'content-type': 'application/json; charset=utf-8'
    },
    status
  });
};
