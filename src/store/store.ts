import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Category, ProductProjection } from '@commercetools/platform-sdk';

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

interface CategoryState {
    categories: Category[];
    loading: boolean;
    error: string | null;
    setCategories: (categorList: Category[]) => void;
    setLoadingStatus: (loadingStatus: boolean) => void;
    setError: (errorMessage: string) => void;
}

interface ProductsState {
    products: ProductProjection[];
    loading: boolean;
    error: string | null;
    setProducts: (productsList: ProductProjection[]) => void;
    setLoadingStatus: (loadingStatus: boolean) => void;
    setError: (errorMessage: string) => void;
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

export const useCategoryStore = create<CategoryState>((set) => ({
    categories: [],
    loading: false,
    error: null,
    setCategories: (categoryList) => set({ categories: categoryList }),
    setLoadingStatus: (loadingStatus) => set({ loading: loadingStatus }),
    setError: (errorMessage) => set({ error: errorMessage }),
}));

export const useProductsStore = create<ProductsState>((set) => ({
    products: [],
    loading: false,
    error: null,
    setProducts: (productsList) => set({ products: productsList }),
    setLoadingStatus: (loadingStatus) => set({ loading: loadingStatus }),
    setError: (errorMessage) => set({ error: errorMessage }),
}));
