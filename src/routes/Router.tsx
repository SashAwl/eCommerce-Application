import { Routes, Route } from 'react-router-dom';
import HomePage from '../pages/home/Home';
import NotFoundPage from '../pages/not-found/NotFoundPage';
import Registration from '../pages/registration/Registration';

export default function Router() {
    return (
        <Routes>
            <Route path="/" element={<Registration />} />
            <Route path="/home" element={<HomePage />} />
            <Route path="/not-found" element={<NotFoundPage />} />
        </Routes>
    );
}
