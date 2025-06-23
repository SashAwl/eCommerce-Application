import { useEffect, useState } from 'react';
import './Cart.scss';
import { ShoppingCart } from 'lucide-react';
import { useBasketPromoState, useGameStore } from '../../store/store';
import createCart from '../../utils/cart/createCart';
import getCart from '../../utils/cart/getCart';
import { LineItem } from '@commercetools/platform-sdk';
import apiRoot from '../../utils/sdkClient';
import { CartItem } from '../../components/basket/CartItem';
import { EmptyBasket } from '../../components/basket/';
import { PromoSection } from '../../components/basket/PromoSection';

export default function CartPage() {
    const {
        cartId,
        cartVersion,
        setCardId,
        setCardVersion,
        changeDeletePopupVisible,
    } = useGameStore();

    const { setAppliedPromoCode, setPromoCode } = useBasketPromoState();
    const [cartItems, setCartItems] = useState<LineItem[]>([]);

    const [subtotal, setSubtotal] = useState(0);
    const [discount, setDiscount] = useState(0);
    const [total, setTotal] = useState(0);

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
    }, [cartVersion]);

    if (cartItems.length === 0) {
        return <EmptyBasket />;
    }
    function changeTotalPrice(totalPrise = 0, subtotal = 0) {
        setDiscount(subtotal - totalPrise);
        setTotal(totalPrise);
        setSubtotal(subtotal);
    }

    function clearCart() {
        changeDeletePopupVisible(true);
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
                                <PromoSection />
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
