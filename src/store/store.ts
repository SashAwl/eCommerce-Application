import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface IGameStore {
    isLogin: boolean;
    customerId: string;
    token: string;
    changeStatus: () => void;
}

export const useGameStore = create<IGameStore>()(
    persist(
        (set) => ({
            isLogin: false,
            customerId: '',
            token: '',
            changeStatus: () => set((state) => ({ isLogin: !state.isLogin })),
        }),
        {
            name: 'game-storage',
        }
    )
);
