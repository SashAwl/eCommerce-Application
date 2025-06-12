import { useEffect, useState } from 'react';

import './Cart.scss';
import { Link } from 'react-router-dom';
import { Minus, Plus, ShoppingCart, Trash2 } from 'lucide-react';
import { useGameStore } from '../../store/store';
import createCart from '../../utils/cart/createCart';
import getCart from '../../utils/cart/getCart';
import { LineItem } from '@commercetools/platform-sdk';
import { CartItem } from '../../components/basket/card';
import updateItemQuantity from '../../utils/cart/updateItemQuantity';
import removeItemFromCart from '../../utils/cart/removeItemFromCart';

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
    // const [cartItems] = useState<LineItem[]>([]);
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
                    }
                })
                .catch((err) => {
                    console.log(err);
                });
        }
    }, [cartVersion]);

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

    function removeItem(id: string): void {
        removeItemFromCart(id, cartId!, cartVersion!)
            .then((data) => {
                if (data) {
                    setCardVersion(data.version);
                    setSuccessMessage(
                        'The game has been successfully removed from the cart.'
                    );
                    setTimeout(() => {
                        setSuccessMessage('');
                    }, 1500);
                }

                console.log(data);
            })
            .catch((err) => {
                console.log(err);
                setErrorMessage('Something went wrong... Try again later');
                setTimeout(() => {
                    setErrorMessage('');
                }, 1500);
            });
    }

    function updateQuantity(id: string, quantity: number): void {
        updateItemQuantity(id, cartId!, cartVersion!, quantity)
            .then((data) => {
                if (data) {
                    setCardVersion(data.version);
                }

                console.log(data);
            })
            .catch((err) => {
                console.log(err);
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
                                                        game.quantity <= 1
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
                                                >
                                                    <Plus />
                                                </button>
                                            </div>

                                            <button
                                                onClick={() =>
                                                    removeItem(game.id)
                                                }
                                                className={'removeButton'}
                                            >
                                                <Trash2 />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </CartItem>
                        ))}
                    </div>

                    <div className={'summarySection'}>Summary ....</div>
                </div>
            </div>
        </div>
    );
}
