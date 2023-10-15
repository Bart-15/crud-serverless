require('dotenv').config().parsed;

interface ENV {
  AWS_ACCESS_KEY_ID: string | undefined;
  AWS_SECRET_ACCESS_KEY: string | undefined;
  AWS_REGION: string | undefined;
}

interface Config {
  AWS_ACCESS_KEY_ID: string;
  AWS_SECRET_ACCESS_KEY: string;
  AWS_REGION: string;
}

export const getConfig = (): ENV => {
  return {
    AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID,
    AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY,
    AWS_REGION: process.env.AWS_REGION,
  };
};

const getSanitezedConfig = (config: ENV): Config => {
  for (const [key, value] of Object.entries(config)) {
    if (value === undefined) {
      throw new Error(`Missing key ${key} in config.env`);
    }
  }
  return config as Config;
};

const config = getConfig();

const sanitizedConfig = getSanitezedConfig(config);

export default sanitizedConfig; 
