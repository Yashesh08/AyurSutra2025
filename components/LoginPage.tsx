import React, { useState } from 'react';
import { Logo } from './icons/Logo';
import { useAppContext } from '../App';
import { ArrowLeftIcon } from './icons/ArrowLeftIcon';
import { useTranslation } from '../i18n';

interface LoginPageProps {
    error: string | null;
}

interface FormInputProps {
    id: string;
    type: string;
    placeholder: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const FormInput: React.FC<FormInputProps> = ({ id, type, placeholder, value, onChange }) => (
     <div className="relative">
        <input
            id={id}
            type={type}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            required
            className="w-full bg-ivory border border-border-soft rounded-lg py-3 px-4 text-text-dark placeholder-text-soft focus:outline-none focus:ring-2 focus:ring-saffron transition-all duration-300 peer"
        />
        <label htmlFor={id} className="absolute left-4 -top-2.5 text-xs text-saffron bg-sand px-1 transition-all duration-300 opacity-0 peer-focus:opacity-100 peer-[:not(:placeholder-shown)]:opacity-100">{placeholder}</label>
    </div>
);

export const LoginPage: React.FC<LoginPageProps> = ({ error }) => {
    const { state, dispatch } = useAppContext();
    const { users } = state;
    const { t } = useTranslation();

    const [isLoginView, setIsLoginView] = useState(true);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = (email: string, pass: string) => {
        const user = users.find(u => u.email === email && u.password === pass);
        if (user) {
            dispatch({ type: 'LOGIN_SUCCESS', payload: user });
        } else {
            dispatch({ type: 'LOGIN_FAIL', payload: 'invalid_email_or_password' });
        }
    };

    const handleRegister = (name: string, email: string, pass: string) => {
        if (users.some(u => u.email === email)) {
            dispatch({ type: 'LOGIN_FAIL', payload: 'email_exists' });
            return;
        }
        const newUser = {
            id: `p${users.length + 1}`, name, email, password: pass, 
            // Fix: Add 'as const' to ensure 'role' is typed as 'user' literal, not string.
            role: 'user' as const,
            avatar: `https://i.pravatar.cc/150?u=${email}`,
        };
        dispatch({ type: 'REGISTER_SUCCESS', payload: newUser });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (isLoginView) {
            handleLogin(email, password);
        } else {
            handleRegister(name, email, password);
        }
    };
    

    return (
        <div className="flex items-center justify-center min-h-screen bg-ivory font-sans text-text-dark p-4">
             <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(94,139,126,0.1)_0%,_transparent_60%)]"></div>
             <button
                onClick={() => dispatch({ type: 'SET_APP_STATE', payload: 'landing' })}
                aria-label="Back to home"
                className="absolute top-6 left-6 z-20 flex items-center gap-2 px-4 py-2 text-sm font-semibold text-text-dark bg-sand border border-border-soft rounded-full shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all group"
            >
                <ArrowLeftIcon className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
                <span>{t('back_to_home')}</span>
            </button>
            <div className="relative z-10 w-full max-w-md animate-fade-in-up">
                <div className="bg-sand border border-border-soft rounded-2xl shadow-xl p-8">
                     <div className="text-center mb-8">
                        <div className="mx-auto mb-4 animate-subtle-pulse">
                            <Logo size={64} />
                        </div>
                        <h1 className="text-3xl font-bold font-display">AyurSetu</h1>
                        <p className="text-text-soft">Holistic Wellness, Modernized</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                         <h2 className="text-2xl font-semibold text-center text-text-dark font-display mb-2">{isLoginView ? t('login_welcome_back') : t('create_account')}</h2>
                        {!isLoginView && (
                            <FormInput id="name" type="text" placeholder={t('full_name')} value={name} onChange={e => setName(e.target.value)} />
                        )}
                        <FormInput id="email" type="email" placeholder={t('email_address')} value={email} onChange={e => setEmail(e.target.value)} />
                        <FormInput id="password" type="password" placeholder={t('password')} value={password} onChange={e => setPassword(e.target.value)} />

                        {error && <p className="text-red-500 text-sm text-center animate-pulse">{t(error)}</p>}

                        <button
                            type="submit"
                            className="w-full bg-gradient-to-r from-saffron to-yellow-500 text-text-dark font-bold py-3 px-6 rounded-lg hover:scale-105 transition-transform duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-saffron focus:ring-offset-sand shadow-md"
                        >
                            {isLoginView ? t('login') : t('register')}
                        </button>
                    </form>
                    
                    <p className="text-center text-sm text-text-soft mt-6">
                        {isLoginView ? t('dont_have_account') : t('already_have_account')}
                        <button onClick={() => { setIsLoginView(!isLoginView); setEmail(''); setPassword(''); setName(''); dispatch({ type: 'LOGIN_FAIL', payload: '' }) }} className="font-semibold text-saffron hover:underline ml-2">
                            {isLoginView ? t('sign_up') : t('log_in')}
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
};
