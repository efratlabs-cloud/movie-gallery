import { getToken } from "../lib/token";

// Base URL for the backend API
const BASE_URL = "http://localhost:5000/api/movies";

// Helper function to handle server responses
const authGet = async (url) => {
  const response = await fetch(url, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || data.error || "Something went wrong");
  }
  return data;
};

// Function to get all movies or a specific movie by IDs
export const getMovies = (value) => {
  if (!value) {
    return authGet(BASE_URL);
  }
  return authGet(`${BASE_URL}?search=${value}`);
};

export const getMovie = (id) => authGet(`${BASE_URL}/${id}`);

// Function to create a new movie
export const createMovie = async (body) => {
  const response = await fetch(BASE_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify(body),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || data.error || "Something went wrong");
  }
  return data;
};

export const deleteMovie = async (id) => {
  const response = await fetch(`${BASE_URL}/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || data.error || "Something went wrong");
  }
  return data;
};
