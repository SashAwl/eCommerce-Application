import { useEffect, useState } from 'react';

import './Cart.scss';
import { Link } from 'react-router-dom';
import { Minus, Plus, ShoppingCart, Tag, Trash2 } from 'lucide-react';
import { useGameStore } from '../../store/store';
import createCart from '../../utils/cart/createCart';
import getCart from '../../utils/cart/getCart';
import { Cart, ErrorObject, LineItem } from '@commercetools/platform-sdk';
import {
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
    CartItem,
} from '../../components/basket/card';
import updateItemQuantity from '../../utils/cart/updateItemQuantity';
import removeItemFromCart from '../../utils/cart/removeItemFromCart';

import apiRoot from '../../utils/sdkClient';
import { ctpClient } from '../../utils/BuildClient';

export default function CartPage() {
    const {
        cartId,
        cartVersion,
        setCardId,
        setCardVersion,
        setSuccessMessage,
        setErrorMessage,
    } = useGameStore();
    const [cartItems, setCartItems] = useState<LineItem[]>([]);
    const [isDeleteButtonDisabled, setDeleteButtonDisabled] = useState(false);
    const [isCountButtonsDisabled, setCountButtonsDisabled] = useState(false);
    const [subtotal, setSubtotal] = useState(0);
    const [discount, setDiscount] = useState(0);
    const [total, setTotal] = useState(0);
    const [promoCode, setPromoCode] = useState('');
    const [appliedPromoCode, setAppliedPromoCode] = useState('');

    useEffect(() => {
        if (!cartId) {
            createCart()
                .then((data) => {
                    if (data) {
                        setCardId(data.id);
                        setCardVersion(data.version);
                    }
                })
                .catch((err) => {
                    console.log(err);
                });
        } else {
            getCart(cartId ?? '')
                .then((data) => {
                    console.log(data);
                    if (data) {
                        setCartItems(() => {
                            return [...data.lineItems];
                        });
                        setCardVersion(data.version);
                        cahngeTotalPrice(
                            data.totalPrice.centAmount,
                            data.lineItems.reduce((acc, curr) => {
                                const price =
                                    curr.price.discounted?.value.centAmount ??
                                    curr.price.value.centAmount;
                                return acc + price * curr.quantity;
                            }, 0)
                        );
                        if (data.discountCodes.length) {
                            apiRoot
                                .discountCodes()
                                .withId({
                                    ID: data.discountCodes[0].discountCode.id,
                                })
                                .get()
                                .execute()
                                .then((data) => {
                                    setAppliedPromoCode(data.body.code);
                                    setPromoCode(data.body.code);
                                })
                                .catch((err) => {
                                    console.log(err);
                                });
                        }
                    }
                })
                .catch((err) => {
                    console.log(err);
                });
        }
    }, [cartVersion, appliedPromoCode]);

    if (cartItems.length === 0) {
        return (
            <div className={'cartContainer'}>
                <div className={'innerContainer'}>
                    <div className={'emptyCart'}>
                        <ShoppingCart className={'emptyCartIcon'} />
                        <h1 className={'emptyCartTitle'}>Your cart is empty</h1>
                        <p className={'emptyCartDescription'}>
                            Add some games to get started!
                        </p>
                        <Link to="/catalog" className={'loginButton'}>
                            Browse Games
                        </Link>
                    </div>
                </div>
            </div>
        );
    }
    function cahngeTotalPrice(totalPrise = 0, subtotal = 0) {
        setDiscount(subtotal - totalPrise);
        setTotal(totalPrise);
        setSubtotal(subtotal);
    }
    function showTempMessage(
        isSuccess: boolean,
        message: string,
        delay = 1500
    ) {
        const clb = isSuccess ? setSuccessMessage : setErrorMessage;
        clb(message);
        setTimeout(() => {
            clb('');
        }, delay);
    }
    function removeItem(id: string): void {
        setDeleteButtonDisabled(true);
        removeItemFromCart(id, cartId!, cartVersion!)
            .then((data) => {
                if (data) {
                    setCardVersion(data.version);
                    showTempMessage(
                        true,
                        'The game has been successfully removed from the cart.'
                    );
                }
                console.log(data);
            })
            .catch((err) => {
                console.log(err);
                showTempMessage(
                    false,
                    'Something went wrong... Try again later'
                );
            })
            .finally(() => {
                setDeleteButtonDisabled(false);
            });
    }

    function updateQuantity(id: string, quantity: number): void {
        setCountButtonsDisabled(true);
        updateItemQuantity(id, cartId!, cartVersion!, quantity)
            .then((data) => {
                if (data) {
                    setCardVersion(data.version);
                }

                console.log(data);
            })
            .catch((err) => {
                console.log(err);
            })
            .finally(() => {
                setCountButtonsDisabled(false);
            });
    }

    function clearCart() {
        console.log('clear start');

        apiRoot
            .carts()
            .withId({ ID: cartId! })
            .delete({
                queryArgs: {
                    version: cartVersion ?? 1,
                },
            })
            .execute()
            .then((data) => {
                console.log(data);
                setCardId(null);
                setCardVersion(null);
                showTempMessage(true, 'Cart delete');
            })
            .catch((err) => {
                console.log(err);
            });
    }
    function applyPromoCode() {
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
                console.log(data);

                if (result.version) {
                    setCardVersion(result.version);
                }

                showTempMessage(
                    true,
                    `Promo code '${promoCode}' successfully applied`
                );

                setAppliedPromoCode(promoCode);
            })
            .catch((err: ErrorObject) => {
                console.error(err);
                const code = err.code;
                if (code && code === 'DiscountCodeNonApplicable') {
                    showTempMessage(
                        false,
                        `Promo code '${promoCode}'is not used or has expired`
                    );
                } else {
                    showTempMessage(
                        false,
                        `Something went wrong... Try again later`
                    );
                }
            });
    }
    return (
        <div className={'cartContainer'}>
            <div className={'innerContainer'}>
                <div className={'headerSection'}>
                    <h1 className={'mainTitle'}>
                        <ShoppingCart />
                        Shopping Cart
                    </h1>
                    <p className={'itemCount'}>
                        {cartItems.length}{' '}
                        {cartItems.length === 1 ? 'item' : 'items'} in your cart
                    </p>
                </div>

                <div className={'cartLayout'}>
                    <div className={'cartItemsSection'}>
                        {cartItems.map((game) => (
                            <CartItem key={game.id} className={'cartItem'}>
                                <div className={'itemContent'}>
                                    {game.variant.images && (
                                        <img
                                            src={game.variant.images[0].url}
                                            alt={game.name['en-US']}
                                            className={'itemImage'}
                                        />
                                    )}

                                    <div className={'itemDetails'}>
                                        <h3 className={'itemTitle'}>
                                            {game.name['en-US']}
                                        </h3>
                                        <div className={'itemPricing'}>
                                            {game.price.discounted?.value
                                                .centAmount ? (
                                                <>
                                                    <span
                                                        className={
                                                            'currentPrice'
                                                        }
                                                    >
                                                        $
                                                        {(
                                                            Number(
                                                                game.price
                                                                    .discounted
                                                                    ?.value
                                                                    .centAmount
                                                            ) / 100
                                                        ).toFixed(2)}
                                                    </span>
                                                    <span
                                                        className={
                                                            'originalPrice'
                                                        }
                                                    >
                                                        $
                                                        {Number(
                                                            game.price.value
                                                                .centAmount
                                                        ) / 100}
                                                    </span>
                                                </>
                                            ) : (
                                                <span
                                                    className={'currentPrice'}
                                                >
                                                    $
                                                    {(
                                                        Number(
                                                            game.price.value
                                                                .centAmount
                                                        ) / 100
                                                    ).toFixed(2)}
                                                </span>
                                            )}
                                        </div>

                                        <div className={'itemActions'}>
                                            <div className={'quantityControls'}>
                                                <button
                                                    onClick={() =>
                                                        updateQuantity(
                                                            game.id,
                                                            game.quantity - 1
                                                        )
                                                    }
                                                    className={'quantityButton'}
                                                    disabled={
                                                        game.quantity <= 1 ||
                                                        isCountButtonsDisabled
                                                    }
                                                >
                                                    <Minus />
                                                </button>

                                                <span
                                                    className={
                                                        'quantityDisplay'
                                                    }
                                                >
                                                    {game.quantity}
                                                </span>

                                                <button
                                                    onClick={() =>
                                                        updateQuantity(
                                                            game.id,
                                                            game.quantity + 1
                                                        )
                                                    }
                                                    className={'quantityButton'}
                                                    disabled={
                                                        isCountButtonsDisabled
                                                    }
                                                >
                                                    <Plus />
                                                </button>
                                            </div>

                                            <button
                                                onClick={() =>
                                                    removeItem(game.id)
                                                }
                                                className={'removeButton'}
                                                disabled={
                                                    isDeleteButtonDisabled
                                                }
                                            >
                                                <Trash2 />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </CartItem>
                        ))}
                    </div>

                    <div className={'summarySection'}>
                        <CartItem className={'summaryCard'}>
                            <CardHeader className={'summaryHeader'}>
                                <CardTitle className={'summaryTitle'}>
                                    Order Summary
                                </CardTitle>
                            </CardHeader>

                            <CardContent className={'summaryContent'}>
                                <div className={'promoSection'}>
                                    {!appliedPromoCode ? (
                                        <div className={'promoInputContainer'}>
                                            <input
                                                type="text"
                                                placeholder="Enter promo code"
                                                value={promoCode}
                                                onChange={(
                                                    e: React.ChangeEvent<HTMLInputElement>
                                                ) => {
                                                    if (e.target.value) {
                                                        setPromoCode(
                                                            e.target.value
                                                        );
                                                    }
                                                }}
                                                className={'promoInput'}
                                            />
                                            <button
                                                onClick={applyPromoCode}
                                                disabled={!promoCode.trim()}
                                                className={'promoButton'}
                                            >
                                                <Tag />
                                                Apply
                                            </button>
                                        </div>
                                    ) : (
                                        <div className={'appliedPromo'}>
                                            <span
                                                className={'appliedPromoText'}
                                            >
                                                Code: {appliedPromoCode}
                                            </span>
                                        </div>
                                    )}
                                </div>

                                <div className={'summaryLine'}>
                                    <span>Subtotal:</span>
                                    <span className={'summaryLineValue'}>
                                        ${(subtotal / 100).toFixed(2)}
                                    </span>
                                </div>

                                {
                                    <div className={'summaryLine'}>
                                        <span>Discount:</span>
                                        <span className={'summaryLineDiscount'}>
                                            -${(discount / 100).toFixed(2)}
                                        </span>
                                    </div>
                                }
                                <hr className="separator" />
                                <div className={'totalLine'}>
                                    <span>Total:</span>
                                    <span>${(total / 100).toFixed(2)}</span>
                                </div>
                            </CardContent>

                            <CardFooter className={'summaryFooter'}>
                                <button
                                    onClick={clearCart}
                                    className={'clearCartButton'}
                                >
                                    Clear Cart
                                </button>
                            </CardFooter>
                        </CartItem>
                    </div>
                </div>
            </div>
        </div>
    );
}
