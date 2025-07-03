import {
    ClientBuilder,

    // Import middlewares
    type AuthMiddlewareOptions, // Required for auth
    type HttpMiddlewareOptions, // Required for sending HTTP requests
} from '@commercetools/ts-client';

// Configure authMiddlewareOptions
const authMiddlewareOptions: AuthMiddlewareOptions = {
    host: 'https://auth.australia-southeast1.gcp.commercetools.com',
    projectKey: 'mergemates2',
    credentials: {
        clientId: '8Eb-YznBTHm7YOSsr2N-jTD4',
        clientSecret: 'ahy5m5FtQXXky9Jnv9oVKhpMQWqfCDfq',
    },
    scopes: [
        'create_anonymous_token:mergemates2',
        'manage_customers:mergemates2',
        'view_published_products:mergemates2',
        'manage_cart_discounts:mergemates2',
        'view_products:mergemates2',
        'manage_orders:mergemates2',
        'manage_my_profile:mergemates2',
    ],
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
    .build();

// import {
//     ClientBuilder,

//     // Import middlewares
//     type AuthMiddlewareOptions, // Required for auth
//     type HttpMiddlewareOptions, // Required for sending HTTP requests
// } from '@commercetools/ts-client';

// // Configure authMiddlewareOptions
// const authMiddlewareOptions: AuthMiddlewareOptions = {
//     host: 'https://auth.australia-southeast1.gcp.commercetools.com',
//     projectKey: 'mergemates',
//     credentials: {
//         clientId: 'dZnENdU2BB32IKq7Bc_0AlsW',
//         clientSecret: 'WYfOviHMQFxXFNtWurOwi_wBkZKTUHvp',
//     },
//     scopes: ['manage_project:mergemates'],
//     httpClient: fetch,
// };

// // Configure httpMiddlewareOptions
// const httpMiddlewareOptions: HttpMiddlewareOptions = {
//     host: 'https://api.australia-southeast1.gcp.commercetools.com',
//     httpClient: fetch,
// };

// // Export the ClientBuilder
// export const ctpClient = new ClientBuilder()
//     .withClientCredentialsFlow(authMiddlewareOptions)
//     .withHttpMiddleware(httpMiddlewareOptions)
//     .build();
