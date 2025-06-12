import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './HeaderStyles.scss';
import { useGameStore } from '../../store/store';

const Header = () => {
    const [menuOpen, setMenuOpen] = useState(false);
    const isLogin = useGameStore((state) => state.isLogin);
    const user = useGameStore((state) => state.customer);
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

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                event.target instanceof HTMLElement &&
                (event.target.closest('.item-link') ||
                    !event.target.closest('.nav')) &&
                !event.target.closest('.menu-toggle')
            ) {
                setMenuOpen(false);
            }
        };

        document.addEventListener('click', handleClickOutside);

        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, []);

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
                                <Link to="/catalog" className="item-link">
                                    Catalog
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
                            <div className="btn-auth">
                                <Link
                                    to="/profile"
                                    className="item-link item-btn"
                                >
                                    {user?.firstName ?? 'Profile'}
                                </Link>
                            </div>
                        )}
                        {isLogin && (
                            <div className="btn-auth" onClick={logoutHandler}>
                                <Link to="/" className="item-link item-btn">
                                    Log out
                                </Link>
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
