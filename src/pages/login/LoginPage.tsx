import { useState } from 'react';

export function LoginPage(props: {
    onLogin?: (login: string, password: string) => void;
}) {
    const [login, setLogin] = useState('');
    const [password, setPassword] = useState('');
    return (
        <div>
            <form action="">
                <h2>Sign in or create account</h2>
                <label htmlFor="email">Email</label>
                <input
                    id="email"
                    type="email"
                    value={login}
                    placeholder="Enter your email"
                    onInput={(e) =>
                        setLogin((e.target as HTMLInputElement).value)
                    }
                />
                <label htmlFor="password">Password</label>
                <input
                    id="password"
                    type="password"
                    value={password}
                    placeholder="Enter your password"
                    onInput={(e) =>
                        setPassword((e.target as HTMLInputElement).value)
                    }
                />
                <button
                    type="submit"
                    onClick={() => props.onLogin?.(login, password)}
                >
                    Sign In
                </button>

                <div>
                    <a href="#forgot-password">Forgot password?</a>
                    <a href="#">Create account</a>
                </div>
            </form>
        </div>
    );
}
