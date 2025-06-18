import './HeartStyles.scss';
import { useEffect, useState } from 'react';
import apiRoot from '../../utils/sdkClient';
import { ProductProjection } from '@commercetools/platform-sdk';
import CardItem from '../../components/card-item/CardItem';

const Heart = () => {
    const [likedProducts, setLikedProducts] = useState<ProductProjection[]>([]);

    const getLikedList = async () => {
        const likedDataStorage = localStorage.getItem('likedList');
        let likedIDData: string[] | null = null;

        try {
            if (likedDataStorage) {
                likedIDData = JSON.parse(likedDataStorage) as string[];
            }
        } catch (err) {
            console.error('Failed to parse liked data', err);
        }

        try {
            const promisesList = likedIDData?.map(async (id) => {
                const { body } = await apiRoot
                    .productProjections()
                    .withId({ ID: id })
                    .get()
                    .execute();
                return body;
            });

            const productsList = await Promise.all(promisesList ?? []);
            setLikedProducts(productsList);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        getLikedList().catch((error) => console.log(error));
    }, []);
    return (
        <div className="heart container">
            <h2 className="heart__title">Wishlist</h2>
            <div className="heart__products">
                {likedProducts.length > 0 &&
                    likedProducts.map((game: ProductProjection) => (
                        <CardItem
                            key={game.id}
                            id={game.id}
                            title={game.name['en-US'] || 'Untitled Game'}
                            description={game.description?.['en-US'] ?? ''}
                            category={
                                game.masterVariant.attributes?.[2] &&
                                typeof game.masterVariant.attributes?.[2]
                                    .value === 'object' &&
                                game.masterVariant.attributes?.[2].value !==
                                    null
                                    ? (
                                          game.masterVariant.attributes?.[2]
                                              .value as { key: string }
                                      ).key
                                    : 'game'
                            }
                            price={
                                game.masterVariant.prices?.[0].value
                                    .centAmount ?? 0
                            }
                            discountPrice={
                                game.masterVariant.prices?.[0].discounted?.value
                                    .centAmount ?? 0
                            }
                            imageUrl={
                                game.masterVariant.images?.[0].url ??
                                'not image'
                            }
                        />
                    ))}
            </div>
            {!(likedProducts.length > 0) && (
                <div className="no-results">
                    <i className="fas fa-search no-results__icon"></i>
                    <h3 className="no-results__heading">No games found</h3>
                    <p className="no-results__text">
                        Try adjusting your search criteria or browse different
                        categories.
                    </p>
                </div>
            )}
        </div>
    );
};

export default Heart;
