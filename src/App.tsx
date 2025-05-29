import './App.css';

import Header from './components/header/Header';
import Main from './pages/main/Main';
import Footer from './components/footer/Footer';
import PopupSuccess from './components/popup/PopupSuccess';
import PopupError from './components/popup/PopupError';

export function App() {
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
