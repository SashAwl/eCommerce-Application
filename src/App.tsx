import './App.css';

import { useEffect } from 'react';
import apiRoot from './utils/sdkClient';
import { useCategoryStore, useGameStore } from './store/store';

import Header from './components/header/Header';
import Main from './pages/main/Main';
import Footer from './components/footer/Footer';
import PopupSuccess from './components/popup/PopupSuccess';
import PopupError from './components/popup/PopupError';
import createCart from './utils/cart/createCart';

export function App() {
    const { setCategories, setLoadingStatus, setError } = useCategoryStore();
    const { cartId, setCardId, setCardVersion } = useGameStore();

    useEffect(() => {
        setLoadingStatus(true);
        if (!cartId) {
            createCart()
                .then((data) => {
                    if (data) {
                        setCardId(data.id);
                        setCardVersion(data.version);
                    }
                })
                .catch((err) => {
                    console.error(err);
                });
        }
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
