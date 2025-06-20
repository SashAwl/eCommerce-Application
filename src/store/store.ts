import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
    Category,
    ProductProjection,
    Customer,
} from '@commercetools/platform-sdk';

interface IGameStore {
    isLogin: boolean;
    customerId: string;
    token: string;
    userName: string;

    customer: Customer | null;
    setCustomer: (change: (customer: Customer | null) => Customer) => void;

    login: (customer?: Customer) => void;
    logout: () => void;
    successMessage: string;
    setSuccessMessage: (message: string) => void;
    clearSuccessMessage: () => void;
    errorMessage: string;
    setErrorMessage: (message: string) => void;
    isDeletePopupVisible: boolean;
    changeDeletePopupVisible: (status: boolean) => void;
    clearErrorMessage: () => void;
    isOneAddress: boolean;
    changeAddressStatus: () => void;
    cartId: string | null;
    setCardId: (id: string | null) => void;
    cartVersion: number | null;
    setCardVersion: (id: number | null) => void;
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
            userName: '',

            customer: null,
            cartId: null,
            cartVersion: null,
            setCustomer: (change) =>
                set((store) => ({
                    customer: change(store.customer),
                })),

            login: (customer) => set(() => ({ isLogin: true, customer })),
            logout: () =>
                set(() => ({
                    isLogin: false,
                    customerId: '',
                    token: '',
                    userName: '',

                    customer: null,
                    cartId: null,
                    cartVersion: null,
                })),

            successMessage: '',
            setSuccessMessage: (message) => set({ successMessage: message }),
            clearSuccessMessage: () => set(() => ({ successMessage: '' })),

            errorMessage: '',
            setErrorMessage: (message) => set({ errorMessage: message }),
            clearErrorMessage: () => set(() => ({ errorMessage: '' })),
            setCardId: (id) => set({ cartId: id }),
            setCardVersion: (id) => set({ cartVersion: id }),
            changeAddressStatus: () =>
                set((state) => ({ isOneAddress: !state.isOneAddress })),
            isDeletePopupVisible: false,
            changeDeletePopupVisible: (status) =>
                set({ isDeletePopupVisible: status }),

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

export const useProductsForSliderStore = create<ProductsState>((set) => ({
    products: [],
    loading: false,
    error: null,
    setProducts: (productsList) => set({ products: productsList }),
    setLoadingStatus: (loadingStatus) => set({ loading: loadingStatus }),
    setError: (errorMessage) => set({ error: errorMessage }),
}));
