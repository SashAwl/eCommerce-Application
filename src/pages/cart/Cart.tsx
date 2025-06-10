import { useEffect, useState } from 'react';

import './Cart.scss';
import { Link } from 'react-router-dom';
import { ShoppingCart } from 'lucide-react';
import { useGameStore } from '../../store/store';
import createCart from '../../utils/cart/createCart';
import getCart from '../../utils/cart/getCart';
import { LineItem } from '@commercetools/platform-sdk';
import CardItem from '../../components/card-item/CardItem';

export default function CartPage() {
    const { cartId, setCardId, setCardVersion } = useGameStore();
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
    }, []);

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
                            <CardItem
                                key={game.id}
                                id={game.id}
                                title={game.name['en-US'] || 'Untitled Game'}
                                description={''}
                                category={'game'}
                                price={game.price.value.centAmount ?? 0}
                                discountPrice={
                                    game.price.discounted?.value.centAmount ?? 0
                                }
                                imageUrl={'not image'}
                            />
                        ))}
                    </div>

                    <div className={'summarySection'}>Summary ....</div>
                </div>
            </div>
        </div>
    );
}
