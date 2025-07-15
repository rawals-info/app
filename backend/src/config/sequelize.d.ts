import { Options } from 'sequelize';

declare module 'sequelize' {
  interface Options {
    use_env_variable?: string;
  }
}

export {}; 