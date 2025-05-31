import { useCategoryStore } from '../../store/store';
import { useEffect } from 'react';

import './CatalogStyles.scss';

const Catalog = () => {
    const { categories, loading, error } = useCategoryStore();
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);
    return (
        <div className="catalog">
            {error && <p>Error: {error}</p>}
            {!loading && !error && (
                <ul className="catalog__category">
                    <li className="catalog__category__item active">All</li>
                    {categories.map((category) => (
                        <li
                            className="catalog__category__item"
                            key={category.id}
                        >
                            {category.name['en-US']}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default Catalog;
