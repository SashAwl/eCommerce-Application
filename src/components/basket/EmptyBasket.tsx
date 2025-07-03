import { ShoppingCart } from 'lucide-react';
import { Link } from 'react-router-dom';

export function EmptyBasket() {
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
