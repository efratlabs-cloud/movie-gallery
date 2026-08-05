// frontend/src/api/auth.js
import { getToken } from "../lib/token.js";

// Base URL for the backend API
const BASE_URL = "http://localhost:5000/api/users";

// Helper function to handle server responses
const handlerServer = async (res) => {
   
    const data = await res.json();
    if (!res.ok) {
        throw new Error(data.message || data.error || "Something went wrong");
    }
    return data;
};

// Function to register a new user
export const register = async (body) => {
    const response = await fetch(`${BASE_URL}/register`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
    });
    return handlerServer(response);
};

// Function to log in a user
export const login = async (body) => {
    const response = await fetch(`${BASE_URL}/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
    });
    return handlerServer(response);
};

// Function to log in a user using Google OAuth
export const googleLogin = async (credential) => {
    const response = await fetch(`${BASE_URL}/google-login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ credential }),
    });
    return handlerServer(response);
};

// Function to get the currently logged-in user's information
export const getMe = async () => {
    
    const response = await fetch(`${BASE_URL}/me`, {
        method: "GET",
        headers: {      
            Authorization: `Bearer ${getToken()}`,
        },

    });
    
    return handlerServer(response);
};

