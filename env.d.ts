interface ImportMetaEnv {
    readonly VITE_CT_CLIENT_ID_PUBLIC: string;
    readonly VITE_CT_CLIENT_SECRET_PUBLIC: string;
    readonly VITE_CT_SCOPES_PUBLIC: string;
    readonly VITE_CT_CLIENT_ID_ADMIN: string;
    readonly VITE_CT_CLIENT_SECRET_ADMIN: string;
    readonly VITE_CT_SCOPES_ADMIN: string;
    readonly VITE_CT_PROJECT_KEY: string;
    readonly VITE_CT_AUTH_URL: string;
    readonly VITE_CT_API_URL: string;
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}
