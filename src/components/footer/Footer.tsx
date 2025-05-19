import { Link } from 'react-router-dom';
import './FooterStyles.scss';

const Footer = () => {
    return (
        <footer className="footer">
            <div className="container">
                <div className="footer__columns">
                    <div className="footer__column">
                        <Link to="/" className="footer__logo">
                            <i className="fas fa-gamepad"></i>
                            GameStore
                        </Link>
                        <p className="footer__description">
                            Your one-stop shop for all gaming needs. Find the
                            latest titles, best deals, and build your ultimate
                            game collection.
                        </p>
                        <div className="footer__social">
                            <a
                                href="https://facebook.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="social-icon"
                            >
                                <i className="fab fa-facebook-f"></i>
                            </a>
                            <a
                                href="https://twitter.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="social-icon"
                            >
                                <i className="fab fa-twitter"></i>
                            </a>
                            <a
                                href="https://instagram.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="social-icon"
                            >
                                <i className="fab fa-instagram"></i>
                            </a>
                            <a
                                href="https://discord.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="social-icon"
                            >
                                <i className="fab fa-discord"></i>
                            </a>
                        </div>
                    </div>
                </div>

                <div className="footer__bottom">
                    <div className="footer__copyright">
                        &copy; {new Date().getFullYear()} GameStore. All rights
                        reserved.
                    </div>
                    <div className="footer__payment">
                        <i className="fa-brands fa-cc-visa payment-icon"></i>
                        <i className="fa-brands fa-cc-mastercard payment-icon"></i>
                        <i className="fa-brands fa-cc-paypal payment-icon"></i>
                        <i className="fa-brands fa-cc-discover payment-icon"></i>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
