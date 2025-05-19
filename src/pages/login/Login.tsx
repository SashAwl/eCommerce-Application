import { useForm } from 'react-hook-form';
import './Login.scss';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

import { Link, useNavigate } from 'react-router-dom';
import { useGameStore } from '../../store/store';
import { ErrorObject } from '@commercetools/platform-sdk';
import { ctpClient } from '../../utils/BuildClient';
import { useEffect } from 'react';

interface loginFormData {
    email: string;
    password: string;
}
const client = ctpClient;
function LoginPage() {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const navigate = useNavigate();
    const loginStore = useGameStore((state) => state.login);

    const setSuccessMessage = useGameStore((state) => state.setSuccessMessage);
    const clearSuccesMessage = useGameStore(
        (state) => state.clearSuccessMessage
    );
    const setErrorMessage = useGameStore((state) => state.setErrorMessage);
    const clearErrorMessage = useGameStore((state) => state.clearErrorMessage);

    const createSchema = () => {
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
        });
    };

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<loginFormData>({
        resolver: zodResolver(createSchema()),
        defaultValues: {
            email: '',
            password: '',
        },
        mode: 'onChange',
    });

    interface IBody {
        email: string;
        password: string;
    }

    const onSubmit = async (data: loginFormData) => {
        const body: IBody = {
            email: data.email,
            password: data.password,
        };

        return await client
            .execute({
                method: 'POST',
                uri: '/mergemates/login',
                body,
            })
            .then(async ({ statusCode }) => {
                if (statusCode === 200) {
                    await navigate('/home');
                    loginStore();
                    setSuccessMessage('Login successful');
                    setTimeout(() => {
                        clearSuccesMessage();
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
                <h2>Login GameVault</h2>
                <p>
                    Login to your account to start building your game collection
                    and access exclusive member benefits.
                </p>
            </div>

            <div className="authFormContainer">
                <form
                    className="authForm"
                    onSubmit={(e) => void handleSubmit(onSubmit)(e)}
                >
                    <h1>Login</h1>

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
                        <button type="submit" className="btnPrimary">
                            Login to your account
                        </button>
                    </div>

                    <div className={'formFooter'}>
                        <span>Already have an account?</span>

                        <Link to="/registration" className="item-link">
                            Sign Up
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default LoginPage;
