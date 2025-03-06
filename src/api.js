import axios from "axios";

const API_URL = "http://127.0.0.1:8000/api";

export const getUsers = async () => {
  try {
    const response = await axios.get(`${API_URL}/users`);
    return response.data || [];
  } catch (error) {
    console.error("Error fetching users:", error);
    return [];
  }
};

export const addUser = async (user) => {
  try {
    const response = await axios.post(`${API_URL}/users`, user, {
      headers: { "Content-Type": "application/json" },
    });
    return response.data;
  } catch (error) {
    console.error("Error adding user:", error);
    return null;
  }
};

export const deleteUser = async (id) => {
  try {
    await axios.delete(`${API_URL}/users/${id}`);
    return true;
  } catch (error) {
    console.error("Error deleting user:", error);
    return false;
  }
};

export const updateUser = async (id, user) => {
  try {
    const response = await axios.put(`${API_URL}/${id}`, user);
    return response.data;
  } catch (error) {
    console.error("Error updating user:", error);
    return null;
  }
};
