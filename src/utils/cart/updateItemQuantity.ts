import { Cart } from '@commercetools/platform-sdk';
import { ctpClient } from '../BuildClient';

const updateItemQuantity = async (
    id: string,
    cartId: string,
    cartVersion: number,
    itemQuantity: number
): Promise<Cart | void> => {
    try {
        const response = await ctpClient.execute({
            uri: `/mergemates2/carts/${cartId}`,
            method: 'POST',
            body: {
                version: cartVersion,
                actions: [
                    {
                        action: 'changeLineItemQuantity',
                        lineItemId: id,
                        quantity: itemQuantity,
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
export default updateItemQuantity;
