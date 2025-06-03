import { useEffect } from 'react';
// import { useCategoryStore } from '../../store/store';
import HeroSection from '../../components/hero/HeroSection';
import './HomePage.scss';

const HomePage = () => {
    // const { categories, loading, error } = useCategoryStore();
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="home">
            <HeroSection />
            {/* {loading && <p>Loading...</p>}
            {error && <p>Error: {error}</p>}
            {!loading && !error && (
                <ul className="categories">
                    {categories.map((category) => (
                        <li key={category.id}>{category.name['en-US']}</li>
                    ))}
                </ul>
            )} */}
        </div>
    );
};

export default HomePage;
