import React from 'react';

interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label: string;
    inputId: string;
    error?: string;
}

const InputField: React.FC<InputFieldProps> = ({
    inputId,
    label,
    error,
    ...props
}) => {
    return (
        <div className={'formGroup'}>
            <label htmlFor={inputId} className={'formLabel'}>
                {label}
            </label>
            <input
                id={inputId}
                className={`formInput ${error ? 'error' : ''} `}
                {...props}
            />
            {error && <div className="formError">{error}</div>}
        </div>
    );
};

export default InputField;
