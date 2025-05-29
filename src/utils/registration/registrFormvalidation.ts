import { z } from 'zod';

export const countriesIndex = {
    US: /^\d{5}(-\d{4})?$/,
    RU: /^\d{6}$/,
    BY: /^(220|22[1-9]|2[3-9]\d|[3-9]\d{3})\d{3}$/,
    KZ: /^\d{6}$/,
    def: /^\d{9999}$/,
    DE: /^\d{5}$/,
    UK: /^([A-Z]{1,2}\d[A-Z]?\s?\d[A-Z]{2})$/,
    CA: /^[A-Z]\d[A-Z]\s?\d[A-Z]\d$/,
};

const countriesIndexText = {
    US: 'Incorrect postal code (ex. 12345, 12345-6789)',
    RU: 'Incorrect postal code (ex. 105043)',
    BY: 'Incorrect postal code (ex. 230025)',
    KZ: 'Incorrect postal code (ex. 010017)',
    def: 'Incorrect postal code',
    DE: 'Incorrect postal code (ex. 10115)',
    UK: 'Incorrect postal code (ex. SW1A 1AA)',
    CA: 'Incorrect postal code (ex. K1A 0B1)',
};

const thirteenYearsAgo = new Date();
thirteenYearsAgo.setFullYear(thirteenYearsAgo.getFullYear() - 13);
export const createSchema = (
    selectedOption: keyof typeof countriesIndex,
    selectedBillOption: keyof typeof countriesIndex,
    isOneAddress: boolean
) => {
    const indexSchema = countriesIndex[selectedOption];
    const indexText = countriesIndexText[selectedOption];
    const indexBillSchema = countriesIndex[selectedBillOption];
    const indexBillText = countriesIndexText[selectedBillOption];
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
        country: z.string(),
        postalCode: z.string().regex(indexSchema, indexText),
        streetNameBill: z.string().refine(
            (value) => {
                if (!isOneAddress) {
                    return value.length >= 1;
                }
                return true;
            },
            {
                message: 'Street must be at least 1 characters',
            }
        ),
        cityBill: z
            .string()
            .refine(
                (value) => {
                    if (!isOneAddress) {
                        return value.length >= 1;
                    }
                    return true;
                },
                {
                    message: 'City name must be at least 1 characters',
                }
            )
            .refine(
                (value) => {
                    if (!isOneAddress) {
                        return /^[A-Za-z]+$/.test(value);
                    }
                    return true;
                },
                {
                    message: 'City  must contain only letters',
                }
            ),
        countryBill: z.string(),

        postalCodeBill: z.string().refine(
            (value) => {
                if (!isOneAddress) {
                    return indexBillSchema.test(value);
                }
                return true;
            },
            {
                message: indexBillText,
            }
        ),
    });
};
