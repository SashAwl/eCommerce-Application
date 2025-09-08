import { Cart } from '@commercetools/platform-sdk';
import { ctpClient } from '../BuildClient';

const addItemToCart = async (
    id: string,
    cartId: string,
    cartVersion: number
): Promise<Cart | void> => {
    try {
        const response = await ctpClient.execute({
            uri: `/mergemates2/carts/${cartId}`,
            method: 'POST',
            body: {
                version: cartVersion,
                actions: [
                    {
                        action: 'addLineItem',
                        productId: id,
                        quantity: 1,
                    },
                ],
            },
        });

        const cartData = response.body as Cart;
        return cartData;
    } catch (error) {
        console.error('Error fetching cart data:', error);
    }
};
export default addItemToCart;
