import { Cart } from '@commercetools/platform-sdk';
import { ctpClient } from '../BuildClient';

const createCart = async (): Promise<Cart | void> => {
    try {
        const response = await ctpClient.execute({
            uri: `/mergemates/carts`,
            method: 'POST',
            body: {
                currency: 'USD',
                lineItems: [],
            },
        });
        console.log('Cart created:', response);
        return response.body as Cart;
    } catch (error) {
        console.error('Error creating cart:', error);
    }
};
export default createCart;
