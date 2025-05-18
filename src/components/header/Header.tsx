// import { useState } from 'react';
import { Link } from 'react-router-dom';
import './HeaderStyles.scss';

const Header = () => {
    return (
        <header className="header">
            <div className="container">
                <div className="header__inner">
                    <Link to="/" className="logo">
                        <i className="fas fa-gamepad"></i>
                        GameStore
                    </Link>

                    <nav className="nav">
                        <ul className="nav__list">
                            <li className="nav__list__item">
                                <Link to="/" className="item-link">
                                    Home
                                </Link>
                            </li>
                            <li className="nav__list__item">
                                <Link to="/not-found" className="item-link">
                                    Games
                                </Link>
                            </li>
                            <li className="nav__list__item">
                                <Link to="/not-found" className="item-link">
                                    Categories
                                </Link>
                            </li>
                            <li className="nav__list__item">
                                <Link to="/not-found" className="item-link">
                                    Deals
                                </Link>
                            </li>
                            <li className="nav__list__item">
                                <Link to="/not-found" className="item-link">
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
                        <a href="#" className="header__icon">
                            <i className="fas fa-shopping-cart"></i>
                        </a>
                        <a href="#" className="header__icon">
                            <i className="fas fa-heart"></i>
                        </a>
                        <Link to={'/login'} className="btn-auth">
                            Log In
                        </Link>
                    </div>

                    <div className="menu-toggle">
                        <i className="fas fa-bars"></i>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
