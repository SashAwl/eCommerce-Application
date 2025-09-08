import { useGameStore } from '../../store/store';
import './Popup.scss';

export default function PopupSuccess() {
    const message = useGameStore((state) => state.successMessage);

    return (
        <div className={`popup ${message ? 'popup__show' : 'popup__hide'}`}>
            {message && (
                <div className="popup_background__success">
                    <div className="popup_text">{message}</div>
                </div>
            )}
        </div>
    );
}
