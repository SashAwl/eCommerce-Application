import { Link } from 'react-router-dom';
import './FooterStyles.scss';

const Footer = () => {
    return (
        <footer className="footer">
            <div className="container">
                <div className="footer__columns">
                    <div className="footer__column">
                        <Link to="/" className="footerLogo">
                            <i className="fas fa-gamepad"></i>
                            GameVault
                        </Link>
                        <p className="footerDescription">
                            Your one-stop shop for all gaming needs. Find the
                            latest titles, best deals, and build your ultimate
                            game collection.
                        </p>
                        <div className="footerSocial">
                            <a
                                href="https://facebook.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="socialIcon"
                            >
                                <i className="fab fa-facebook-f"></i>
                            </a>
                            <a
                                href="https://twitter.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="socialIcon"
                            >
                                <i className="fab fa-twitter"></i>
                            </a>
                            <a
                                href="https://instagram.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="socialIcon"
                            >
                                <i className="fab fa-instagram"></i>
                            </a>
                            <a
                                href="https://discord.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="socialIcon"
                            >
                                <i className="fab fa-discord"></i>
                            </a>
                        </div>
                    </div>
                </div>

                <div className="footerBottom">
                    <div className="footerCopyright">
                        &copy; {new Date().getFullYear()} GameStore. All rights
                        reserved.
                    </div>
                    <div className="footerPayment">
                        <i className="fa-brands fa-cc-visa paymentIcon"></i>
                        <i className="fa-brands fa-cc-mastercard paymentIcon"></i>
                        <i className="fa-brands fa-cc-paypal paymentIcon"></i>
                        <i className="fa-brands fa-cc-discover paymentIcon"></i>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
