import { useForm } from 'react-hook-form';
import './RegisterPage.scss';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import apiRoot from '../../utils/sdkClient';
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useGameStore } from '../../store/store';
import { ErrorObject } from '@commercetools/platform-sdk';

const thirteenYearsAgo = new Date();
thirteenYearsAgo.setFullYear(thirteenYearsAgo.getFullYear() - 13);

const countriesIndex = {
    US: /^\d{5}(-\d{4})?$/,
    RU: /^\d{6}$/,
    BY: /^(220|22[1-9]|2[3-9]\d|[3-9]\d{3})\d{3}$/,
    KZ: /^\d{6}$/,
    def: /^\d{9999}$/,
    DE: /^\d{5}$/,
    UK: /^([A-Z]{1,2}\d[A-Z]?\s?\d[A-Z]{2})$/,
    CA: /^[A-Z]\d[A-Z]\s?\d[A-Z]\d$/,
};

const countriesIndexText = {
    US: 'Incorrect postal code (ex. 12345, 12345-6789)',
    RU: 'Incorrect postal code (ex. 105043)',
    BY: 'Incorrect postal code (ex. 230025)',
    KZ: 'Incorrect postal code (ex. 010017)',
    def: 'Incorrect postal code',
    DE: 'Incorrect postal code (ex. 10115)',
    UK: 'Incorrect postal code (ex. SW1A 1AA)',
    CA: 'Incorrect postal code (ex. K1A 0B1)',
};

