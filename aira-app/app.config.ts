import appConfig from './app.json';

export default () => ({
  ...appConfig.expo,
  extra: {
    ...appConfig.expo.extra,
    apiUrl: process.env.PUBLIC_URL,
  },
});
