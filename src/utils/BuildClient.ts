import {
    ClientBuilder,

    // Import middlewares
    type AuthMiddlewareOptions, // Required for auth
    type HttpMiddlewareOptions, // Required for sending HTTP requests
} from '@commercetools/ts-client';

console.log({
    clientId: import.meta.env.VITE_CT_CLIENT_ID_ADMIN,
    clientSecret: import.meta.env.VITE_CT_CLIENT_SECRET_ADMIN,
    projectKey: import.meta.env.VITE_CT_PROJECT_KEY,
});
// Configure authMiddlewareOptions
const scopes = import.meta.env.VITE_CT_SCOPES_ADMIN || '';
const authMiddlewareOptions: AuthMiddlewareOptions = {
    host: import.meta.env.VITE_CT_AUTH_URL,
    projectKey: import.meta.env.VITE_CT_PROJECT_KEY,
    credentials: {
        clientId: import.meta.env.VITE_CT_CLIENT_ID_ADMIN,
        clientSecret: import.meta.env.VITE_CT_CLIENT_SECRET_ADMIN,
    },
    scopes: scopes.split(' '),
    httpClient: fetch,
};

// Configure httpMiddlewareOptions
const httpMiddlewareOptions: HttpMiddlewareOptions = {
    host: import.meta.env.VITE_CT_API_URL,
    httpClient: fetch,
};

// Export the ClientBuilder
export const ctpClient = new ClientBuilder()
    .withClientCredentialsFlow(authMiddlewareOptions)
    .withHttpMiddleware(httpMiddlewareOptions)
    .withLoggerMiddleware()
    .build();
