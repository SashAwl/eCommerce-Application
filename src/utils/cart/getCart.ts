import { Cart } from '@commercetools/platform-sdk';
import { ctpClient } from '../BuildClient';

const getCart = async (cartId: string): Promise<Cart | void> => {
    try {
        if (cartId) {
            const response = await ctpClient.execute({
                uri: `/mergemates2/carts/${cartId}`,
                method: 'GET',
            });
            const cartData = response.body as Cart;
            return cartData;
        }
    } catch (error) {
        console.error('Error fetching cart data:', error);
    }
};

export default getCart;
