import './CatalogSliderStyles.scss';
import CardItem from '../card-item/CardItem';
import { useProductsForSliderStore } from '../../store/store';
import { useEffect, useRef, useState } from 'react';
import apiRoot from '../../utils/sdkClient';
import { Link } from 'react-router-dom';

const CatalogSlider = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [gapWidth, setGapWidth] = useState(0);
    const [visibleCount, setVisibleCount] = useState(3);

    const wrapperRef = useRef<HTMLDivElement>(null);

    const { products, setProducts, setLoadingStatus, setError } =
        useProductsForSliderStore();

    useEffect(() => {
        const handleResize = () => {
            if (wrapperRef.current) {
                const widthWrapper = wrapperRef.current.offsetWidth;
                console.log(widthWrapper);

                const currentVisibleCount =
                    widthWrapper > 965 ? 3 : widthWrapper > 650 ? 2 : 1;
                setVisibleCount(currentVisibleCount);

                const countGap =
                    currentVisibleCount > 1 ? currentVisibleCount - 1 : 2;
                const widthGap = Math.max(
                    (widthWrapper - 32 - currentVisibleCount * 300) / countGap,
                    20
                );

                setGapWidth(widthGap);
            }
        };

        handleResize();
        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, [visibleCount]);

    const handleArrowLeft = () => {
        console.log(currentIndex);
        setCurrentIndex((prev) => Math.max(prev - 1, 0));
    };

    const handleArrowRight = () => {
        const maxIndex = Math.max(products.length - visibleCount, 0);
        setCurrentIndex((prev) => Math.min(prev + 1, maxIndex));
    };

    const fetchCategories = async () => {
        setLoadingStatus(true);

        try {
            const response = await apiRoot
                .productProjections()
                .get({
                    queryArgs: {
                        limit: 10,
                        staged: false,
                    },
                })
                .execute();
            setProducts(response.body.results);
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
        fetchCategories().catch((err) => console.log(err));
    }, []);

    return (
        <div className="catalog-slider container">
            <Link to="/catalog" className="catalog-slider__heading">
                Catalog
            </Link>
            <div className="catalog-slider__box">
                {
                    <i
                        className={`fa-solid fa-caret-left arrow-icon ${currentIndex <= 0 ? 'arrow-icon--disabled' : ''}`}
                        onClick={handleArrowLeft}
                    ></i>
                }
                <div
                    className="catalog-slider__wrapper container"
                    ref={wrapperRef}
                >
                    <div
                        className="catalog-slider__track"
                        style={{
                            transform: `translateX(-${currentIndex * (300 + gapWidth)}px)`,
                            width: `${products.length * (300 + gapWidth) - gapWidth}px`,
                            gap: `${gapWidth}px`,
                            paddingLeft: `${visibleCount === 1 ? gapWidth : 0}px`,
                            paddingRight: `${visibleCount === 1 ? gapWidth : 0}px`,
                        }}
                    >
                        {products.map((game) => (
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
                                    game.masterVariant.prices?.[0].discounted
                                        ?.value.centAmount ?? 0
                                }
                                imageUrl={
                                    game.masterVariant.images?.[0].url ??
                                    'not image'
                                }
                            />
                        ))}
                    </div>
                </div>
                <i
                    className={`fa-solid fa-caret-right arrow-icon ${currentIndex >= products.length - visibleCount ? 'arrow-icon--disabled' : ''}`}
                    onClick={handleArrowRight}
                ></i>
            </div>
        </div>
    );
};

export default CatalogSlider;
