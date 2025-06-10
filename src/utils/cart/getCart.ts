import { Cart } from '@commercetools/platform-sdk';
import { ctpClient } from '../BuildClient';

const getCart = async (cartId: string): Promise<Cart | void> => {
    try {
        const response = await ctpClient.execute({
            uri: `/mergemates/carts/${cartId}`,
            method: 'GET',
        });
        const cartData = response.body as Cart;
        return cartData;
    } catch (error) {
        console.error('Error fetching cart data:', error);
    }
};

export default getCart;
