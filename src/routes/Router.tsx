import { Routes, Route } from 'react-router-dom';
import HomePage from '../pages/home/Home';
import NotFoundPage from '../pages/not-found/NotFoundPage';
import Registration from '../pages/registration/Registration';
import LoginPage from '../pages/login/Login';
import { useGameStore } from '../store/store';

export default function Router() {
    const isLogin = useGameStore((state) => state.isLogin);

    return (
        <Routes>
            <Route path="/" element={<HomePage />} />
            <Route
                path="/registration"
                element={!isLogin ? <Registration /> : <HomePage />}
            />
            <Route path="/home" element={<HomePage />} />
            <Route path="/not-found" element={<NotFoundPage />} />
            <Route
                path="/login"
                element={!isLogin ? <LoginPage /> : <HomePage />}
            />
            <Route path="/*" element={<NotFoundPage />} />
        </Routes>
    );
}
