import { clearToken } from "./token.js";

export const handleLogout = (navigate) => {
   
    clearToken();
   navigate('/auth');
}