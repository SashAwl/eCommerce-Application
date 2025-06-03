import { useCategoryStore, useProductsStore } from '../../store/store';
import { useEffect, useState } from 'react';
import { ProductProjection } from '@commercetools/platform-sdk';

import './CatalogStyles.scss';
import apiRoot from '../../utils/sdkClient';
import CardItem from '../../components/card-item/CardItem';

const Catalog = () => {
    const { categories, loading, error } = useCategoryStore();
    const [selectedCategory, setSelectedCategory] = useState('all');

    const [searchQuery, setSearchQuery] = useState('');
    const [sortBy, setSortBy] = useState('name');
    const [minPrice, setMinPrice] = useState(0);
    const [maxPrice, setMaxPrice] = useState(100);
    const { products, setProducts, setLoadingStatus, setError } =
        useProductsStore();

    const fetchCategories = async () => {
        setLoadingStatus(true);

        try {
            const getCategoryId = (categoryItem: string) => {
                const categoryObj = categories.find(
                    (category) =>
                        category.name['en-US'].toLowerCase() ===
                        categoryItem.toLowerCase()
                );
                return categoryObj?.id;
            };
            console.log(getCategoryId(selectedCategory));

            const queryArgs: { where?: string; staged: boolean } = {
                staged: false,
            };

            if (selectedCategory.toLowerCase() !== 'all') {
                const categoryId = getCategoryId(selectedCategory);
                if (categoryId) {
                    queryArgs.where = `categories(id = "${categoryId}")`;
                }
            }

            const response = await apiRoot
                .productProjections()
                .get({
                    queryArgs,
                })
                .execute();

            const productsResponse: ProductProjection[] = response.body.results;
            setProducts(productsResponse);
        } catch (err: unknown) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError('Unknown error');
            }
        } finally {
            setLoadingStatus(false);
        }
    };

    useEffect(() => {
        window.scrollTo(0, 0);
        setLoadingStatus(true);

        if (categories.length > 0) {
            fetchCategories().catch((error) => console.log(error));
        }
        setLoadingStatus(false);
    }, [selectedCategory, minPrice, maxPrice, searchQuery, sortBy, categories]);

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
                <div className="catalog__filter">
                    <div className="catalog__search">
                        <input
                            type="text"
                            placeholder="Search games..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="catalog__search__input"
                        />
                        <button
                            onClick={() => {
                                void fetchCategories();
                            }}
                            className="catalog__search__button"
                        >
                            <i className="fas fa-search"></i>
                        </button>
                    </div>

                    <div className="catalog__filter__controls">
                        <div className="catalog__filter__group">
                            <label>Sort by:</label>
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                className="select"
                            >
                                <option value="name">Name</option>
                                <option value="price-low">
                                    Price: Low to High
                                </option>
                                <option value="price-high">
                                    Price: High to Low
                                </option>
                            </select>
                        </div>

                        <div className="catalog__filter__group">
                            <label>Price Range:</label>
                            <div className="price-range">
                                <input
                                    type="number"
                                    placeholder="Min"
                                    min={0}
                                    value={minPrice}
                                    onChange={(e) =>
                                        setMinPrice(Number(e.target.value))
                                    }
                                    className="price-input"
                                />
                                <span>-</span>
                                <input
                                    type="number"
                                    placeholder="Max"
                                    min={0}
                                    value={maxPrice}
                                    onChange={(e) =>
                                        setMaxPrice(Number(e.target.value))
                                    }
                                    className="price-input"
                                />
                            </div>
                        </div>
                    </div>
                </div>
                <div className="catalog__category">
                    <h2 className="catalog__category__heading">Categories</h2>
                    {error && <p>Error: {error}</p>}
                    {!loading && !error && (
                        <ul className="catalog__category__list">
                            <li
                                className={`catalog__category__item ${selectedCategory === 'all' ? 'active' : ''}`}
                                onClick={() => setSelectedCategory('all')}
                            >
                                All
                            </li>
                            {categories.map((category) => {
                                if (!category.parent) {
                                    return (
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
                                    );
                                }
                            })}
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
                                    key={game.id}
                                    id={game.id}
                                    title={
                                        game.name['en-US'] || 'Untitled Game'
                                    }
                                    category={
                                        game.masterVariant.attributes?.[2] &&
                                        typeof game.masterVariant
                                            .attributes?.[2].value ===
                                            'object' &&
                                        game.masterVariant.attributes?.[2]
                                            .value !== null
                                            ? (
                                                  game.masterVariant
                                                      .attributes?.[2]
                                                      .value as { key: string }
                                              ).key
                                            : 'game'
                                    }
                                    price={
                                        game.masterVariant.prices?.[0].value
                                            .centAmount ?? 0
                                    }
                                    discountPrice={
                                        game.masterVariant.prices?.[0]
                                            .discounted?.value.centAmount ?? 0
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
