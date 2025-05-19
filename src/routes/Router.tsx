import { Routes, Route } from 'react-router-dom';
import { Navigate } from 'react-router-dom';
import HomePage from '../pages/home/Home';
import NotFoundPage from '../pages/not-found/NotFoundPage';
import Registration from '../pages/registration/Registration';
import LoginPage from '../pages/login/Login';
import { useGameStore } from '../store/store';
import Cart from '../pages/cart/Cart';
import Heart from '../pages/heart/Heart';
import Games from '../pages/games/Games';
import About from '../pages/about/About';

export default function Router() {
    const isLogin = useGameStore((state) => state.isLogin);

    return (
        <Routes>
            <Route path="/" element={<HomePage />} />
            <Route
                path="/registration"
                element={
                    !isLogin ? (
                        <Registration />
                    ) : (
                        <Navigate to="/home" replace />
                    )
                }
            />
            <Route path="/home" element={<HomePage />} />
            <Route path="/not-found" element={<NotFoundPage />} />
            <Route
                path="/login"
                element={
                    !isLogin ? <LoginPage /> : <Navigate to="/home" replace />
                }
            />
            <Route path="/cart" element={<Cart />} />
            <Route path="/heart" element={<Heart />} />
            <Route path="/games" element={<Games />} />
            <Route path="/about" element={<About />} />
            <Route path="/*" element={<NotFoundPage />} />
        </Routes>
    );
}
