import { Link } from 'react-router-dom';
import './CardItemStyles.scss';

export interface CardProps {
    id: string;
    title: string;
    category: string;
    price: number;
    discountPrice: number;
    imageUrl: string;
}

const CardItem = ({
    id,
    title,
    category,
    price,
    discountPrice,
    imageUrl,
}: CardProps) => {
    const formattedPrice = (price: number): string => (price / 100).toFixed(2);
    return (
        <div className="card-item">
            <Link to={`/game/${id}`}>
                <img
                    src={
                        imageUrl ||
                        'https://via.placeholder.com/300x180?text=Game+Image'
                    }
                    alt={title}
                    className="card-item__image"
                />
            </Link>
            <div className="card-item__content">
                <Link to={`/game/${id}`}>
                    <h3 className="card-item__title">{title}</h3>
                </Link>
                <div className="card-item__category">{category}</div>
                <div className="card-item__price-box">
                    <div
                        className={`card-item__price ${discountPrice > 0 ? 'old-price' : ''}`}
                    >
                        ${formattedPrice(price)}
                    </div>
                    {discountPrice > 0 && (
                        <div className="card-item__price sale">
                            ${formattedPrice(discountPrice)}
                        </div>
                    )}
                </div>
                <div className="card-item__actions">
                    <button className="card__actions__cart">Add to Cart</button>
                </div>
            </div>
        </div>
    );
};

export default CardItem;
