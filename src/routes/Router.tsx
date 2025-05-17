import { Routes, Route } from 'react-router-dom';
import HomePage from '../pages/home/Home';
import NotFoundPage from '../pages/not-found/NotFoundPage';

export default function Router() {
    return (
        <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/not-found" element={<NotFoundPage />} />
        </Routes>
    );
}
