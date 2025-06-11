import { Cart } from '@commercetools/platform-sdk';
import { ctpClient } from '../BuildClient';

const isProductInCart = async (
    cartId: string,
    productId: string
): Promise<boolean> => {
    try {
        const response = await ctpClient.execute({
            uri: `/mergemates/carts/${cartId}`,
            method: 'GET',
        });

        const cartData = response.body as Cart;
        const lineItems = cartData.lineItems;

        const productInCart = lineItems.some(
            (item) => item.productId === productId
        );
        const idLLL = lineItems.map((item) => item.productId);
        console.log(idLLL, productId);

        return productInCart;
    } catch (error) {
        console.error('Error fetching cart data:', error);
        return false;
    }
};
export default isProductInCart;
