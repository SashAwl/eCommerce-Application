export interface IRegisterBody {
    email: string;
    firstName: string;
    lastName: string;
    password: string;
    addresses: {
        country: string;
        postalCode: string;
        city: string;
        streetName: string;
    }[];
    dateOfBirth: string;
    defaultShippingAddress?: number;
    shippingAddresses: number[];
    billingAddresses?: number[];
    defaultBillingAddress?: number;
}

export interface RegisterFormData {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    dateOfBirth: Date;
    streetName: string;
    city: string;
    country: string;
    postalCode: string;
    streetNameBill: string;
    cityBill: string;
    countryBill: string;
    postalCodeBill: string;
}
