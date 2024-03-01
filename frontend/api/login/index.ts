import { AxiosResponse } from "axios";

import { api } from "../api";
import { ILogin } from "../../interfaces/ILogin";
import { IUser } from "../../interfaces/IUser";

// const path = "/auth/login";
const path = "/login"

export const login = async (body: ILogin) => {
  try {
    const response: AxiosResponse<IUser> = await api.post(path, body)
    return response.data
  } catch (error) {
    return error
  }
}