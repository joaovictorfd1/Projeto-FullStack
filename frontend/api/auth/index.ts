import { AxiosResponse } from "axios";
import { api } from "../api";

const path = "/auth/me"

export const authMe = async (token: string) => {
  try {
    const response: AxiosResponse<string> = await api.post(path, {
      headers: {
        Authorization: `Bearer ${token}`,
      }
    })
    return response.data
  } catch (error) {
    return error
  }
}