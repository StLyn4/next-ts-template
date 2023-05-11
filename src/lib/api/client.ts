import axios from 'axios';
import axiosRetry, { exponentialDelay } from 'axios-retry';
import qs from 'qs';

import { env } from 'app/lib/constants';

const client = axios.create({
  baseURL: env.API_URL,
  timeout: 60000,
  paramsSerializer: {
    serialize: (params) => qs.stringify(params, { arrayFormat: 'repeat' }),
  },
});

axiosRetry(client, {
  retries: 2,
  retryDelay: exponentialDelay,
});

export default client;
