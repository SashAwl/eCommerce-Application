import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface IGameStore {
    isLogin: boolean;
    customerId: string;
    token: string;
    login: () => void;
    logout: () => void;

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
            changeAddressStatus: () =>
                set((state) => ({ isOneAddress: !state.isOneAddress })),

            isOneAddress: false,
        }),
        {
            name: 'game-storage',
        }
    )
);
