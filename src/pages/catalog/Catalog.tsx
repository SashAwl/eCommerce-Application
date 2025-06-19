import { useCategoryStore, useProductsStore } from '../../store/store';
import { useEffect, useState, useMemo } from 'react';
import { Category, ProductProjection } from '@commercetools/platform-sdk';

import './CatalogStyles.scss';
import apiRoot from '../../utils/sdkClient';
import CardItem from '../../components/card-item/CardItem';
import { Link } from 'react-router-dom';

const Catalog = () => {
    const { categories, loading, error } = useCategoryStore();
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [selectedSubCategory, setSelectedSubCategory] = useState('');
    const [offset, setOffset] = useState(0);
    const [totalProducts, setTotalProducts] = useState(0);
    const [hasTriedToLoad, setHasTriedToLoad] = useState(false);

    const [searchQuery, setSearchQuery] = useState('');
    const [sortBy, setSortBy] = useState('--');
    const [ageRating, setAgeRating] = useState('--');
    const [minPrice, setMinPrice] = useState(0);
    const [maxPrice, setMaxPrice] = useState(100);
    const [openDetailsId, setOpenDetailsId] = useState<string | null>(null);

    const [categoryMap, setCategoryMap] = useState<Record<string, Category[]>>(
        {}
    );

    const { products, setProducts, setLoadingStatus, setError } =
        useProductsStore();

    const handleLoadMore = async () => {
        const newOffset = offset + 6;
        await fetchCategories(newOffset, true);
        setOffset(newOffset);
    };

    const linkList = useMemo(() => {
        return [
            'Home',
            'Catalog',
            selectedCategory !== 'all' ? selectedCategory : '',
            selectedCategory && selectedSubCategory ? selectedSubCategory : '',
        ];
    }, [selectedCategory, selectedSubCategory]);

    const getCategoryId = (categoryItem: string) => {
        const categoryObj = categories.find(
            (category) =>
                category.name['en-US'].toLowerCase() ===
                categoryItem.toLowerCase()
        );
        return categoryObj?.id;
    };

    const getSubcategories = (categoryId: string) =>
        categoryMap[categoryId] || [];

    const fetchCategories = async (
        currentOffset: number,
        isLoadingMore: boolean
    ) => {
        setLoadingStatus(true);

        try {
            const responseCategorys = await apiRoot
                .categories()
                .get({
                    queryArgs: {
                        limit: 10,
                    },
                })
                .execute();

            const categories = responseCategorys.body.results;
            const newCategoryMap: Record<string, Category[]> = {};

            categories.forEach((category: Category) => {
                const parentId = category.parent?.id ?? 'root';
                if (!newCategoryMap[parentId]) {
                    newCategoryMap[parentId] = [];
                }
                newCategoryMap[parentId].push(category);
            });

            setCategoryMap(newCategoryMap);

            const whereList: string[] = [];

            if (selectedCategory.toLowerCase() !== 'all') {
                const categoryId = getCategoryId(selectedCategory);
                if (categoryId) {
                    whereList.push(`categories(id="${categoryId}")`);
                }
            }

            if (selectedSubCategory.toLowerCase()) {
                const subCategoryId = getCategoryId(selectedSubCategory);
                if (subCategoryId) {
                    whereList.push(`categories(id="${subCategoryId}")`);
                }
            }

            if (ageRating && ageRating !== '--') {
                whereList.push(
                    `masterVariant(attributes(name="ageRating" and value(key="${ageRating}")))`
                );
            }

            if (minPrice > 0) {
                whereList.push(
                    `masterVariant(prices(value(centAmount >= ${minPrice * 100})))`
                );
            }

            if (maxPrice > 0) {
                whereList.push(
                    `masterVariant(prices(value(centAmount <= ${maxPrice * 100})))`
                );
            }

            const where =
                whereList.length > 0 ? whereList.join(' and ') : undefined;
            const response = await apiRoot
                .productProjections()
                .get({
                    queryArgs: {
                        limit: 6,
                        offset: currentOffset,
                        staged: false,
                        ...(whereList.length > 0 && { where: where }),
                    },
                })
                .execute();

            setTotalProducts(response.body.total ?? 0);

            const productsResponse: ProductProjection[] = isLoadingMore
                ? [...products, ...response.body.results]
                : response.body.results
                      .sort((a, b) => {
                          if (sortBy === '--') {
                              return 1;
                          }
                          if (sortBy === 'name-asc') {
                              return a.name['en-US'] < b.name['en-US'] ? -1 : 1;
                          }
                          if (sortBy === 'name-desc') {
                              return a.name['en-US'] < b.name['en-US'] ? 1 : -1;
                          }
                          if (sortBy === 'price-asc') {
                              const aPrice = a.masterVariant.prices
                                  ? +a.masterVariant.prices[0].value.centAmount
                                  : 1;
                              const bPrice = b.masterVariant.prices
                                  ? +b.masterVariant.prices[0].value.centAmount
                                  : 1;

                              return aPrice < bPrice ? -1 : 1;
                          }
                          if (sortBy === 'price-desc') {
                              const aPrice = a.masterVariant.prices
                                  ? +a.masterVariant.prices[0].value.centAmount
                                  : 1;
                              const bPrice = b.masterVariant.prices
                                  ? +b.masterVariant.prices[0].value.centAmount
                                  : 1;

                              return aPrice < bPrice ? 1 : -1;
                          }
                          return 1;
                      })
                      .filter((el) => {
                          return el.name['en-US']
                              .toLowerCase()
                              .includes(searchQuery.toLowerCase().trim());
                      });
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
        setOffset(0);

        if (categories.length > 0) {
            fetchCategories(0, false).catch((error) => console.log(error));
        }
    }, [
        selectedCategory,
        selectedSubCategory,
        minPrice,
        maxPrice,
        searchQuery,
        sortBy,
        categories,
        ageRating,
        searchQuery,
    ]);

    useEffect(() => {
        if (!loading && products.length > 0) {
            setHasTriedToLoad(true);
        }
    }, [loading]);

    const validProducts = products.filter((product) => {
        return (
            product?.id &&
            product.name &&
            product.masterVariant &&
            product.categories?.[0]?.typeId &&
            product.masterVariant.prices?.[0]?.value?.centAmount !== undefined
        );
    });

    function clearFilter(): void {
        setSelectedCategory('all');
        setSelectedSubCategory('');
        setAgeRating('--');
        setMinPrice(0);
        setMaxPrice(100);
        setSortBy('--');
        setSearchQuery('');
    }
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
                            className={`catalog__search__input ${searchQuery ? 'checked-filter' : ''}`}
                        />
                        <button
                            onClick={() => {
                                void fetchCategories(offset, false);
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
                                className={`select ${sortBy !== '--' ? 'checked-filter' : ''}`}
                            >
                                <option value="--">--</option>
                                <option value="name-asc">
                                    Name: Low to High
                                </option>
                                <option value="name-desc">
                                    Name: High to Low
                                </option>
                                <option value="price-asc">
                                    Price: Low to High
                                </option>
                                <option value="price-desc">
                                    Price: High to Low
                                </option>
                            </select>
                        </div>

                        <div className="catalog__filter__group">
                            <label>Age rating:</label>
                            <select
                                value={ageRating}
                                onChange={(e) => setAgeRating(e.target.value)}
                                className={`select ${ageRating !== '--' ? 'checked-filter' : ''}`}
                            >
                                <option value="--">--</option>
                                <option value="0+">0+</option>
                                <option value="10+">10+</option>
                                <option value="13+">13+</option>
                                <option value="18+">18+</option>
                            </select>
                        </div>

                        <div className="catalog__filter__group">
                            <label>Price Range:</label>
                            <div
                                className={`price-range ${maxPrice !== 100 || minPrice !== 0 ? 'checked-filter' : ''}`}
                            >
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

                    <button
                        onClick={clearFilter}
                        className="catalog__clear__button"
                    >
                        Clear
                    </button>
                </div>
                <div className="breadcrumb">
                    <Link to="/home">{linkList[0]}</Link> /{' '}
                    <p
                        className="breadcrumb__item"
                        onClick={() => setSelectedCategory('all')}
                    >
                        {linkList[1]}
                    </p>{' '}
                    /
                    {linkList[2] && (
                        <p
                            className="breadcrumb__item"
                            onClick={() => {
                                setSelectedCategory(String(linkList[2]));
                                setSelectedSubCategory('');
                            }}
                        >
                            {' '}
                            {linkList[2]} /
                        </p>
                    )}
                    {linkList[2] && linkList[3] && (
                        <p className="breadcrumb__item">{linkList[3]}</p>
                    )}
                </div>
                <div className="catalog__category">
                    <h2 className="catalog__category__heading">Categories</h2>
                    {error && <p>Error: {error}</p>}
                    {!loading && !error && (
                        <div className="catalog__category__list">
                            <button
                                className={`catalog__category__item ${selectedCategory === 'all' ? 'active' : ''}`}
                                onClick={() => {
                                    setSelectedCategory('all');
                                    clearFilter();
                                }}
                            >
                                <summary>All</summary>
                            </button>
                            {categories.map((category) => {
                                const isOpen = openDetailsId === category.id;

                                if (!category.parent) {
                                    return (
                                        <details
                                            className={`catalog__category__item ${selectedCategory === category.name['en-US'] ? 'active' : ''}`}
                                            key={category.id}
                                            open={isOpen}
                                            onClick={(e) => {
                                                e.preventDefault();
                                                setOpenDetailsId(
                                                    isOpen ? null : category.id
                                                );
                                            }}
                                        >
                                            <summary
                                                onClick={() => {
                                                    setSelectedCategory(
                                                        category.name['en-US']
                                                    );
                                                    setSelectedSubCategory('');
                                                }}
                                            >
                                                {category.name['en-US']}
                                            </summary>
                                            <ul key={category.id}>
                                                {(() => {
                                                    if (!category.id)
                                                        return null;

                                                    const subcategories =
                                                        getSubcategories(
                                                            category.id
                                                        );

                                                    return subcategories.map(
                                                        (item) => (
                                                            <li
                                                                key={`${category.id}-${item.id}}}`}
                                                                onClick={() => {
                                                                    setSelectedSubCategory(
                                                                        item
                                                                            .name[
                                                                            'en-US'
                                                                        ]
                                                                    );
                                                                }}
                                                            >
                                                                {
                                                                    item.name[
                                                                        'en-US'
                                                                    ]
                                                                }
                                                            </li>
                                                        )
                                                    );
                                                })()}
                                            </ul>
                                        </details>
                                    );
                                }
                            })}
                        </div>
                    )}
                </div>
                {loading ? (
                    <div className="loading">
                        <p>Loading games...</p>
                    </div>
                ) : (
                    <div className="catalog__products">
                        {validProducts.length > 0
                            ? validProducts.map((game) => (
                                  <CardItem
                                      key={game.id}
                                      id={game.id}
                                      title={
                                          game.name['en-US'] || 'Untitled Game'
                                      }
                                      description={
                                          game.description?.['en-US'] ?? ''
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
                                                        .value as {
                                                        key: string;
                                                    }
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
                            : hasTriedToLoad && (
                                  <div className="no-results">
                                      <i className="fas fa-search no-results__icon"></i>
                                      <h3 className="no-results__heading">
                                          No games found
                                      </h3>
                                      <p className="no-results__text">
                                          Try adjusting your search criteria or
                                          browse different categories.
                                      </p>
                                  </div>
                              )}{' '}
                    </div>
                )}
                {offset + 6 < totalProducts && (
                    <button
                        className="catalog__products__more"
                        onClick={() => void handleLoadMore()}
                    >
                        Load more
                    </button>
                )}
            </div>
        </div>
    );
};

export default Catalog;
