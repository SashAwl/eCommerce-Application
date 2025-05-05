import { render, fireEvent, screen } from '@testing-library/react';
import { App } from './App';

describe('App', () => {
    it('renders Vite + React title', () => {
        render(<App />);
        const titleElement = screen.getByText(/Vite \+ React/i);
        expect(titleElement).toBeInTheDocument();
    });

    it('renders Vite and React logos', () => {
        render(<App />);
        const viteLogoElement = screen.getByAltText('Vite logo');
        const reactLogoElement = screen.getByAltText('React logo');
        expect(viteLogoElement).toBeInTheDocument();
        expect(reactLogoElement).toBeInTheDocument();
    });

    it('renders initial count', () => {
        render(<App />);
        const countElement = screen.getByText('count is 0');
        expect(countElement).toBeInTheDocument();
    });

    it('increments count on button click', () => {
        render(<App />);
        const buttonElement = screen.getByText(/count is 0/i);
        fireEvent.click(buttonElement);
        const countElement = screen.getByText('count is 1');
        expect(countElement).toBeInTheDocument();
    });
});
