import './NotFoundStyles.scss';

export default function NotFoundPage() {
    return (
        <div className="notfound">
            <div className="notfound__card">
                <div className="notfound__heading">
                    <i className="fas fa-exclamation-circle"></i>
                    <h1>404 Page Not Found</h1>
                </div>
                <p className="notfound__text">
                    The page you are looking for does not exist or has been
                    moved.
                </p>
                <a href="/" className="notfound__button">
                    Return to Home
                </a>
            </div>
        </div>
    );
}
