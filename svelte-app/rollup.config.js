import replace from '@rollup/plugin-replace';

const production = !process.env.ROLLUP_WATCH;

export default {
  plugins: [
    replace({
      process: JSON.stringify({
        env: {
          VITE_IS_PROD: production,
          VITE_BASE_URL: production
            ? 'https://kio.dev'
            : 'http://localhost:5173',
          VITE_API_URL: production
            ? 'https://api.kio.dev'
            : 'http://localhost:4000',
          __buildDate__: () => JSON.stringify(new Date())
        }
      })
    })
  ]
};
