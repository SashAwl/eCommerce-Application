import { useState } from 'react';
import { useGameStore } from '../../store/store';
import apiRoot from '../../utils/sdkClient';
import './Popup.scss';

export default function PopupDeleteCart() {
    const {
        cartId,
        cartVersion,
        setCardId,
        setCardVersion,
        setSuccessMessage,
        setErrorMessage,
        isDeletePopupVisible,
        changeDeletePopupVisible,
    } = useGameStore();
    const [isDeleteButtonDisabled, setDeleteButtonDisabled] = useState(false);
    function closePopUp(
        event:
            | React.MouseEvent<HTMLDivElement>
            | React.MouseEvent<HTMLButtonElement>
    ) {
        if (event.currentTarget === event.target) {
            changeDeletePopupVisible(false);
        }
    }
    function showTempMessage(
        isSuccess: boolean,
        message: string,
        delay = 1500
    ) {
        const clb = isSuccess ? setSuccessMessage : setErrorMessage;
        clb(message);
        setTimeout(() => {
            clb('');
        }, delay);
    }
    function clearCart() {
        setDeleteButtonDisabled(true);
        apiRoot
            .carts()
            .withId({ ID: cartId! })
            .delete({
                queryArgs: {
                    version: cartVersion ?? 1,
                },
            })
            .execute()
            .then(() => {
                setCardId(null);
                setCardVersion(null);
                showTempMessage(true, 'Cart delete');
                changeDeletePopupVisible(false);
            })
            .catch(() => {
                showTempMessage(
                    false,
                    'Something went wrong... Try again later'
                );
            })
            .finally(() => {
                setDeleteButtonDisabled(false);
            });
    }
    return (
        <div
            className={`cartPopUpContainer ${isDeletePopupVisible ? 'cartPopUpContainerVisible' : ''}`}
            onClick={closePopUp}
        >
            <div className="cartPopupWrapper">
                <div className="cartPopUpTitle">
                    Are you sure you want to clear your cart?
                </div>

                <div className="cartPopUpButtons">
                    <button
                        className="cartPopUpButtonYes"
                        disabled={isDeleteButtonDisabled}
                        onClick={clearCart}
                    >
                        Yeas clear Cart
                    </button>
                    <button className="cartPopUpButtonNo" onClick={closePopUp}>
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
}
