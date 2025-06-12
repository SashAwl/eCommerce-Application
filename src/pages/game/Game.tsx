import './Game.scss';
import { useEffect, useState } from 'react';
import { Product } from '@commercetools/platform-sdk';
import apiRoot from '../../utils/sdkClient';
import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { useGameStore } from '../../store/store';

import isProductInCart from '../../utils/cart/isProductInCart';
import addItemToCart from '../../utils/cart/addItemToCart';
import removeItemFromCart from '../../utils/cart/removeItemFromCart';
import getLineItemId from '../../utils/cart/getLineItemId';

interface IGameData {
    name: string;
    description: string;
    price: string;
    discounted?: string;
    platform: string;
    genres: string;
}
interface attributes {
    name: string;
    value: Record<string, string>;
}
function Game() {
    const [game, setGame] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);

    const { gameId } = useParams();
    const [gameData, setGameData] = useState<IGameData>({
        name: 'Untitled Game',
        description: 'No description available for this game.',
        price: 'N/A',
        platform: 'PC',
        genres: 'Game',
    });
    const [gameImages, setGameImages] = useState<string[]>([]);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [showImageModal, setShowImageModal] = useState(false);
    const [modalImageIndex, setModalImageIndex] = useState(0);
    const [gameCategories, setCategories] = useState<string[]>([]);
    const {
        cartId,
        cartVersion,
        setCardVersion,
        setSuccessMessage,
        setErrorMessage,
    } = useGameStore();
    const [isGameInCart, setGameInCart] = useState(true);

    useEffect(() => {
        window.scrollTo(0, 0);
        if (!gameId) return;
        const fetchData = async () => {
            try {
                setLoading(true);
                let idAsString = '';
                if (gameId) {
                    idAsString = gameId;
                }
                await apiRoot
                    .products()
                    .withId({ ID: idAsString })
                    .get()
                    .execute()
                    .then(({ body }) => {
                        setGame(body);
                        if (body.masterData.staged.masterVariant.images) {
                            body.masterData.staged.masterVariant.images.forEach(
                                ({ url }) => {
                                    setGameImages((prevItems) => {
                                        if (prevItems.includes(url)) {
                                            return prevItems;
                                        }
                                        return [...prevItems, url];
                                    });
                                }
                            );
                        }
                        const namesArr = body.masterData.current.name
                            ? Object.values(body.masterData.current.name)
                            : [];

                        if (namesArr.length) {
                            setGameData((prevItems) => ({
                                ...prevItems,
                                ['name']: namesArr[0],
                            }));
                        }
                        const descArr = body.masterData.current.description
                            ? Object.values(body.masterData.current.description)
                            : [];

                        if (descArr.length) {
                            setGameData((prevItems) => ({
                                ...prevItems,
                                ['description']: descArr[0],
                            }));
                        }
                        const pricesArr =
                            body.masterData.current.masterVariant.prices;
                        if (pricesArr?.length) {
                            const price =
                                Number(pricesArr[0].value.centAmount) / 100;
                            const discount = pricesArr[0]?.discounted
                                ? Number(
                                      pricesArr[0]?.discounted.value.centAmount
                                  ) / 100
                                : null;
                            setGameData((prevItems) => ({
                                ...prevItems,
                                ['price']: ` ${price}`,
                            }));
                            if (discount) {
                                setGameData((prevItems) => ({
                                    ...prevItems,
                                    ['discounted']: ` ${discount}`,
                                }));
                            }
                        }

                        body.masterData.current.masterVariant.attributes?.forEach(
                            (attr: attributes) => {
                                let value = '';
                                if (
                                    attr.value?.key &&
                                    typeof attr.value.key === 'string'
                                ) {
                                    value = attr.value.key;
                                }

                                if (attr.name === 'platform') {
                                    setGameData((prevItems) => ({
                                        ...prevItems,
                                        ['platform']: ` ${value}`,
                                    }));
                                }
                                if (attr.name === 'genres') {
                                    setGameData((prevItems) => ({
                                        ...prevItems,
                                        ['genres']: ` ${value}`,
                                    }));
                                }
                            }
                        );

                        body.masterData.current.categories.forEach(
                            (categoria) => {
                                apiRoot
                                    .categories()
                                    .withId({ ID: categoria.id })
                                    .get()
                                    .execute()
                                    .then((data) => {
                                        const categoriaArr = [
                                            ...new Set(
                                                Object.values(data.body.name)
                                            ),
                                        ];
                                        categoriaArr.forEach((el) => {
                                            setCategories((prevItems) => {
                                                if (prevItems.includes(el)) {
                                                    return prevItems;
                                                } else {
                                                    return [...prevItems, el];
                                                }
                                            });
                                        });
                                    })
                                    .catch((err) => {
                                        console.error(err);
                                    });
                            }
                        );
                        isProductInCart(cartId ?? '', body.id)
                            .then((data) => {
                                setGameInCart(data);
                            })
                            .catch((err) => {
                                console.log(err);
                            });
                        setLoading(false);
                    });
            } catch (error) {
                setLoading(false);
                console.error('Error fetching game:', error);
            }
        };
        fetchData().catch((err) => {
            console.error(err);
        });
    }, [gameId]);
    const handlePrevImage = () => {
        setCurrentImageIndex((prev) =>
            prev === 0 ? gameImages.length - 1 : prev - 1
        );
    };

    const handleNextImage = () => {
        setCurrentImageIndex((prev) =>
            prev === gameImages.length - 1 ? 0 : prev + 1
        );
    };

    const handleModalPrevImage = () => {
        setModalImageIndex((prev) =>
            prev === 0 ? gameImages.length - 1 : prev - 1
        );
    };

    const handleModalNextImage = () => {
        setModalImageIndex((prev) =>
            prev === gameImages.length - 1 ? 0 : prev + 1
        );
    };

    const openImageModal = (index: number) => {
        setModalImageIndex(index);
        setShowImageModal(true);
    };

    const closeImageModal = () => {
        setShowImageModal(false);
    };
    const handleAddToCart = () => {
        if (game?.id) {
            addItemToCart(game.id, cartId!, cartVersion!)
                .then((data) => {
                    setGameInCart(true);
                    if (data) {
                        setCardVersion(data.version);
                        setSuccessMessage(
                            'The game has been added to your cart.'
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
    };

    const handleDeleteGameFromCart = () => {
        if (game?.id) {
            getLineItemId(cartId!, game.id)
                .then((data) => {
                    removeItemFromCart(data, cartId!, cartVersion!)
                        .then((data) => {
                            setGameInCart(false);
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

    if (loading) {
        return (
            <div className={'gameDetailsPage'}>
                <div className={'container'}>
                    <div className={'loading'}>
                        <div className={'spinner'}></div>
                        <p>Loading game details...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (!game && !loading) {
        return (
            <div className={'gameDetailsPage'}>
                <div className={'container'}>
                    <div className={'notFound'}>
                        <i className="fas fa-exclamation-triangle"></i>
                        <h2>Game not found</h2>
                        <p>
                            The game you're looking for doesn't exist or has
                            been removed.
                        </p>
                        <Link to="/catalog" className={'backButton'}>
                            Back to Catalog
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className={'gameDetailsPage'}>
            <div className={'container'}>
                <div className={'gameContent'}>
                    <div className={'imageSection'}>
                        <div className={'mainImage'}>
                            <img
                                src={gameImages[currentImageIndex]}
                                alt={'Game'}
                                onClick={() =>
                                    openImageModal(currentImageIndex)
                                }
                                className={'clickableImage'}
                            />
                            <button
                                className={`${'navButton'} ${'prevButton'}`}
                                onClick={handlePrevImage}
                            >
                                <i className="fas fa-chevron-left"></i>
                            </button>
                            <button
                                className={`navButton  nextButton`}
                                onClick={handleNextImage}
                            >
                                <i className="fas fa-chevron-right"></i>
                            </button>
                        </div>

                        <div className={'thumbnails'}>
                            {gameImages.map((image, index) => (
                                <img
                                    key={index}
                                    src={image}
                                    alt={`${'game'} ${index + 1}`}
                                    className={`${'thumbnail'} ${
                                        index === currentImageIndex
                                            ? 'active'
                                            : ''
                                    }`}
                                    onClick={() => setCurrentImageIndex(index)}
                                />
                            ))}
                        </div>
                    </div>

                    <div className={'gameInfo'}>
                        <h1 className={'gameTitle'}>{gameData.name}</h1>

                        <div className={'gameMeta'}>
                            <span className={'category'}>
                                {gameData.genres}
                            </span>
                            <span className={'category'}>
                                {gameData.platform}
                            </span>
                            {gameCategories.map((item, ind) => (
                                <span key={ind} className={'category'}>
                                    {item}
                                </span>
                            ))}
                        </div>

                        {
                            <div className={'gamePrice'}>
                                {gameData.discounted ? (
                                    <div className={'discountPrice'}>
                                        <span className={'originalPrice'}>
                                            ${gameData.price}
                                        </span>
                                        <span className={'discountedPrice'}>
                                            ${gameData.discounted}
                                        </span>
                                        <span className={'discount'}>
                                            {Math.round(
                                                ((+gameData.price -
                                                    +gameData.discounted) /
                                                    +gameData.price) *
                                                    100
                                            )}
                                            % OFF
                                        </span>
                                    </div>
                                ) : (
                                    <span className={'price'}>
                                        ${gameData.price}
                                    </span>
                                )}
                            </div>
                        }

                        {
                            <div className={'gameDescription'}>
                                <h3>Description</h3>
                                <p>{gameData.description}</p>
                            </div>
                        }
                        {!isGameInCart && (
                            <div className={'gameActions'}>
                                <button
                                    onClick={handleAddToCart}
                                    className={'addToCartButton'}
                                >
                                    <i className="fas fa-shopping-cart"></i>
                                    Add to Cart
                                </button>
                            </div>
                        )}
                        {isGameInCart && (
                            <div className={'gameActions'}>
                                <button
                                    onClick={handleDeleteGameFromCart}
                                    className={'addToCartButton'}
                                >
                                    <i
                                        className="fas fa-trash"
                                        style={{ color: '#A52A2A' }}
                                    ></i>
                                    Delete game
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {showImageModal && (
                    <div className={'modal'} onClick={closeImageModal}>
                        <div
                            className={'modalContent'}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <button
                                className={'closeButton'}
                                onClick={closeImageModal}
                            >
                                <i className="fas fa-times"></i>
                            </button>

                            <div className={'modalImageContainer'}>
                                <img
                                    src={gameImages[modalImageIndex]}
                                    alt={`${'game'} ${modalImageIndex + 1}`}
                                    className={'modalImage'}
                                />

                                <button
                                    className={`${'modalNavButton'} ${'modalPrevButton'}`}
                                    onClick={handleModalPrevImage}
                                >
                                    <i className="fas fa-chevron-left"></i>
                                </button>
                                <button
                                    className={`${'modalNavButton'} ${'modalNextButton'}`}
                                    onClick={handleModalNextImage}
                                >
                                    <i className="fas fa-chevron-right"></i>
                                </button>
                            </div>

                            <div className={'modalThumbnails'}>
                                {gameImages.map((image, index) => (
                                    <img
                                        key={index}
                                        src={image}
                                        alt={`${'game'} ${index + 1}`}
                                        className={`${'modalThumbnail'} ${
                                            index === modalImageIndex
                                                ? 'active'
                                                : ''
                                        }`}
                                        onClick={() =>
                                            setModalImageIndex(index)
                                        }
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Game;
