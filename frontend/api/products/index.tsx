import { AxiosResponse } from "axios";

import { api } from "../api";
import { IProduct } from "../../interfaces/IProduct";
import { IFilter } from "../../interfaces/IFilter";

// const path = "/auth/login";
const path = "/products"

export const getAllProducts = async (skip: number, filter: IFilter) => {
  try {
    const response: AxiosResponse<IProduct[]> = await api.get(path, {
      params: {
        skip,
        limit: 15,
        q: filter.search,
        sort: filter.sort
      },
    })
    return response.data
  } catch (error) {
    return error
  }
}