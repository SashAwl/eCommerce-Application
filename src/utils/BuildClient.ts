import {
    ClientBuilder,

    // Import middlewares
    type AuthMiddlewareOptions, // Required for auth
    type HttpMiddlewareOptions, // Required for sending HTTP requests
} from '@commercetools/ts-client';

// Configure authMiddlewareOptions
const authMiddlewareOptions: AuthMiddlewareOptions = {
    host: 'https://auth.australia-southeast1.gcp.commercetools.com',
    projectKey: 'mergemates',
    credentials: {
        clientId: 'dZnENdU2BB32IKq7Bc_0AlsW',
        clientSecret: 'WYfOviHMQFxXFNtWurOwi_wBkZKTUHvp',
    },
    scopes: ['manage_project:mergemates'],
    httpClient: fetch,
};

// Configure httpMiddlewareOptions
const httpMiddlewareOptions: HttpMiddlewareOptions = {
    host: 'https://api.australia-southeast1.gcp.commercetools.com',
    httpClient: fetch,
};

// Export the ClientBuilder
export const ctpClient = new ClientBuilder()
    .withClientCredentialsFlow(authMiddlewareOptions)
    .withHttpMiddleware(httpMiddlewareOptions)
    .withLoggerMiddleware()
    .build();
