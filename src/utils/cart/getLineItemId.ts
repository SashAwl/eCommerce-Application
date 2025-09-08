import { Cart } from '@commercetools/platform-sdk';
import { ctpClient } from '../BuildClient';

const getLineItemId = async (
    cartId: string,
    productId: string
): Promise<string> => {
    try {
        const response = await ctpClient.execute({
            uri: `/mergemates2/carts/${cartId}`,
            method: 'GET',
        });

        const cartData = response.body as Cart;
        const lineItems = cartData.lineItems;

        const productIndex = lineItems.findIndex((item) => {
            return item.productId === productId;
        });

        return lineItems[productIndex].id;
    } catch (error) {
        console.error('Error fetching cart data:', error);
        return '';
    }
};
export default getLineItemId;
