
const VITE_ENV: string = import.meta.env.VITE_ENV;
const VITE_DEV_API_URL: string = import.meta.env.VITE_DEV_API_URL;
const VITE_PROD_API_URL: string = import.meta.env.VITE_PROD_API_URL

export const API_URL = VITE_ENV === 'development' ? `${VITE_DEV_API_URL}` : `${VITE_PROD_API_URL}`;