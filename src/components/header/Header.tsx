import { useState } from 'react';
import { Link } from 'react-router-dom';
import './HeaderStyles.scss';
import { useGameStore } from '../../store/store';

const Header = () => {
    const [menuOpen, setMenuOpen] = useState(false);
    const isLogin = useGameStore((state) => state.isLogin);
    const logOut = useGameStore((state) => state.logout);

    const logoutHandler = () => {
        try {
            localStorage.clear();
            logOut();
        } catch (error) {
            console.error('Ошибка при логауте:', error);
        }
    };

    const toggleMenu = () => {
        setMenuOpen(!menuOpen);
    };

    return (
        <header className="header">
            <div className="container">
                <div className="header__inner">
                    <Link to="/" className="logo">
                        <i className="fas fa-gamepad"></i>
                        <p className="logo__heading">GameStore</p>
                    </Link>

                    <nav className={`nav ${menuOpen ? 'active' : ''}`}>
                        <ul className="nav__list">
                            <li className="nav__list__item">
                                <Link to="/" className="item-link">
                                    Home
                                </Link>
                            </li>
                            <li className="nav__list__item">
                                <Link to="/games" className="item-link">
                                    Games
                                </Link>
                            </li>
                            <li className="nav__list__item">
                                <Link to="/not-found" className="item-link">
                                    Categories
                                </Link>
                            </li>
                            <li className="nav__list__item">
                                <Link to="/about" className="item-link">
                                    About
                                </Link>
                            </li>
                        </ul>
                    </nav>

                    <div className="header__icons">
                        <div className="search">
                            <form>
                                <input
                                    id="search-input"
                                    type="text"
                                    placeholder="Search games..."
                                    className="search__input"
                                />
                            </form>
                            <i className="search__icon fas fa-search"></i>
                        </div>
                        <Link to="/cart" className="header__icon">
                            <i className="fas fa-shopping-cart"></i>
                        </Link>
                        <Link to="/heart" className="header__icon">
                            <i className="fas fa-heart"></i>
                        </Link>

                        {!isLogin && (
                            <div className="btn-auth">
                                <Link
                                    to="/login"
                                    className="item-link item-btn"
                                >
                                    Log in
                                </Link>
                            </div>
                        )}
                        {!isLogin && (
                            <div className="btn-auth">
                                <Link
                                    to="/registration"
                                    className="item-link item-btn"
                                >
                                    Sign up
                                </Link>
                            </div>
                        )}
                        {isLogin && (
                            <div className="btn-auth" onClick={logoutHandler}>
                                Log out
                            </div>
                        )}
                    </div>

                    <div className="menu-toggle" onClick={toggleMenu}>
                        <i
                            className={`fas ${menuOpen ? 'fa-times' : 'fa-bars'}`}
                        ></i>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
