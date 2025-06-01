import './App.css';

import { useEffect } from 'react';
import apiRoot from './utils/sdkClient';
import { useCategoryStore } from './store/store';

import Header from './components/header/Header';
import Main from './pages/main/Main';
import Footer from './components/footer/Footer';
import PopupSuccess from './components/popup/PopupSuccess';
import PopupError from './components/popup/PopupError';

export function App() {
    const { setCategories, setLoadingStatus, setError } = useCategoryStore();

    useEffect(() => {
        setLoadingStatus(true);

        const fetchCategories = async () => {
            try {
                const response = await apiRoot.categories().get().execute();

                setCategories(response.body.results);
            } catch (err: unknown) {
                if (err instanceof Error) {
                    setError(err.message);
                    console.error(err);
                } else {
                    setError('Unknown error');
                    console.error('Unexpected error', err);
                }
            } finally {
                setLoadingStatus(false);
            }
        };

        fetchCategories().catch((error) => console.log(error));
    }, []);

    return (
        <>
            <Header />
            <Main />
            <Footer />
            <PopupSuccess />
            <PopupError />
        </>
    );
}

export default App;
