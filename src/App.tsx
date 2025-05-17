// import { useState } from 'react';
import './styles/global.scss';
import './App.css';

import Header from './components/header/Header';
import Main from './components/Main';
import Footer from './components/Footer';

export function App() {
    return (
        <>
            <Header />
            <Main />
            <Footer />
        </>
    );
}

export default App;
