import { useState } from 'react';
import './LoginPage.scss';

export function LoginPage(props: {
    onLogin?: (login: string, password: string) => void;
}) {
    const [login, setLogin] = useState('');
    const [password, setPassword] = useState('');
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
                            className="form_input"
                            value={login}
                            onInput={(e) =>
                                setLogin((e.target as HTMLInputElement).value)
                            }
                        />
                        <label className="form_label" htmlFor="password">
                            Password
                        </label>
                        <input
                            id="password"
                            type="password"
                            placeholder="Enter your password"
                            className="form_input"
                            value={password}
                            onInput={(e) =>
                                setPassword(
                                    (e.target as HTMLInputElement).value
                                )
                            }
                        />
                    </div>
                    <button
                        type="submit"
                        className="btn_primary"
                        onClick={() => props.onLogin?.(login, password)}
                    >
                        Sign In
                    </button>

                    <div className="form_footer">
                        <a href="#forgot-password">Forgot password?</a>
                        <a href="#">Create account</a>
                    </div>
                </form>
            </div>
        </div>
    );
}
