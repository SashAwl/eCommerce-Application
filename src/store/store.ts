import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface IGameStore {
    isLogin: boolean;
    customerId: string;
    token: string;
    login: () => void;
    logout: () => void;
    successMessage: string;
    setSuccessMessage: (message: string) => void;
    clearSuccessMessage: () => void;
    errorMessage: string;
    setErrorMessage: (message: string) => void;
    clearErrorMessage: () => void;
    isOneAddress: boolean;
    changeAddressStatus: () => void;
}

export const useGameStore = create<IGameStore>()(
    persist(
        (set) => ({
            isLogin: false,
            customerId: '',
            token: '',
            login: () => set(() => ({ isLogin: true })),
            logout: () => set(() => ({ isLogin: false })),

            successMessage: '',
            setSuccessMessage: (message) => set({ successMessage: message }),
            clearSuccessMessage: () => set(() => ({ successMessage: '' })),

            errorMessage: '',
            setErrorMessage: (message) => set({ errorMessage: message }),
            clearErrorMessage: () => set(() => ({ errorMessage: '' })),

            changeAddressStatus: () =>
                set((state) => ({ isOneAddress: !state.isOneAddress })),

            isOneAddress: false,
        }),
        {
            name: 'game-storage',
        }
    )
);
