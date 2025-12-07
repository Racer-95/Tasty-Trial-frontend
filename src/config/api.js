// API Configuration
export const API_BASE_URL = "https://tasty-trail-backend.onrender.com";

// API Endpoints
export const API_ENDPOINTS = {
  // Auth endpoints
  SIGNUP: `${API_BASE_URL}/signup`,
  LOGIN: `${API_BASE_URL}/login`,
  
  // Recipe endpoints
  RECIPES: `${API_BASE_URL}/recipes`,
  RECIPE_BY_ID: (id) => `${API_BASE_URL}/recipes/${id}`,
  
  // User endpoints
  USERS: `${API_BASE_URL}/users`,
  USER_BY_ID: (id) => `${API_BASE_URL}/users/${id}`,
};

