const devConfig = {
  MONGO_URL: 'mongodb://localhost/trailmix_final-dev',
  JWT_SECRET: 'thsisasecret'
};
const testConfig = {
  MONGO_URL: 'mongodb://localhost/trailmix_final-test'
};
const prodConfig = {
  MONGO_URL: 'mongodb://heroku_s5l7r9nz:6r61pv6u8smkv8s2q4dvdn77nk@ds157282.mlab.com:57282/heroku_s5l7r9nz'
};
const defaultConfig = {
  PORT: process.env.PORT || 3000,
};

function envConfig(env){
  switch (env){
    case 'development':
      return devConfig;
    case 'test':
      return testConfig;
    default:
      return prodConfig;
  }
}

export default {
  ...defaultConfig,
  ...envConfig(process.env.NODE_ENV),
};
