import React from 'react';

interface SelectFieldProps
    extends React.InputHTMLAttributes<HTMLSelectElement> {
    label: string;
    inputId: string;
    error?: string;
}

const SelectField: React.FC<SelectFieldProps> = ({
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
            <select
                id={inputId}
                className={`formInput ${error ? 'error' : ''} `}
                {...props}
            >
                <option value="" disabled>
                    --Select a country--
                </option>
                <option value="KZ">Kazakhstan </option>
                <option value="UK">United Kingdom</option>
                <option value="RU">Russia</option>
                <option value="CA">Canada </option>
                <option value="BY">Belarus </option>
                <option value="US">United States</option>
                <option value="DE">Germany </option>
            </select>
            {error && <div className="formError">{error}</div>}
        </div>
    );
};

export default SelectField;
