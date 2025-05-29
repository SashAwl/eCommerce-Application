import { useForm } from 'react-hook-form';
import './RegisterPage.scss';
import { zodResolver } from '@hookform/resolvers/zod';
import apiRoot from '../../utils/sdkClient';
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useGameStore } from '../../store/store';
import { ErrorObject } from '@commercetools/platform-sdk';
import {
    countriesIndex,
    createSchema,
} from '../../utils/registration/registrFormvalidation';
import { IRegisterBody, RegisterFormData } from '../../types/interfaces';
import { generateRequestBody } from '../../utils/registration/submitForm';
import InputField from '../../components/registration/InputField';
import SelectField from '../../components/registration/SelectField';

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
    const clearSuccessMessage = useGameStore(
        (state) => state.clearSuccessMessage
    );
    const setErrorMessage = useGameStore((state) => state.setErrorMessage);
    const clearErrorMessage = useGameStore((state) => state.clearErrorMessage);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<RegisterFormData>({
        resolver: zodResolver(
            createSchema(selectedOption, selectedBillOption, isOneAddress)
        ),
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

    const onSubmit = async (data: RegisterFormData) => {
        const body: IRegisterBody = generateRequestBody(
            data,
            isOneAddress,
            isDefaultShipping,
            isDefaultBilling
        );

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
                        clearSuccessMessage();
                    }, 2000);
                }
            })

            .catch((error: ErrorObject) => {
                if (error.code === 'DuplicateField') {
                    setErrorMessage(
                        `${error.message} Please sign in or use a different email address.`
                    );
                }
                if (error.statusCode === 400 || error.statusCode === 404) {
                    setErrorMessage(
                        `${error.message} Please change your details and try again.`
                    );
                } else {
                    setErrorMessage(`Something went wrong, please try again`);
                }
                setTimeout(() => {
                    clearErrorMessage();
                }, 3000);
            });
    };

    return (
        <div className="authContainer">
            <div className="authImage">
                <h2>GameStore</h2>
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
                    <InputField
                        inputId="email"
                        label="Email"
                        type="email"
                        placeholder="Enter your email"
                        {...register('email')}
                        error={errors.email?.message}
                    />
                    <InputField
                        inputId="password"
                        label="Password"
                        type="password"
                        placeholder="Create a password"
                        {...register('password')}
                        error={errors.password?.message}
                    />

                    <h3>Personal information</h3>

                    <InputField
                        inputId="firstName"
                        label="First name"
                        type="text"
                        placeholder="Enter your name"
                        {...register('firstName')}
                        error={errors.firstName?.message}
                    />
                    <InputField
                        inputId="lastName"
                        label="Last name"
                        type="text"
                        placeholder="Enter your last name"
                        {...register('lastName')}
                        error={errors.lastName?.message}
                    />
                    <InputField
                        inputId="dateOfBirth"
                        label="Date of birth"
                        type="date"
                        {...register('dateOfBirth', { valueAsDate: true })}
                        max={new Date().toISOString().split('T')[0]}
                        error={errors.dateOfBirth?.message}
                    />

                    <h3>Shipping Address</h3>
                    <div className="address">
                        <InputField
                            inputId="streetName"
                            label="Street"
                            type="text"
                            placeholder="Est"
                            {...register('streetName')}
                            error={errors.streetName?.message}
                        />

                        <InputField
                            inputId="city"
                            label="Street"
                            type="text"
                            placeholder="West"
                            {...register('city')}
                            error={errors.city?.message}
                        />
                        <SelectField
                            inputId="country"
                            label="Country"
                            {...register('country')}
                            onChange={setIndexRegex}
                            error={errors.country?.message}
                        />
                    </div>

                    <InputField
                        inputId="postalCode"
                        label="Postal code"
                        type="text"
                        placeholder="-------"
                        {...register('postalCode')}
                        error={errors.postalCode?.message}
                    />

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
                                <InputField
                                    inputId="streetNameBill"
                                    label="Street"
                                    type="text"
                                    placeholder="Est"
                                    {...register('streetNameBill')}
                                    error={errors.streetNameBill?.message}
                                />

                                <InputField
                                    inputId="cityBill"
                                    label="City"
                                    type="text"
                                    placeholder="West"
                                    {...register('cityBill')}
                                    error={errors.cityBill?.message}
                                />

                                <SelectField
                                    inputId="countryBill"
                                    label="Country"
                                    {...register('countryBill')}
                                    onChange={setBillIndexRegex}
                                    error={errors.countryBill?.message}
                                />
                            </div>

                            <InputField
                                inputId="postalCodeBill"
                                label="Postal code"
                                type="text"
                                placeholder="-------"
                                {...register('postalCodeBill')}
                                error={errors.postalCodeBill?.message}
                            />
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
