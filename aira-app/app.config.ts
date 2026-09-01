import appConfig from './app.json';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

export default () => ({
  ...appConfig.expo,
  extra: {
    ...appConfig.expo.extra,
    apiUrl: process.env.EXPO_PUBLIC_API_URL,
  },
});
