import { useGameStore } from '../../store/store';
import './Popup.scss';

export default function PopupError() {
    const message = useGameStore((state) => state.errorMessage);
    return (
        <div className={`popup ${message ? 'popup__show' : 'popup__hide'}`}>
            {message && (
                <div className="popup_background__error">
                    <div className="popup_text">{message}</div>
                </div>
            )}
        </div>
    );
}
