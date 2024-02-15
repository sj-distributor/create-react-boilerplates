import axios, { AxiosInstance } from "axios";

import * as types from "../types/api.types";

export const api: AxiosInstance = axios.create({
  baseURL: "https://jsonplaceholder.typicode.com/",
});

api.interceptors.response.use((response) => response.data);

export const getUserApi = async (
  userId: number,
): Promise<types.GetUserResult> => {
  const response: any = await api.get(`users/${userId}`);

  return {
    id: response.id,
    name: response.name,
    username: response.username,
  };
};
