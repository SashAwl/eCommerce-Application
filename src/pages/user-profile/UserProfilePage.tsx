import './UserProfilePage.scss';
import { useEffect, useState } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useGameStore } from '../../store/store';
import { Address } from '@commercetools/platform-sdk';

// interface UserProfile {
//     firstName: string;
//     lastName: string;
//     email: string;
//     dateOfBirth: string;
//     addresses: Address[];
// }

const profileSchema = z.object({
    firstName: z.string().min(1, 'First name is required'),
    lastName: z.string().min(1, 'Last name is required'),
    email: z.string().email('Please enter a valid email address'),
    dateOfBirth: z.string().min(1, 'Date of birth is required'),
});

const passwordSchema = z
    .object({
        currentPassword: z.string().min(6, 'Current password is required'),
        newPassword: z
            .string()
            .min(8, 'New password must be at least 8 characters'),
        confirmPassword: z.string(),
    })
    .refine((data) => data.newPassword === data.confirmPassword, {
        message: "Passwords don't match",
        path: ['confirmPassword'],
    });

const addressSchema = z.object({
    firstName: z.string().min(1, 'First name is required'),
    lastName: z.string().min(1, 'Last name is required'),
    streetName: z.string().min(1, 'Street name is required'),
    city: z.string().min(1, 'City is required'),
    postalCode: z.string().min(1, 'Postal code is required'),
    country: z.string().min(1, 'Country is required'),
});

type ProfileFormData = z.infer<typeof profileSchema>;
type AddressFormData = z.infer<typeof addressSchema>;
type PasswordFormData = z.infer<typeof passwordSchema>;

