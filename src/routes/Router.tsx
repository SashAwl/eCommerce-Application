import { Routes, Route } from 'react-router-dom';
import HomePage from '../pages/home/Home';
import NotFoundPage from '../pages/not-found/NotFoundPage';
import { LoginPage } from '../pages/login/LoginPage';
import Registration from '../pages/registration/Registration';

export default function Router() {
    return (
        <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/registration" element={<Registration />} />
            <Route path="/home" element={<HomePage />} />
            <Route path="/not-found" element={<NotFoundPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/*" element={<NotFoundPage />} />
        </Routes>
    );
}
