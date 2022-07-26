import replace from '@rollup/plugin-replace';

const production = !process.env.ROLLUP_WATCH;

export default {
  plugins: [
    replace({
      process: JSON.stringify({
        env: {
          IS_PROD: production,
          BASE_URL: production ? 'https://kio.dev' : 'http://localhost:5173',
          API_URL: production ? 'https://api.kio.dev' : 'http://localhost:4000'
        }
      })
    })
  ]
};