export function UserProfilePage() {
    const gameStore = useGameStore();
    const [isEditing, setIsEditing] = useState(false);
    const [isEditingPassword, setIsEditingPassword] = useState(false);
    const [editingAddress, setEditingAddress] = useState<string | null>(null);
    const [showAddAddress, setShowAddAddress] = useState(false);

    // const userProfile = useState<UserProfile>();
    const userProfile = gameStore.customer;

    const profileForm = useForm<ProfileFormData>({
        resolver: zodResolver(profileSchema),
        defaultValues: {
            firstName: userProfile?.firstName,
            lastName: userProfile?.lastName,
            email: userProfile?.email,
            dateOfBirth: userProfile?.dateOfBirth,
        },
    });

    const addressForm = useForm<AddressFormData>({
        resolver: zodResolver(addressSchema),
        defaultValues: {
            firstName: '',
            lastName: '',
            streetName: '',
            city: '',
            postalCode: '',
            country: '',
        },
    });

    const passwordForm = useForm<PasswordFormData>({
        resolver: zodResolver(passwordSchema),
        defaultValues: {
            currentPassword: '',
            newPassword: '',
            confirmPassword: '',
        },
    });

    useEffect(() => {
        profileForm.reset({
            firstName: userProfile?.firstName,
            lastName: userProfile?.lastName,
            email: userProfile?.email,
            dateOfBirth: userProfile?.dateOfBirth,
        });
    }, [userProfile, profileForm]);

    const onSubmitProfile = (data: ProfileFormData) => {
        gameStore.setCustomer((prev) => ({
            ...prev!,
            ...data,
        }));
        setIsEditing(false);
        // setSuccessMessage(
        //     'Your profile information has been successfully updated.'
        // );
        // setTimeout(() => {
        //     setSuccessMessage('');
        // }, 1000);
    };

    // const onSubmitPassword = (data: PasswordFormData) => {
    //     setIsEditingPassword(false);
    //     passwordForm.reset();
    // };
    const onSubmitPassword = () => {
        console.log();
    };

    const onSubmitAddress = (data: AddressFormData) => {
        if (editingAddress) {
            gameStore.setCustomer((prev) => ({
                ...prev!,
                addresses: prev!.addresses.map((addr) =>
                    addr.id === editingAddress ? { ...addr, ...data } : addr
                ),
            }));
            setEditingAddress(null);
        } else {
            const newAddress: Address = {
                ...data,
                id: Date.now().toString(),
            };
            gameStore.setCustomer((prev) => ({
                ...prev!,
                addresses: [...prev!.addresses, newAddress],
            }));
            setShowAddAddress(false);
        }
        addressForm.reset();
    };

    const handleEditAddress = (address: Address) => {
        addressForm.reset(address);
        setEditingAddress(address.id ?? null);
    };

    const handleDeleteAddress = (addressId: string) => {
        gameStore.setCustomer((prev) => ({
            ...prev!,
            addresses: prev!.addresses.filter((addr) => addr.id !== addressId),
        }));
    };

    const handleSetDefaultAddress = (addressId: string) => {
        gameStore.setCustomer((prev) => ({
            ...prev!,
            defaultShippingAddressId: addressId,
        }));
    };

    const handleSetDefaultAddressBilling = (addressId: string) => {
        gameStore.setCustomer((prev) => ({
            ...prev!,
            defaultBillingAddressId: addressId,
        }));
    };

    return (
        <div className="user-profile-page">
            <div className="container">
                <h1 className="title">My Profile</h1>

                <div className="section personal-info-field">
                    <div className="section-header">
                        <h2>Personal information</h2>
                        <button
                            onClick={() => setIsEditing(!isEditing)}
                            className="edit-button"
                        >
                            <i
                                className={
                                    isEditing ? 'fas fa-times' : 'fas fa-edit'
                                }
                            ></i>
                            {isEditing ? 'Cancel' : 'Edit'}
                        </button>
                    </div>

                    {isEditing ? (
                        <form
                            onSubmit={(e) =>
                                void profileForm.handleSubmit(onSubmitProfile)(
                                    e
                                )
                            }
                            className="form"
                        >
                            <div className="form-group">
                                <label>First Name</label>
                                <input
                                    {...profileForm.register('firstName')}
                                    className="input"
                                />
                                {profileForm.formState.errors.firstName && (
                                    <span className="error">
                                        {
                                            profileForm.formState.errors
                                                .firstName.message
                                        }
                                    </span>
                                )}
                            </div>

                            <div className="form-group">
                                <label>Last Name</label>
                                <input
                                    {...profileForm.register('lastName')}
                                    className="input"
                                />
                                {profileForm.formState.errors.lastName && (
                                    <span className="error">
                                        {
                                            profileForm.formState.errors
                                                .lastName.message
                                        }
                                    </span>
                                )}
                            </div>

                            <div className="form-group">
                                <label>Email</label>
                                <input
                                    type="email"
                                    {...profileForm.register('email')}
                                    className="input"
                                />
                                {profileForm.formState.errors.email && (
                                    <span className="error">
                                        {
                                            profileForm.formState.errors.email
                                                .message
                                        }
                                    </span>
                                )}
                            </div>

                            <div className="form-group">
                                <label>Date of Birth</label>
                                <input
                                    type="date"
                                    {...profileForm.register('dateOfBirth')}
                                    className="input"
                                />
                                {profileForm.formState.errors.dateOfBirth && (
                                    <span className="error">
                                        {
                                            profileForm.formState.errors
                                                .dateOfBirth.message
                                        }
                                    </span>
                                )}
                            </div>

                            <div className="form-actions">
                                <button type="submit" className="save-button">
                                    Save Changes
                                </button>
                            </div>
                        </form>
                    ) : (
                        <div className="profile-info">
                            <div className="info-item">
                                <label>First Name:</label>
                                <span>{userProfile?.firstName}</span>
                            </div>
                            <div className="info-item">
                                <label>Last Name:</label>
                                <span>{userProfile?.lastName}</span>
                            </div>
                            <div className="info-item">
                                <label>Email:</label>
                                <span>{userProfile?.email}</span>
                            </div>
                            <div className="info-item">
                                <label>Date of Birth:</label>
                                <span>
                                    {userProfile?.dateOfBirth
                                        ? new Date(
                                              userProfile.dateOfBirth
                                          ).toLocaleDateString()
                                        : null}
                                </span>
                            </div>
                        </div>
                    )}
                </div>
                <div className="section password-field">
                    <div className="section-header">
                        <h2>Password</h2>
                        <button
                            onClick={() =>
                                setIsEditingPassword(!isEditingPassword)
                            }
                            className="edit-button"
                        >
                            <i
                                className={
                                    isEditingPassword
                                        ? 'fas fa-times'
                                        : 'fas fa-key'
                                }
                            ></i>
                            {isEditingPassword ? 'Cancel' : 'Change Password'}
                        </button>
                    </div>

                    {isEditingPassword && (
                        <form
                            onSubmit={(e) =>
                                void passwordForm.handleSubmit(
                                    onSubmitPassword
                                )(e)
                            }
                            className="form"
                        >
                            <div className="form-group">
                                <label>Current Password</label>
                                <input
                                    type="password"
                                    {...passwordForm.register(
                                        'currentPassword'
                                    )}
                                    className="input"
                                />
                                {passwordForm.formState.errors
                                    .currentPassword && (
                                    <span className="error">
                                        {
                                            passwordForm.formState.errors
                                                .currentPassword.message
                                        }
                                    </span>
                                )}
                            </div>

                            <div className="form-group">
                                <label>New Password</label>
                                <input
                                    type="password"
                                    {...passwordForm.register('newPassword')}
                                    className="input"
                                />
                                {passwordForm.formState.errors.newPassword && (
                                    <span className="error">
                                        {
                                            passwordForm.formState.errors
                                                .newPassword.message
                                        }
                                    </span>
                                )}
                            </div>

                            <div className="form-group">
                                <label>Confirm New Password</label>
                                <input
                                    type="password"
                                    {...passwordForm.register(
                                        'confirmPassword'
                                    )}
                                    className="input"
                                />
                                {passwordForm.formState.errors
                                    .confirmPassword && (
                                    <span className="error">
                                        {
                                            passwordForm.formState.errors
                                                .confirmPassword.message
                                        }
                                    </span>
                                )}
                            </div>

                            <div className="form-actions">
                                <button type="submit" className="save-button">
                                    Update Password
                                </button>
                            </div>
                        </form>
                    )}
                </div>
                <div className="section addresses-field">
                    <div className="section-header">
                        <h2>Addresses</h2>
                        <button
                            onClick={() => setShowAddAddress(true)}
                            className="add-button"
                        >
                            <i className="fas fa-plus"></i>
                            Add Address
                        </button>
                    </div>
                    <div className="addresses-list">
                        {userProfile?.addresses.map((address) => (
                            <div key={address.id} className="address-card">
                                <div className="address-info">
                                    {(address.id ===
                                        userProfile.defaultShippingAddressId ||
                                        address.id ===
                                            userProfile.defaultBillingAddressId) && (
                                        <span className="default-badge">
                                            {address.id ===
                                            userProfile.defaultShippingAddressId
                                                ? address.id ===
                                                  userProfile.defaultBillingAddressId
                                                    ? 'Default Shipping and Billing'
                                                    : 'Default Shipping'
                                                : 'Default Billing'}
                                        </span>
                                    )}
                                    <h3>
                                        {address.firstName} {address.lastName}
                                    </h3>
                                    <p>{address.streetName}</p>
                                    <p>
                                        {address.city}, {address.postalCode}
                                    </p>
                                    <p>{address.country}</p>
                                </div>
                                <div className="address-actions">
                                    <button
                                        onClick={() =>
                                            handleEditAddress(address)
                                        }
                                        className="action-button"
                                    >
                                        <i className="fas fa-edit"></i>
                                    </button>
                                    {address.id !==
                                        userProfile.defaultShippingAddressId && (
                                        <button
                                            onClick={() =>
                                                handleSetDefaultAddress(
                                                    address.id!
                                                )
                                            }
                                            className="action-button"
                                            title="Set as default shipping"
                                        >
                                            <i className="fas fa-star"></i>
                                        </button>
                                    )}
                                    {address.id !==
                                        userProfile.defaultBillingAddressId && (
                                        <button
                                            onClick={() =>
                                                handleSetDefaultAddressBilling(
                                                    address.id!
                                                )
                                            }
                                            className="action-button"
                                            title="Set as default billing"
                                        >
                                            <i className="fas fa-star"></i>
                                        </button>
                                    )}
                                    <button
                                        onClick={() =>
                                            handleDeleteAddress(address.id!)
                                        }
                                        className="action-button"
                                    >
                                        <i className="fas fa-trash"></i>
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    {(showAddAddress || editingAddress) && (
                        <div className="addressForm">
                            <h3>
                                {editingAddress
                                    ? 'Edit Address'
                                    : 'Add New Address'}
                            </h3>
                            <form
                                onSubmit={(e) =>
                                    void addressForm.handleSubmit(
                                        onSubmitAddress
                                    )(e)
                                }
                                className="form"
                            >
                                <div className="form-row">
                                    <div className="form-group">
                                        <label>First Name</label>
                                        <input
                                            {...addressForm.register(
                                                'firstName'
                                            )}
                                            className="input"
                                        />
                                        {addressForm.formState.errors
                                            .firstName && (
                                            <span className="error">
                                                {
                                                    addressForm.formState.errors
                                                        .firstName.message
                                                }
                                            </span>
                                        )}
                                    </div>
                                    <div className="form-group">
                                        <label>Last Name</label>
                                        <input
                                            {...addressForm.register(
                                                'lastName'
                                            )}
                                            className="input"
                                        />
                                        {addressForm.formState.errors
                                            .lastName && (
                                            <span className="error">
                                                {
                                                    addressForm.formState.errors
                                                        .lastName.message
                                                }
                                            </span>
                                        )}
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label>Street Address</label>
                                    <input
                                        {...addressForm.register('streetName')}
                                        className="input"
                                    />
                                    {addressForm.formState.errors
                                        .streetName && (
                                        <span className="error">
                                            {
                                                addressForm.formState.errors
                                                    .streetName.message
                                            }
                                        </span>
                                    )}
                                </div>

                                <div className="form-row">
                                    <div className="form-group">
                                        <label>City</label>
                                        <input
                                            {...addressForm.register('city')}
                                            className="input"
                                        />
                                        {addressForm.formState.errors.city && (
                                            <span className="error">
                                                {
                                                    addressForm.formState.errors
                                                        .city.message
                                                }
                                            </span>
                                        )}
                                    </div>
                                    <div className="form-group">
                                        <label>Postal Code</label>
                                        <input
                                            {...addressForm.register(
                                                'postalCode'
                                            )}
                                            className="input"
                                        />
                                        {addressForm.formState.errors
                                            .postalCode && (
                                            <span className="error">
                                                {
                                                    addressForm.formState.errors
                                                        .postalCode.message
                                                }
                                            </span>
                                        )}
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label>Country</label>
                                    <input
                                        {...addressForm.register('country')}
                                        className="input"
                                    />
                                    {addressForm.formState.errors.country && (
                                        <span className="error">
                                            {
                                                addressForm.formState.errors
                                                    .country.message
                                            }
                                        </span>
                                    )}
                                </div>

                                <div className="form-actions">
                                    <button
                                        type="submit"
                                        className="save-button"
                                    >
                                        {editingAddress
                                            ? 'Update Address'
                                            : 'Add Address'}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setShowAddAddress(false);
                                            setEditingAddress(null);
                                            addressForm.reset();
                                        }}
                                        className="cancel-button"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
