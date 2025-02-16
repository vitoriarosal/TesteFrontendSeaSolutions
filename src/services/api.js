import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3001",
});

export const buscarUsuarioPorCPF = async (cpf) => {
  const response = await api.get(`/users?cpf=${cpf}`);
  return response.data.length > 0 ? response.data[0] : null;
};

export const criarUsuario = async (novoUsuario) => {
  const response = await api.post("/users", novoUsuario);
  return response.data;
};

export const buscarTransacoes = async () => {
  const response = await api.get("/transactions?_limit=10");
  return response.data;
};

export default api;


