import { Link } from 'react-router-dom';
import './HeroStyles.scss';

const HeroSection = () => {
    return (
        <div className="hero">
            <img
                src="https://images.unsplash.com/photo-1605379399642-870262d3d051?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2000&h=700"
                alt="banner"
                className="hero__image"
            />
            <div className="hero__content">
                <h1 className="hero__title">Cyberpunk 2077: Phantom Liberty</h1>
                <p className="hero__description">
                    Explore Night City's most infamous district in this
                    thrilling expansion. New missions, characters, and
                    cybernetic upgrades await.
                </p>
                <div className="hero__actions">
                    <Link to="/not-found">
                        <button className="btn-buy">Buy Now</button>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default HeroSection;
