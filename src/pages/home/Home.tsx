// import { useEffect, useState } from 'react';
import { useEffect } from 'react';
import HeroSection from '../../components/hero/HeroSection';

const HomePage = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);
    return (
        <div className="home">
            <HeroSection />
        </div>
    );
};

export default HomePage;
