import { AxiosResponse } from "axios";

import { api } from "../api";
import { IRegister } from "../../interfaces/IRegister";
import { IUser } from "../../interfaces/IUser";

const path = "/users/add";

export const login = async (body: IRegister) => {
  try {
    const response: AxiosResponse<IUser> = await api.post(path, body)
    return response.data
  } catch (error) {
    return error
  }
}