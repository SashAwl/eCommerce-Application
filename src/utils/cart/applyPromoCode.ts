import { Cart, ErrorObject } from '@commercetools/platform-sdk';
import { BasketPromoState, IGameStore } from '../../store/store';
import { ctpClient } from '../BuildClient';

export function applyPromoCode(
    basketState: BasketPromoState,
    gameStore: IGameStore
) {
    const { setAppliedPromoCode, promoCode, setApplyPromoButtonDisabled } =
        basketState;
    const {
        cartId,
        cartVersion,
        setCardVersion,
        showSuccessMessage,
        showStandardErrorMessage,
        showErrorMessage,
    } = gameStore;
    setApplyPromoButtonDisabled(true);
    if (promoCode.trim() === '') return;
    ctpClient
        .execute({
            uri: `/mergemates/carts/${cartId}`,
            method: 'POST',
            body: {
                version: cartVersion,
                actions: [
                    {
                        action: 'addDiscountCode',
                        code: promoCode,
                    },
                ],
            },
        })
        .then((data) => {
            const result = data.body as Cart;
            setCardVersion(result.version);
            setAppliedPromoCode(promoCode);
            showSuccessMessage(
                `Promo code '${promoCode}' successfully applied`
            );
        })
        .catch((err: ErrorObject) => {
            const code = err.code;
            if (code && code === 'DiscountCodeNonApplicable') {
                showErrorMessage(
                    `Promo code '${promoCode}' is not used or has expired`
                );
                setApplyPromoButtonDisabled(false);
            } else {
                showStandardErrorMessage();
            }
        })
        .finally(() => {
            setTimeout(() => {
                setApplyPromoButtonDisabled(false);
            }, 1500);
        });
}
