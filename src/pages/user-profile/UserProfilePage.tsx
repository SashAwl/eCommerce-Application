import './UserProfilePage.scss';
import { useEffect, useState } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
// import { Address } from '@commercetools/platform-sdk';
import { useGameStore } from '../../store/store';

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

type ProfileFormData = z.infer<typeof profileSchema>;

export function UserProfilePage() {
    const gameStore = useGameStore();
    const [isEditing, setIsEditing] = useState(false);

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

    return (
        <div className="user-profile-page">
            <div className="container">
                <h1 className="title">My Profile</h1>
                <div className="section personal-info-field">
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
                                <button type="submit" className="saveButton">
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
                            <div className="info-ttem">
                                <label>Last Name:</label>
                                <span>{userProfile?.lastName}</span>
                            </div>
                            <div className="info-ttem">
                                <label>Email:</label>
                                <span>{userProfile?.email}</span>
                            </div>
                            <div className="info-ttem">
                                <label>Date of Birth:</label>
                                <span>
                                    {new Date(
                                        userProfile.dateOfBirth
                                    ).toLocaleDateString()}
                                </span>
                            </div>
                        </div>
                    )}
                </div>
                <div className="section password-field">
                    <h2>Password</h2>
                </div>
                <div className="section addresses-field">
                    <h2>Addresses</h2>
                </div>
            </div>
        </div>
    );
}
