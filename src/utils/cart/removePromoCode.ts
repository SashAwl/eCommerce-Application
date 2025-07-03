import { Cart } from '@commercetools/platform-sdk';
import { BasketPromoState, IGameStore } from '../../store/store';
import { ctpClient } from '../BuildClient';
import getCart from './getCart';

export function removePromoCode(
    basketState: BasketPromoState,
    gameStore: IGameStore
) {
    const { setAppliedPromoCode, setPromoCode, setRemovePromoButtonDisabled } =
        basketState;
    const {
        cartId,
        cartVersion,
        setCardVersion,
        showSuccessMessage,
        showStandardErrorMessage,
    } = gameStore;

    setRemovePromoButtonDisabled(true);
    getCart(cartId!)
        .then((data) => {
            if (data) {
                ctpClient
                    .execute({
                        uri: `/mergemates2/carts/${cartId}`,
                        method: 'POST',
                        body: {
                            version: cartVersion,
                            actions: [
                                {
                                    action: 'removeDiscountCode',
                                    discountCode: {
                                        typeId: 'discount-code',
                                        id: data.discountCodes[0].discountCode
                                            .id,
                                    },
                                },
                            ],
                        },
                    })
                    .then((data) => {
                        const body = data.body as Cart;
                        setCardVersion(body.version);
                        setPromoCode('');
                        setAppliedPromoCode('');
                        showSuccessMessage(
                            'The promo code has been removed from your shopping cart.'
                        );
                    })
                    .catch((err) => {
                        throw err;
                    });
            }
        })
        .catch(() => {
            showStandardErrorMessage();
        })
        .finally(() => {
            setTimeout(() => {
                setRemovePromoButtonDisabled(false);
            }, 1500);
        });
}
