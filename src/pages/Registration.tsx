import { useForm } from 'react-hook-form';
import './RegisterPage.scss';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import apiRoot from '../utils/sdkClient';
import React, { useState } from 'react';

const thirteenYearsAgo = new Date();
thirteenYearsAgo.setFullYear(thirteenYearsAgo.getFullYear() - 13);

const countriesIndex = {
    US: /^\d{5}(-\d{4})?$/,
    RU: /^\d{6}$/,
    BY: /^\d{6}$/,
    KZ: /^\d{6}$/,
    def: /^\d{9999}$/,
};

const createSchema = (selectedCountry: keyof typeof countriesIndex) => {
    const indexSchema = countriesIndex[selectedCountry];
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
        streetName: z.string().min(1, 'Street must be at least 1 characters'),
        city: z
            .string()
            .min(1, 'City name must be at least 1 characters')
            .regex(/^[A-Za-z]+$/, 'City  must contain only letters'),
        country: z.string().nonempty('Need to select a country'),
        postalCode: z.string().regex(indexSchema, 'Incorrect postal code'),
    });
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
}
function Registration() {
    const [selectedOption, setSelectedOption] =
        useState<keyof typeof countriesIndex>('def');
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<RegisterFormData>({
        resolver: zodResolver(createSchema(selectedOption)),
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
        },
        mode: 'onTouched',
    });
    const setIndexRegex = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedOption(e.target.value as keyof typeof countriesIndex);
    };

    const onSubmit = async (data: RegisterFormData) => {
        const dateOfBirth = new Date(data.dateOfBirth)
            .toISOString()
            .split('T')[0];
        return await apiRoot
            .customers()
            .post({
                body: {
                    email: data.email,
                    firstName: data.firstName,
                    lastName: data.lastName,
                    password: data.password,
                    addresses: [
                        {
                            country: data.country,
                            postalCode: data.postalCode,
                            city: data.city,
                        },
                    ],
                    dateOfBirth: dateOfBirth,
                },
            })
            .execute()
            .then(({ body }) => {
                console.log(body.customer.id);
            })
            .catch(console.error);
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
                                <option value="">--Select a country--</option>
                                <option value="US">United States</option>
                                <option value="RU">Russia</option>
                                <option value="BY">Belarus </option>
                                <option value="KZ">Kazakhstan </option>
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
                        <button type="submit" className="btnPrimary">
                            Create Account
                        </button>
                    </div>

                    <div className={'formFooter'}>
                        <span>Already have an account?</span>
                        <a href="#">Sign In</a>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default Registration;
