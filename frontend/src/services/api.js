import axios from "axios";

const API_URL = "https://academic-wellness-performance-platform-3.onrender.com/api/auth";

// Login
export const loginUser = async (data) => {
  const response = await axios.post(`${API_URL}/login`, data);
  return response.data;
};

// Register
export const registerUser = async (data) => {
  const response = await axios.post(`${API_URL}/register`, data);
  return response.data;
};

// Get Wellness
// ===============================
// WELLNESS APIs
// ===============================

const WELLNESS_URL = "https://academic-wellness-performance-platform-3.onrender.com/api/wellness";

// GET ALL
export const getWellnessItems = async (token) => {
  const response = await axios.get(WELLNESS_URL, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

// CREATE
export const createWellnessItem = async (data, token) => {
  const response = await axios.post(WELLNESS_URL, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

// DELETE
export const deleteWellnessItem = async (id, token) => {
  const response = await axios.delete(`${WELLNESS_URL}/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const getWellnessSummary = async (token) => {
  const res = await fetch("https://academic-wellness-performance-platform-3.onrender.com/api/wellness/summary", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.json();
};