interface RegisterFormData {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    dateOfBirth: Date;
    streetName: string;
    city: string;
    country: string;
    postalCode: string;
    streetNameBill: string;
    cityBill: string;
    countryBill: string;
    postalCodeBill: string;
}
function Registration() {
    const navigate = useNavigate();
    const [selectedOption, setSelectedOption] =
        useState<keyof typeof countriesIndex>('def');
    const [selectedBillOption, setSelectedBillOption] =
        useState<keyof typeof countriesIndex>('def');
    const [isDefaultShipping, setDefaultShipping] = useState(false);
    const [isDefaultBilling, setDefaultBilling] = useState(false);
    const [isOneAddress, setOneAddress] = useState(false);

    const loginStore = useGameStore((state) => state.login);

    const setSuccessMessage = useGameStore((state) => state.setSuccessMessage);
    const clearSuccesMessage = useGameStore(
        (state) => state.clearSuccessMessage
    );
    const setErrorMessage = useGameStore((state) => state.setErrorMessage);
    const clearErrorMessage = useGameStore((state) => state.clearErrorMessage);

    const createSchema = (
        selectedOption: keyof typeof countriesIndex,
        selectedBillOption: keyof typeof countriesIndex
    ) => {
        const indexSchema = countriesIndex[selectedOption];
        const indexText = countriesIndexText[selectedOption];
        const indexBillSchema = countriesIndex[selectedBillOption];
        const indexBillText = countriesIndexText[selectedBillOption];
        return z.object({
            email: z
                .string()
                .email('Please enter a valid email address (ex. user@mail.ru)'),
            password: z
                .string()
                .min(8, 'Password must be at least 8 characters')
                .regex(
                    /^(?=.*[A-Z]).+$/,
                    'Password must be at least 1 uppercase letter'
                )
                .regex(
                    /^(?=.*[a-z]).+$/,
                    'Password must be at least 1 lowercase  letter'
                )
                .regex(/^(?=.*\d).+$/, 'Password must be at least 1 number'),
            firstName: z
                .string()
                .min(1, 'First name must be at least 1 characters')
                .regex(/^([a-z, A-Z])/, 'First name must contain only letters'),
            lastName: z
                .string()
                .min(1, 'First name must be at least 1 characters')
                .regex(/^([a-z, A-Z])/, 'Last name must contain only letters'),
            dateOfBirth: z
                .date()
                .min(new Date('01-01-1900Z'), 'People must be alive')
                .max(thirteenYearsAgo, 'Minimum 13 years'),
            streetName: z
                .string()
                .min(1, 'Street must be at least 1 characters'),
            city: z
                .string()
                .min(1, 'City name must be at least 1 characters')
                .regex(/^[A-Za-z]+$/, 'City  must contain only letters'),
            country: z.string(),
            postalCode: z.string().regex(indexSchema, indexText),
            streetNameBill: z.string().refine(
                (value) => {
                    if (!isOneAddress) {
                        return value.length >= 1;
                    }
                    return true;
                },
                {
                    message: 'Street must be at least 1 characters',
                }
            ),
            cityBill: z
                .string()
                .refine(
                    (value) => {
                        if (!isOneAddress) {
                            return value.length >= 1;
                        }
                        return true;
                    },
                    {
                        message: 'City name must be at least 1 characters',
                    }
                )
                .refine(
                    (value) => {
                        if (!isOneAddress) {
                            return /^[A-Za-z]+$/.test(value);
                        }
                        return true;
                    },
                    {
                        message: 'City  must contain only letters',
                    }
                ),
            countryBill: z.string(),

            postalCodeBill: z.string().refine(
                (value) => {
                    if (!isOneAddress) {
                        return indexBillSchema.test(value);
                    }
                    return true;
                },
                {
                    message: indexBillText,
                }
            ),
        });
    };

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<RegisterFormData>({
        resolver: zodResolver(createSchema(selectedOption, selectedBillOption)),
        defaultValues: {
            email: '',
            password: '',
            firstName: '',
            lastName: '',
            dateOfBirth: new Date(),
            streetName: '',
            city: '',
            country: '',
            postalCode: '',
            streetNameBill: '',
            cityBill: '',
            countryBill: '',
            postalCodeBill: '',
        },
        mode: 'onChange',
    });
    const setIndexRegex = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedOption(e.target.value as keyof typeof countriesIndex);
    };
    const setBillIndexRegex = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedBillOption(e.target.value as keyof typeof countriesIndex);
    };
    const changeIsDefShipping = (e: React.ChangeEvent<HTMLInputElement>) => {
        setDefaultShipping(e.target.checked);
    };
    const changeIsDefBilling = (e: React.ChangeEvent<HTMLInputElement>) => {
        setDefaultBilling(e.target.checked);
    };
    const changeIsOneAddress = (e: React.ChangeEvent<HTMLInputElement>) => {
        setOneAddress(e.target.checked);
    };

    interface IBody {
        email: string;
        firstName: string;
        lastName: string;
        password: string;
        addresses: {
            country: string;
            postalCode: string;
            city: string;
            streetName: string;
        }[];
        dateOfBirth: string;
        defaultShippingAddress?: number;
        shippingAddresses: number[];
        billingAddresses?: number[];
        defaultBillingAddress?: number;
    }

    const onSubmit = async (data: RegisterFormData) => {
        const dateOfBirth = new Date(data.dateOfBirth)
            .toISOString()
            .split('T')[0];
        const body: IBody = {
            email: data.email,
            firstName: data.firstName,
            lastName: data.lastName,
            password: data.password,
            addresses: [
                {
                    country: data.country,
                    postalCode: data.postalCode,
                    city: data.city,
                    streetName: data.streetName,
                },
            ],
            dateOfBirth: dateOfBirth,
            shippingAddresses: [0],
        };

        if (isOneAddress) {
            body.billingAddresses = [0];
        } else {
            body.addresses.push({
                country: data.countryBill,
                postalCode: data.postalCodeBill,
                city: data.cityBill,
                streetName: data.streetNameBill,
            });
            body.billingAddresses = [1];
        }

        if (isDefaultShipping) {
            body.defaultShippingAddress = body.shippingAddresses[0];
        }

        if (isDefaultBilling) {
            body.defaultBillingAddress = body.billingAddresses[0];
        }

        return await apiRoot
            .customers()
            .post({
                body,
            })
            .execute()
            .then(async ({ statusCode }) => {
                if (statusCode === 201) {
                    await navigate('/home');
                    loginStore();
                    setSuccessMessage('User successfully registered');
                    setTimeout(() => {
                        clearSuccesMessage();
                    }, 2000);
                }
            })

            .catch((error: ErrorObject) => {
                setErrorMessage(
                    `${error.message} Please sign in or use a different email address.`
                );
                setTimeout(() => {
                    clearErrorMessage();
                }, 2000);
            });
    };

    return (
        <div className="authContainer">
            <div className="authImage">
                <h2>Join GameVault</h2>
                <p>
                    Create an account to start building your game collection and
                    access exclusive member benefits.
                </p>
            </div>

            <div className="authFormContainer">
                <form
                    className="authForm"
                    onSubmit={(e) => void handleSubmit(onSubmit)(e)}
                >
                    <h1>Create Account</h1>

                    <div className={'formGroup'}>
                        <label htmlFor="email" className={'formLabel'}>
                            Email
                        </label>
                        <input
                            id="email"
                            type="email"
                            className={`formInput ${errors.email ? 'error' : ''} `}
                            placeholder="Enter your email"
                            {...register('email')}
                        />
                        {errors.email && (
                            <div className="formError">
                                {errors.email.message}
                            </div>
                        )}
                    </div>

                    <div className="formGroup">
                        <label htmlFor="password" className="formLabel">
                            Password
                        </label>
                        <input
                            id="password"
                            type="password"
                            className={`formInput ${errors.password ? 'error' : ''}`}
                            placeholder="Create a password"
                            {...register('password')}
                        />
                        {errors.password && (
                            <div className="formError">
                                {errors.password.message}
                            </div>
                        )}
                    </div>

                    <h3>Personal information</h3>

                    <div className="formGroup">
                        <label htmlFor="firstName" className="formLabel">
                            First name
                        </label>
                        <input
                            id="firstName"
                            type="text"
                            className={`formInput ${errors.firstName ? 'error' : ''}`}
                            placeholder="Alex"
                            {...register('firstName')}
                        />
                        {errors.firstName && (
                            <div className="formError">
                                {errors.firstName.message}
                            </div>
                        )}
                    </div>
                    <div className="formGroup">
                        <label htmlFor="lastName" className="formLabel">
                            Last name
                        </label>
                        <input
                            id="lastName"
                            type="text"
                            className={`formInput ${errors.lastName ? 'error' : ''}`}
                            placeholder="Nevskiy"
                            {...register('lastName')}
                        />
                        {errors.lastName && (
                            <div className="formError">
                                {errors.lastName.message}
                            </div>
                        )}
                    </div>
                    <div className="formGroup">
                        <label htmlFor="dateOfBirth" className="formLabel">
                            Date of birth
                        </label>
                        <input
                            id="dateOfBirth"
                            type="date"
                            className={`formInput ${errors.dateOfBirth ? 'error' : ''}`}
                            {...register('dateOfBirth', { valueAsDate: true })}
                            max={new Date().toISOString().split('T')[0]}
                        />
                        {errors.dateOfBirth && (
                            <div className="formError">
                                {errors.dateOfBirth.message}
                            </div>
                        )}
                    </div>
                    <h3>Shipping Address</h3>
                    <div className="address">
                        <div className="formGroup">
                            <label htmlFor="streetName" className="formLabel">
                                Street
                            </label>
                            <input
                                id="streetName"
                                type="text"
                                className={`formInput ${errors.streetName ? 'error' : ''}`}
                                placeholder="Est"
                                {...register('streetName')}
                            />
                            {errors.streetName && (
                                <div className="formError">
                                    {errors.streetName.message}
                                </div>
                            )}
                        </div>

                        <div className="formGroup">
                            <label htmlFor="city" className="formLabel">
                                City
                            </label>
                            <input
                                id="city"
                                type="text"
                                className={`formInput ${errors.city ? 'error' : ''}`}
                                placeholder="Est"
                                {...register('city')}
                            />
                            {errors.city && (
                                <div className="formError">
                                    {errors.city.message}
                                </div>
                            )}
                        </div>

                        <div className="formGroup">
                            <label htmlFor="country" className="formLabel">
                                Country
                            </label>
                            <select
                                id="country"
                                className={`formInput ${errors.country ? 'error' : ''}`}
                                {...register('country')}
                                onChange={setIndexRegex}
                            >
                                <option value="" disabled>
                                    --Select a country--
                                </option>
                                <option value="KZ">Kazakhstan </option>
                                <option value="UK">United Kingdom</option>
                                <option value="RU">Russia</option>
                                <option value="CA">Canada </option>
                                <option value="BY">Belarus </option>
                                <option value="US">United States</option>
                                <option value="DE">Germany </option>
                            </select>
                            {errors.country && (
                                <div className="formError">
                                    {errors.country.message}
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="formGroup">
                        <label htmlFor="postalCode" className="formLabel">
                            Postal code
                        </label>
                        <input
                            id="postalCode"
                            type="text"
                            className={`formInput ${errors.postalCode ? 'error' : ''}`}
                            placeholder="-------"
                            {...register('postalCode')}
                        />
                        {errors.postalCode && (
                            <div className="formError">
                                {errors.postalCode.message}
                            </div>
                        )}
                    </div>
                    <div className="formGroup">
                        <label className="formLabel boxLabel">
                            <input
                                id="agreeForShipping"
                                type="checkbox"
                                className={` formCheckBox`}
                                checked={isDefaultShipping}
                                onChange={changeIsDefShipping}
                            />
                            Set Shipping Address as default
                        </label>
                    </div>
                    <div className="formGroup">
                        <label className="formLabel boxLabel">
                            <input
                                id="agreeFoOne"
                                type="checkbox"
                                className={` formCheckBox`}
                                checked={isOneAddress}
                                onChange={changeIsOneAddress}
                            />
                            Bill to Shipping Address
                        </label>
                    </div>

                    {!isOneAddress && (
                        <div>
                            <h3>Billing Address</h3>
                            <div className="address">
                                <div className="formGroup">
                                    <label
                                        htmlFor="streetNameBill"
                                        className="formLabel"
                                    >
                                        Street
                                    </label>
                                    <input
                                        id="streetNameBill"
                                        type="text"
                                        className={`formInput ${errors.streetNameBill ? 'error' : ''}`}
                                        placeholder="Est"
                                        {...register('streetNameBill')}
                                    />
                                    {errors.streetNameBill && (
                                        <div className="formError">
                                            {errors.streetNameBill.message}
                                        </div>
                                    )}
                                </div>

                                <div className="formGroup">
                                    <label
                                        htmlFor="cityBill"
                                        className="formLabel"
                                    >
                                        City
                                    </label>
                                    <input
                                        id="cityBill"
                                        type="text"
                                        className={`formInput ${errors.cityBill ? 'error' : ''}`}
                                        placeholder="Est"
                                        {...register('cityBill')}
                                    />
                                    {errors.cityBill && (
                                        <div className="formError">
                                            {errors.cityBill.message}
                                        </div>
                                    )}
                                </div>

                                <div className="formGroup">
                                    <label
                                        htmlFor="countryBill"
                                        className="formLabel"
                                    >
                                        Country
                                    </label>
                                    <select
                                        id="countryBill"
                                        className={`formInput ${errors.countryBill ? 'error' : ''}`}
                                        {...register('countryBill')}
                                        onChange={setBillIndexRegex}
                                    >
                                        <option value="" disabled>
                                            --Select a country--
                                        </option>
                                        <option value="KZ">Kazakhstan </option>
                                        <option value="UK">
                                            United Kingdom
                                        </option>
                                        <option value="RU">Russia</option>
                                        <option value="CA">Canada </option>
                                        <option value="BY">Belarus </option>
                                        <option value="US">
                                            United States
                                        </option>
                                        <option value="DE">Germany </option>
                                    </select>
                                    {errors.countryBill && (
                                        <div className="formError">
                                            {errors.countryBill.message}
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="formGroup">
                                <label
                                    htmlFor="postalCodeBill"
                                    className="formLabel"
                                >
                                    Postal code
                                </label>
                                <input
                                    id="postalCodeBill"
                                    type="text"
                                    className={`formInput ${errors.postalCodeBill ? 'error' : ''}`}
                                    placeholder="-------"
                                    {...register('postalCodeBill')}
                                />
                                {errors.postalCodeBill && (
                                    <div className="formError">
                                        {errors.postalCodeBill.message}
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    <div className="formGroup">
                        <label className="formLabel boxLabel">
                            <input
                                id="agreeForBilling"
                                type="checkbox"
                                className={` formCheckBox`}
                                checked={isDefaultBilling}
                                onChange={changeIsDefBilling}
                            />
                            Set Billing Address as default
                        </label>
                    </div>

                    <div className="formGroup">
                        <button type="submit" className="btnPrimary">
                            Create Account
                        </button>
                    </div>

                    <div className={'formFooter'}>
                        <span>Already have an account?</span>

                        <Link to="/login" className="item-link">
                            Sign In
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default Registration;
