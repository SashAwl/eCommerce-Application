import './discountCodesStyles.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCopy } from '@fortawesome/free-solid-svg-icons';
import { useEffect, useState } from 'react';
import apiRoot from '../../utils/sdkClient';
import { DiscountCode } from '@commercetools/platform-sdk';

const DiscountCodes = () => {
    const [discountList, setDiscountList] = useState<DiscountCode[]>([]);
    const [loading, setLoadingStatus] = useState(false);
    const [copied, setCopied] = useState(false);

    const handleCopy = async (code: string) => {
        try {
            await navigator.clipboard.writeText(code);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy!', err);
        }
    };

    const fetchDiscountCodes = async () => {
        try {
            const response = await apiRoot.discountCodes().get().execute();
            setDiscountList(
                response.body.results.filter((item) => item.isActive)
            );
        } catch (error) {
            console.log(error);
        } finally {
            setLoadingStatus(false);
        }
    };

    useEffect(() => {
        setLoadingStatus(true);
        fetchDiscountCodes().catch((error) => console.log(error));
    }, []);

    return (
        <div className="discount container">
            <h2 className="discount__heading">Promo codes</h2>
            {loading ? (
                <div className="loading">
                    <p>Loading promo codes...</p>
                </div>
            ) : (
                <div className="discount__promo">
                    {discountList.map((code) => {
                        return (
                            <div className="discount__item" key={code.id}>
                                <img
                                    className="discount__item__img"
                                    src="src\assets\sale.jpg"
                                    alt="sale"
                                />
                                <div className="discount__text">
                                    <h3 className="discount__item__name">
                                        {code.name?.['en-US']}
                                    </h3>
                                    <p className="discount__item__description">
                                        {code.description?.['en-US']}
                                    </p>
                                    <div className="copy">
                                        <input
                                            type="text"
                                            value={code.code}
                                            readOnly
                                            className="copy__text"
                                        />
                                        <FontAwesomeIcon
                                            icon={faCopy}
                                            onClick={() =>
                                                void handleCopy(code.code)
                                            }
                                            className={`copy__button ${copied ? 'copied' : ''}`}
                                        />
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default DiscountCodes;
