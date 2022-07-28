import { createServer, Model } from 'miragejs';

export function makeServer({ environment = 'development' } = {}) {
  const server = createServer({
    environment,
    models: {
      post: Model
    },
    seeds(server) {
      server.create('post', {
        _id: '1',
        _type: 'post',
        date: '2020-01-02',
        desc: "Something very interesting I'm sure",
        slug: {
          current: 'post-1'
        },
        title: 'Post 1'
      });
    },
    routes() {
      this.namespace = 'api';
      this.timing = 1000;

      this.get('/getPost', (schema, req) => {
        const posts = schema.posts.all().models[0];
        return {
          meta: {
            length: schema.posts.all().models.length || 0,
            filter: req.queryParams || null
          },
          data: posts || null
        };
      });
      this.get('/getPosts', (schema, req) => {
        const posts = schema.posts.all().models;
        const data = {
          meta: {
            length: schema.posts.all().length,
            filter: req.queryParams || null
          },
          data: posts
        };
        return data;
      });
    }
  });

  return server;
}
