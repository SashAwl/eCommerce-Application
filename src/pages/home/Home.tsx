import { useEffect } from 'react';
import HeroSection from '../../components/hero/HeroSection';
import DiscountCodes from '../../components/discount-codes/DiscountCodes';
import './HomePage.scss';

const HomePage = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="home">
            <HeroSection />
            <DiscountCodes />
        </div>
    );
};

export default HomePage;
