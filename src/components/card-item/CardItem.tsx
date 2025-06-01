import { Link } from 'react-router-dom';
import './CardItemStyles.scss';

export interface CardProps {
    id: string;
    title: string;
    category: string;
    price: number;
    imageUrl: string;
}

const CardItem = ({ id, title, category, price, imageUrl }: CardProps) => {
    const formattedPrice = price / 100;
    return (
        <div className="card-item">
            <Link to={`/catalog/${id}`}>
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
                <Link to={`/catalog/${id}`}>
                    <h3 className="card-item__title">{title}</h3>
                </Link>
                <div className="card-item__category">{category}</div>
                <div className="card-item__price">${formattedPrice}</div>
                <div className="card-item__actions">
                    <button className="card__actions__cart">Add to Cart</button>
                </div>
            </div>
        </div>
    );
};

export default CardItem;
