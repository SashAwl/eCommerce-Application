import { LineItem } from '@commercetools/platform-sdk';
import { Minus, Plus, Trash2 } from 'lucide-react';
import updateItemQuantity from '../../utils/cart/updateItemQuantity';
import removeItemFromCart from '../../utils/cart/removeItemFromCart';
import { useState } from 'react';
import { useGameStore } from '../../store/store';
export const CartItem = (game: LineItem) => {
    const [isDeleteButtonDisabled, setDeleteButtonDisabled] = useState(false);
    const [isCountButtonsDisabled, setCountButtonsDisabled] = useState(false);
    const {
        cartId,
        cartVersion,
        setCardVersion,
        showSuccessMessage,
        showStandardErrorMessage,
    } = useGameStore();
    function removeItem(id: string): void {
        setDeleteButtonDisabled(true);
        removeItemFromCart(id, cartId!, cartVersion!)
            .then((data) => {
                if (data) {
                    setCardVersion(data.version);
                    showSuccessMessage(
                        'The game has been successfully removed from the cart.'
                    );
                }
            })
            .catch(() => {
                showStandardErrorMessage();
            })
            .finally(() => {
                setTimeout(() => {
                    setDeleteButtonDisabled(false);
                }, 1500);
            });
    }

    function updateQuantity(id: string, quantity: number): void {
        setCountButtonsDisabled(true);
        updateItemQuantity(id, cartId!, cartVersion!, quantity)
            .then((data) => {
                if (data) {
                    setCardVersion(data.version);
                }
            })
            .catch(() => {
                showStandardErrorMessage();
            })
            .finally(() => {
                setCountButtonsDisabled(false);
            });
    }
    return (
        <div key={game.id} className={'cartItem'}>
            <div className={'itemContent'}>
                {game.variant.images && (
                    <img
                        src={game.variant.images[0].url}
                        alt={game.name['en-US']}
                        className={'itemImage'}
                    />
                )}

                <div className={'itemDetails'}>
                    <h3 className={'itemTitle'}>{game.name['en-US']}</h3>
                    <div className={'itemPricing'}>
                        {game.price.discounted?.value.centAmount ? (
                            <>
                                <span className={'currentPrice'}>
                                    $
                                    {(
                                        game.price.discounted?.value
                                            .centAmount / 100
                                    ).toFixed(2)}
                                </span>
                                <span className={'originalPrice'}>
                                    ${game.price.value.centAmount / 100}
                                </span>
                            </>
                        ) : (
                            <span className={'currentPrice'}>
                                $
                                {(game.price.value.centAmount / 100).toFixed(2)}
                            </span>
                        )}
                    </div>

                    <div className={'itemActions'}>
                        <div className={'quantityControls'}>
                            <button
                                onClick={() =>
                                    updateQuantity(game.id, game.quantity - 1)
                                }
                                className={'quantityButton'}
                                disabled={
                                    game.quantity <= 1 || isCountButtonsDisabled
                                }
                            >
                                <Minus />
                            </button>

                            <span className={'quantityDisplay'}>
                                {game.quantity}
                            </span>

                            <button
                                onClick={() =>
                                    updateQuantity(game.id, game.quantity + 1)
                                }
                                className={'quantityButton'}
                                disabled={isCountButtonsDisabled}
                            >
                                <Plus />
                            </button>
                            <div className="totalGamePrice">
                                <span className={'currentPrice'}>
                                    Total: $
                                    {game.price.discounted?.value.centAmount
                                        ? (
                                              (game.price.discounted?.value
                                                  .centAmount *
                                                  game.quantity) /
                                              100
                                          ).toFixed(2)
                                        : (
                                              (game.price.value.centAmount *
                                                  game.quantity) /
                                              100
                                          ).toFixed(2)}
                                </span>
                            </div>
                        </div>

                        <button
                            onClick={() => removeItem(game.id)}
                            className={'removeButton'}
                            disabled={isDeleteButtonDisabled}
                        >
                            <Trash2 />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
