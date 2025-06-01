import { useCategoryStore, useProductsStore } from '../../store/store';
import { useEffect, useState } from 'react';

import './CatalogStyles.scss';
import apiRoot from '../../utils/sdkClient';
import CardItem from '../../components/card-item/CardItem';

const Catalog = () => {
    const { categories, loading, error } = useCategoryStore();
    const [selectedCategory, setSelectedCategory] = useState('all');
    const { products, setProducts, setLoadingStatus, setError } =
        useProductsStore();

    useEffect(() => {
        window.scrollTo(0, 0);
        setLoadingStatus(true);

        const fetchCategories = async () => {
            try {
                const response = await apiRoot
                    .productProjections()
                    .get({ queryArgs: { staged: false } })
                    .execute();

                setProducts(response.body.results);
            } catch (err: unknown) {
                if (err instanceof Error) {
                    setError(err.message);
                    console.error(err);
                } else {
                    setError('Unknown error');
                    console.error('Unexpected error', err);
                }
            } finally {
                setLoadingStatus(false);
            }
        };

        fetchCategories().catch((error) => console.log(error));
    }, []);

    useEffect(() => {
        console.log('products', products);
    }, [products]);

    const validProducts = products.filter((product) => {
        return (
            product?.id &&
            product.name &&
            product.masterVariant &&
            product.categories?.[0]?.typeId &&
            product.masterVariant.prices?.[0]?.value?.centAmount !== undefined
        );
    });
    return (
        <div className="catalog container">
            <div className="container">
                <h1 className="catalog__title">Game Catalog</h1>
                <div className="catalog__category">
                    <h2 className="catalog__category__heading">Categories</h2>
                    {error && <p>Error: {error}</p>}
                    {!loading && !error && (
                        <ul className="catalog__category__list">
                            <li
                                className={`catalog__category__item ${selectedCategory === 'All' ? 'active' : ''}`}
                                onClick={() => setSelectedCategory('All')}
                            >
                                All
                            </li>
                            {categories.map((category) => (
                                <li
                                    className={`catalog__category__item ${selectedCategory === category.name['en-US'] ? 'active' : ''}`}
                                    key={category.id}
                                    onClick={() =>
                                        setSelectedCategory(
                                            category.name['en-US']
                                        )
                                    }
                                >
                                    {category.name['en-US']}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
                {loading ? (
                    <div className="loading">
                        <p>Loading games...</p>
                    </div>
                ) : (
                    <div className="catalog__products">
                        {validProducts.length > 0 ? (
                            validProducts.map((game) => (
                                <CardItem
                                    id={game.id}
                                    title={
                                        game.name['en-US'] || 'Untitled Game'
                                    }
                                    category={
                                        game.categories[0].typeId || 'game'
                                    }
                                    price={
                                        game.masterVariant.prices?.[0].value
                                            .centAmount ?? 0
                                    }
                                    imageUrl={
                                        game.masterVariant.images?.[0].url ??
                                        'not image'
                                    }
                                />
                            ))
                        ) : (
                            <div className="no-results">
                                <i className="fas fa-search no-results__icon"></i>
                                <h3 className="no-results__heading">
                                    No games found
                                </h3>
                                <p className="no-results__text">
                                    Try adjusting your search criteria or browse
                                    different categories.
                                </p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Catalog;
