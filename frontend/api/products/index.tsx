import { AxiosResponse } from "axios";

import { api } from "../api";
import { IProduct } from "../../interfaces/IProduct";

// const path = "/auth/login";
const path = "/products"

export const getAllProducts = async (skip: number, filter: string) => {
  try {
    const response: AxiosResponse<IProduct[]> = await api.get(path, {
      params: {
        skip,
        limit: 15,
        q: filter,
      },
    })
    return response.data
  } catch (error) {
    return error
  }
}