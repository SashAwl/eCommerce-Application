import { IRegisterBody, RegisterFormData } from '../../types/interfaces';

export function generateRequestBody(
    data: RegisterFormData,
    isOneAddress: boolean,
    isDefaultShipping: boolean,
    isDefaultBilling: boolean
) {
    const dateOfBirth = new Date(data.dateOfBirth).toISOString().split('T')[0];

    const body: IRegisterBody = {
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        password: data.password,
        addresses: [
            {
                country: data.country,
                postalCode: data.postalCode,
                city: data.city,
                streetName: data.streetName,
            },
        ],
        dateOfBirth: dateOfBirth,
        shippingAddresses: [0],
    };
    if (isOneAddress) {
        body.billingAddresses = [0];
    } else {
        body.addresses.push({
            country: data.countryBill,
            postalCode: data.postalCodeBill,
            city: data.cityBill,
            streetName: data.streetNameBill,
        });
        body.billingAddresses = [1];
    }
    if (isDefaultShipping) {
        body.defaultShippingAddress = body.shippingAddresses[0];
    }

    if (isDefaultBilling) {
        body.defaultBillingAddress = body.billingAddresses[0];
    }
    return body;
}
