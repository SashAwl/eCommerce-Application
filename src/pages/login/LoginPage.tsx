import { useRef } from 'react';
import './LoginPage.scss';
import { Link, useNavigate } from 'react-router-dom';
import apiRoot from '../../utils/sdkClient';
import { ErrorObject, MyCustomerSignin } from '@commercetools/platform-sdk';
import { useGameStore } from '../../store/store';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

const loginSchema = z.object({
    email: z.string().email('Please enter a valid email address'),
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
    rememberMe: z.boolean().optional(),
});

type LoginFormData = z.infer<typeof loginSchema>;

export function LoginPage() {
    const refLogin = useRef<HTMLInputElement>(null);
    const refPassword = useRef<HTMLInputElement>(null);

    const navigate = useNavigate();
    const gameStore = useGameStore();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: '',
            password: '',
            rememberMe: false,
        },
    });
    console.log(register, handleSubmit);

    const onSubmit = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault();
        const email = refLogin.current!.value;
        const password = refPassword.current!.value;

        const loginData: MyCustomerSignin = {
            email,
            password,
        };

        void (async () => {
            try {
                const response = await apiRoot
                    .me()
                    .login()
                    .post({
                        body: loginData,
                    })
                    .execute();
                await navigate('/');
                gameStore.login();
                gameStore.setSuccessMessage('User successfully logged in');
                setTimeout(() => {
                    gameStore.clearSuccessMessage();
                }, 2000);
                console.log(response.body);
            } catch (e: unknown) {
                const error = e as ErrorObject;
                console.error('Login error:', error);
                let message = 'An unknown error occurred during login.';
                const errBody = error.body as
                    | {
                          message: string;
                          errors: {
                              message?: string;
                              code: string;
                          }[];
                      }
                    | undefined;
                if (errBody?.message) {
                    message = errBody.message;
                } else if (error.message) {
                    message = error.message;
                }

                if (
                    error.body &&
                    Array.isArray(errBody?.errors) &&
                    errBody.errors.length > 0
                ) {
                    const ctError = errBody.errors[0];
                    if (ctError.code === 'InvalidCredentials') {
                        message =
                            'Invalid email or password. Please try again.';
                    } else {
                        message = ctError.message ?? message;
                    }
                } else if (error.statusCode === 400) {
                    message = 'Invalid email or password provided.';
                }

                gameStore.setErrorMessage(message);
                setTimeout(() => {
                    gameStore.clearErrorMessage();
                }, 2000);
            }
        })();
    };

    return (
        <div className="auth__container">
            <div className="auth_form__container">
                <form className="auth_form" action="">
                    <h2>Sign in or create account</h2>

                    <div className="form_group">
                        <label className="form_label" htmlFor="email">
                            Email
                        </label>
                        <input
                            id="email"
                            type="email"
                            placeholder="Enter your email"
                            ref={refLogin}
                            className={`form_input ${errors.email ? 'error' : ''}`}
                            // {...register('email')}
                        />
                        <label className="form_label" htmlFor="password">
                            Password
                        </label>
                        <input
                            id="password"
                            type="password"
                            placeholder="Enter your password"
                            className="form_input"
                            ref={refPassword}
                        />
                    </div>
                    <button className="btn_primary" onClick={onSubmit}>
                        Sign In
                    </button>

                    <div className="form_footer">
                        <Link to="/registration">Create account</Link>
                    </div>
                </form>
            </div>
        </div>
    );
}
