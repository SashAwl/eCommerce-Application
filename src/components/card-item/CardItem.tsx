import { Link } from 'react-router-dom';
import './CardItemStyles.scss';
import { useEffect, useState } from 'react';
import { useGameStore } from '../../store/store';
import addItemToCart from '../../utils/cart/addItemToCart';
import removeItemFromCart from '../../utils/cart/removeItemFromCart';
import getLineItemId from '../../utils/cart/getLineItemId';
import isProductInCart from '../../utils/cart/isProductInCart';

export interface CardProps {
    id: string;
    title: string;
    description: string;
    category: string;
    price: number;
    discountPrice: number;
    imageUrl: string;
}

const CardItem = ({
    id,
    title,
    description,
    category,
    price,
    discountPrice,
    imageUrl,
}: CardProps) => {
    const {
        cartId,
        cartVersion,
        setCardVersion,
        setSuccessMessage,
        setErrorMessage,
    } = useGameStore();

    const [isLiked, setIsLiked] = useState(false);
    const [isGameInCart, setGameInCart] = useState(false);

    if (!localStorage.getItem('likedList')) {
        localStorage.setItem('likedList', '[]');
    }

    const formattedPrice = (price: number): string => (price / 100).toFixed(2);

    const handleAddToCart = () => {
        if (id && cartId && cartVersion) {
            addItemToCart(id, cartId, cartVersion)
                .then((data) => {
                    if (data) {
                        setCardVersion(data.version);
                        setSuccessMessage(
                            'The game has been added to your cart.'
                        );
                        setTimeout(() => {
                            setSuccessMessage('');
                        }, 1500);
                    }

                    setGameInCart(true);
                })
                .catch((err) => {
                    console.log(err);
                    setErrorMessage('Something went wrong... Try again later');
                    setTimeout(() => {
                        setErrorMessage('');
                    }, 1500);
                });
        }
    };

    const handleDeleteGameFromCart = () => {
        if (id && cartId && cartVersion) {
            getLineItemId(cartId, id)
                .then((data) => {
                    if (!data) {
                        return;
                    }
                    removeItemFromCart(data, cartId, cartVersion)
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
                            setGameInCart(false);
                        })
                        .catch((err) => {
                            console.log(err);
                            setErrorMessage(
                                'Something went wrong... Try again later'
                            );
                            setTimeout(() => {
                                setErrorMessage('');
                            }, 1500);
                        });
                })
                .catch((err) => {
                    console.log(err);
                });
        }
    };

    const getDataStorage = () => {
        const likedDataStorage = localStorage.getItem('likedList');
        let likedData: string[] | null = null;

        try {
            if (likedDataStorage) {
                likedData = JSON.parse(likedDataStorage) as string[];
            }
        } catch (err) {
            console.error('Failed to parse liked data', err);
        }

        return likedData;
    };

    const handleClickToHeart = (idGame: string) => {
        const heartState = !isLiked;
        setIsLiked(heartState);

        const likedData = getDataStorage();

        const likedGameList = heartState
            ? [...(likedData ?? []), idGame]
            : [...(likedData?.filter((game) => game !== idGame) ?? [])];

        const dataForStorage = JSON.stringify(likedGameList);

        localStorage.setItem('likedList', dataForStorage);
    };

    useEffect(() => {
        if (getDataStorage()?.includes(id)) {
            setIsLiked(true);
        }
    }, []);

    useEffect(() => {
        if (cartId) {
            isProductInCart(cartId, id)
                .then((flag) => {
                    setGameInCart(flag);
                })
                .catch((error) => {
                    console.log(error);
                });
        }
    }, [id, cartId]);

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
                <div className="card-item__description">
                    {description.slice(0, Math.min(100, description.length))}...
                </div>
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
                    {!isGameInCart && (
                        <button
                            onClick={handleAddToCart}
                            className="card-item__actions__cart"
                        >
                            Add to Cart
                        </button>
                    )}
                    {isGameInCart && (
                        <button
                            onClick={handleDeleteGameFromCart}
                            className="card-item__actions__cart"
                        >
                            Delete game
                        </button>
                    )}
                    {!isLiked && (
                        <i
                            className="fa-regular fa-heart card-item__heart"
                            onClick={() => handleClickToHeart(id)}
                        ></i>
                    )}
                    {isLiked && (
                        <i
                            className="fa-solid fa-heart card-item__heart"
                            onClick={() => handleClickToHeart(id)}
                        ></i>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CardItem;
