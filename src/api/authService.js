import apiClient from './axiosInstance';

export const loginUser = async (credentials) => {
  try {
    const response = await apiClient.post('/auth/login', credentials);
    // Armazenar token e dados do usuário (no localStorage, context, etc.)
    if (response.data.token) {
        localStorage.setItem('authToken', response.data.token);
        localStorage.setItem('userData', JSON.stringify(response.data.user)); // Supondo que o user venha
    }
    return response.data;
  } catch (error) {
    console.error("Erro no login:", error.response?.data || error.message);
    throw error.response?.data || new Error("Erro ao fazer login");
  }
};

export const registerUser = async (userData) => {
  try {
    const response = await apiClient.post('/auth/registrar', userData);
    return response.data;
  } catch (error) {
    console.error("Erro no registro:", error.response?.data || error.message);
    throw error.response?.data || new Error("Erro ao registrar");
  }
};

export const logoutUser = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userData');
    // Opcional: chamar endpoint /auth/logout se houver invalidação de token no backend
};

export const getAuthenticatedUser = async () => {
    try {
        const response = await apiClient.get('/usuarios/me');
        return response.data;
    } catch (error) {
        console.error("Erro ao buscar usuário autenticado:", error.response?.data || error.message);
        throw error.response?.data || new Error("Erro ao buscar dados do usuário");
    }
}