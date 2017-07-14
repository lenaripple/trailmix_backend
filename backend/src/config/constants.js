const devConfig = {
  MONGO_URL: 'mongodb://localhost/trailmix_final-dev',
  JWT_SECRET: 'secret'
};
const testConfig = {
  MONGO_URL: 'mongodb://localhost/trailmix_final-test'
};
const prodConfig = {
  MONGO_URL: 'mongodb://heroku_g6cmp0qw:ee953ghad3t5pp149m7etmilef@ds157702.mlab.com:57702/heroku_g6cmp0qw',
  JWT_SECRET: 'secret'
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
