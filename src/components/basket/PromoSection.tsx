import { Tag, Trash2 } from 'lucide-react';
import { useBasketPromoState, useGameStore } from '../../store/store';
import { removePromoCode } from '../../utils/cart/removePromoCode';
import { applyPromoCode } from '../../utils/cart/applyPromoCode';

export function PromoSection() {
    const gameStore = useGameStore();

    const basketState = useBasketPromoState();
    const {
        appliedPromoCode,
        promoCode,
        setPromoCode,
        isRemovePromoButtonDisabled,
        isApplyPromoButtonDisabled,
    } = basketState;

    function removePromoCodehandler() {
        removePromoCode(basketState, gameStore);
    }

    function applyPromoCodeHandler() {
        applyPromoCode(basketState, gameStore);
    }

    return (
        <div className={'promoSection'}>
            {!appliedPromoCode ? (
                <div className={'promoInputContainer'}>
                    <input
                        type="text"
                        placeholder="Enter promo code"
                        value={promoCode}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                            if (e.target.value) {
                                setPromoCode(e.target.value);
                            }
                        }}
                        className={'promoInput'}
                    />
                    <button
                        onClick={applyPromoCodeHandler}
                        disabled={
                            !promoCode.trim() || isApplyPromoButtonDisabled
                        }
                        className={'promoButton'}
                    >
                        <Tag />
                        Apply
                    </button>
                </div>
            ) : (
                <div className={'appliedPromo'}>
                    <span className={'appliedPromoText'}>
                        Code: {appliedPromoCode}
                    </span>
                    <button
                        onClick={removePromoCodehandler}
                        className={'removePromoButton'}
                        disabled={isRemovePromoButtonDisabled}
                    >
                        <Trash2 />
                    </button>
                </div>
            )}
        </div>
    );
}
