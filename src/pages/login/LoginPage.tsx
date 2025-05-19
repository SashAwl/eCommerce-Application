import { useRef } from 'react';
import './LoginPage.scss';
import { Link } from 'react-router-dom';
import apiRoot from '../../utils/sdkClient';
import { MyCustomerSignin } from '@commercetools/platform-sdk';

export function LoginPage() {
    const refLogin = useRef<HTMLInputElement>(null);
    const refPassword = useRef<HTMLInputElement>(null);

    const onSubmit = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault();
        const email = refLogin.current!.value;
        const password = refPassword.current!.value;

        const loginData: MyCustomerSignin = {
            email,
            password,
        };

        void (async () => {
            const response = await apiRoot
                .me()
                .login()
                .post({
                    body: loginData,
                })
                .execute();
            console.log(response.body);
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
                            className="form_input"
                            ref={refLogin}
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
