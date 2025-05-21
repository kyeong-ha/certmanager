// 타입 선언 (Global Constants for Webpack DefinePlugin)
declare const __BACKEND_URL__: string;

// 실제 코드 (Webpack이 빌드 시 치환)
export const BACKEND_URL = __BACKEND_URL__;