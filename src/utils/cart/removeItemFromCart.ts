import { Cart } from '@commercetools/platform-sdk';
import { ctpClient } from '../BuildClient';

const removeItemFromCart = async (
    id: string,
    cartId: string,
    cartVersion: number
): Promise<Cart | void> => {
    try {
        const response = await ctpClient.execute({
            uri: `/mergemates/carts/${cartId}`,
            method: 'POST',
            body: {
                version: cartVersion,
                actions: [
                    {
                        action: 'removeLineItem',
                        lineItemId: id,
                    },
                ],
            },
        });

        const cartData = response.body as Cart;

        return cartData;
    } catch (error) {
        console.error('Error fetching cart data:', error);
        throw error;
    }
};
export default removeItemFromCart;
