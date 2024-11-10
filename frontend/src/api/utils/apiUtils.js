import axios from 'axios';

export const createApiClientWithRetry = (baseConfig) => {
    const client = axios.create(baseConfig);

    client.interceptors.response.use(
        response => response,
        async error => {
            if (error.response) {
                if (error.response.status === 429) {
                    const retryAfter = error.response.headers['retry-after'] || 10;
                    await new Promise(resolve => setTimeout(resolve, retryAfter * 1000));
                    return client(error.config);
                }
                
                if (error.response.status === 503) {
                    await new Promise(resolve => setTimeout(resolve, 5000));
                    return client(error.config);
                }
            }
            throw error;
        }
    );

    return client;
};