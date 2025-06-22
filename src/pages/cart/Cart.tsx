import { useEffect, useState } from 'react';

import './Cart.scss';
import { Link } from 'react-router-dom';
import { ShoppingCart, Tag, Trash2 } from 'lucide-react';
import { useGameStore } from '../../store/store';
import createCart from '../../utils/cart/createCart';
import getCart from '../../utils/cart/getCart';
import { Cart, ErrorObject, LineItem } from '@commercetools/platform-sdk';

import apiRoot from '../../utils/sdkClient';
import { ctpClient } from '../../utils/BuildClient';
import { CartItem } from '../../components/basket/CartItem';

export default function CartPage() {
    const {
        cartId,
        cartVersion,
        setCardId,
        setCardVersion,
        showSuccessMessage,
        showErrorMessage,
        changeDeletePopupVisible,
        showStandardErrorMessage,
    } = useGameStore();
    const [cartItems, setCartItems] = useState<LineItem[]>([]);

    const [isRemovePromoButtonDisabled, setRemovePromoButtonDisabled] =
        useState(false);
    const [isApplyPromoButtonDisabled, setApplyPromoButtonDisabled] =
        useState(false);
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
                    console.error(err);
                });
        } else {
            getCart(cartId ?? '')
                .then((data) => {
                    if (data) {
                        setCartItems(() => {
                            return [...data.lineItems];
                        });
                        setCardVersion(data.version);
                        changeTotalPrice(
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
                                    throw err;
                                });
                        }
                    }
                })
                .catch((err) => {
                    console.error(err);
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
    function changeTotalPrice(totalPrise = 0, subtotal = 0) {
        setDiscount(subtotal - totalPrise);
        setTotal(totalPrise);
        setSubtotal(subtotal);
    }

    function clearCart() {
        changeDeletePopupVisible(true);
    }
    function applyPromoCode() {
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

                if (result.version) {
                    setCardVersion(result.version);
                }
                showSuccessMessage(
                    `Promo code '${promoCode}' successfully applied`
                );

                setAppliedPromoCode(promoCode);
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
    function removePromoCode() {
        setRemovePromoButtonDisabled(true);
        getCart(cartId!)
            .then((data) => {
                if (data) {
                    ctpClient
                        .execute({
                            uri: `/mergemates/carts/${cartId}`,
                            method: 'POST',
                            body: {
                                version: cartVersion,
                                actions: [
                                    {
                                        action: 'removeDiscountCode',
                                        discountCode: {
                                            typeId: 'discount-code',
                                            id: data.discountCodes[0]
                                                .discountCode.id,
                                        },
                                    },
                                ],
                            },
                        })
                        .then(() => {
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
                            <CartItem key={game.id} {...game} />
                        ))}
                    </div>

                    <div className={'summarySection'}>
                        <div className={'summaryCard'}>
                            <div className={'summaryHeader'}>
                                <div className={'summaryTitle'}>
                                    Order Summary
                                </div>
                            </div>

                            <div className={'summaryContent'}>
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
                                                disabled={
                                                    !promoCode.trim() ||
                                                    isApplyPromoButtonDisabled
                                                }
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
                                            <button
                                                onClick={removePromoCode}
                                                className={'removePromoButton'}
                                                disabled={
                                                    isRemovePromoButtonDisabled
                                                }
                                            >
                                                <Trash2 />
                                            </button>
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
                            </div>

                            <div className={'summaryFooter'}>
                                <button
                                    onClick={clearCart}
                                    className={'clearCartButton'}
                                >
                                    Clear Cart
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
