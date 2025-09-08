import { useEffect } from 'react';
import HeroSection from '../../components/hero/HeroSection';
import DiscountCodes from '../../components/discount-codes/DiscountCodes';
import CatalogSlider from '../../components/catalog-slider/CatalogSlider';
import './HomePage.scss';

const HomePage = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="home">
            <HeroSection />
            <DiscountCodes />
            <CatalogSlider />
        </div>
    );
};

export default HomePage;
