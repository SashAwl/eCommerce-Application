import './LoginPage.scss';
import { Link, useNavigate } from 'react-router-dom';
import apiRoot from '../../utils/sdkClient';
import { ErrorObject, MyCustomerSignin } from '@commercetools/platform-sdk';
import { useGameStore } from '../../store/store';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

const CTP_PROJECT_KEY = 'mergemates';
const CT_CLIENT_ID = 'dZnENdU2BB32IKq7Bc_0AlsW';
const CT_CLIENT_SECRET = 'WYfOviHMQFxXFNtWurOwi_wBkZKTUHvp';
const CT_CLIENT_SCOPE = 'manage_project:mergemates';
const CT_AUTH_URL = 'https://auth.australia-southeast1.gcp.commercetools.com';
const CT_AUTH_URL_TOKEN = `${CT_AUTH_URL}/oauth/${CTP_PROJECT_KEY}/customers/token`;
const credentials = btoa(`${CT_CLIENT_ID}:${CT_CLIENT_SECRET}`);

const loginSchema = z.object({
    email: z
        .string()
        .min(5, 'Email address must be at least 5 character')
        .regex(/^\S.*\S$/, {
            message:
                'Email address must not contain leading or trailing whitespace.',
        })
        .regex(/^\S*$/, {
            message: 'Email address must not contain whitespaces.',
        })
        .regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, {
            message:
                'Email address must contain a domain name (e.g., example.com).',
        })
        .regex(/^[^@\s]+@[^@\s]+$/, {
            message:
                'Email address must contain an "@" symbol separating local part and domain name.',
        })
        .regex(
            /^(?!\.)(?!.*\.\.)([a-z0-9_'+\-\\.]*)[a-z0-9_+-]@([a-z0-9][a-z0-9\\-]*\.)+[a-z]{2,}$/i,
            { message: 'Please enter a valid email address' }
        ),
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
    const navigate = useNavigate();
    const gameStore = useGameStore();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema),
        mode: 'onChange',
        defaultValues: {
            email: '',
            password: '',
            rememberMe: false,
        },
    });

    const onSubmit = async (data: LoginFormData) => {
        const loginData: MyCustomerSignin = {
            email: data.email,
            password: data.password,
        };

        try {
            const response = await apiRoot
                .me()
                .login()
                .post({
                    body: loginData,
                })
                .execute();
            await navigate('/');
            gameStore.login(response.body.customer);
            gameStore.showSuccessMessage('User successfully logged in', 2000);

            const tokenAccess = await fetch(CT_AUTH_URL_TOKEN, {
                method: 'POST',
                headers: {
                    Authorization: `Basic ${credentials}`,
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: new URLSearchParams({
                    grant_type: 'password',
                    username: data.email,
                    password: data.password,
                    scope: CT_CLIENT_SCOPE,
                }),
            });

            if (!tokenAccess.ok) {
                throw new Error('Failed to fetch auth token');
            }

            // interface TokenResponse {
            //     access_token: string;
            //     token_type: string;
            //     expires_in: number;
            //     scope: string;
            // }
            // const tokenData = (await tokenAccess.json()) as TokenResponse;
            // localStorage.setItem('authToken', JSON.stringify(tokenData));
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
                    message = 'Invalid email or password. Please try again.';
                } else {
                    message = ctError.message ?? message;
                }
            } else if (error.statusCode === 400) {
                message = 'Invalid email or password provided.';
            }

            gameStore.showErrorMessage(message, 2000);
        }
    };

    return (
        <div className="auth__container">
            <div className="auth_form__container">
                <form
                    className="auth_form"
                    onSubmit={(e) => void handleSubmit(onSubmit)(e)}
                >
                    <h2>Sign in or create account</h2>

                    <div className="form_group">
                        <label className="form_label" htmlFor="email">
                            Email
                        </label>
                        <input
                            id="email"
                            placeholder="Enter your email"
                            className={`form_input ${errors.email ? 'error' : ''}`}
                            {...register('email')}
                        />
                        {errors.email && (
                            <div className="formError">
                                {errors.email.message}
                            </div>
                        )}
                    </div>
                    <div className="form_group">
                        <label className="form_label" htmlFor="password">
                            Password
                        </label>
                        <input
                            id="password"
                            type="password"
                            placeholder="Enter your password"
                            className={`form_input ${errors.password ? 'error' : ''}`}
                            {...register('password')}
                        />
                        {errors.password && (
                            <div className="form_error">
                                {errors.password.message}
                            </div>
                        )}
                    </div>
                    <button className="btn_primary" type="submit">
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
