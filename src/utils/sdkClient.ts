import { ctpClient } from './BuildClient';
import {
    //  ApiRoot,
    createApiBuilderFromCtpClient,
} from '@commercetools/platform-sdk';

// Create apiRoot from the imported ClientBuilder and include your Project key
const apiRoot = createApiBuilderFromCtpClient(ctpClient).withProjectKey({
    projectKey: 'mergemates',
});

// Example call to return Project information
// This code has the same effect as sending a GET request to the commercetools Composable Commerce API without any endpoints.

// Retrieve Project information and output the result to the log

//createApiBuilderFromCtpClient(client: Client, baseUri?: string): ApiRoot;
export default apiRoot;
