import { AxiosResponse } from "axios";

import { api } from "../api";
import { ICourse } from "../../interfaces/ICourse";
import { IFilter } from "../../interfaces/IFilter";

// const path = "/auth/login";
const path = "/courses"

export const getAllCourses = async (skip: number, filter: IFilter) => {
  try {
    const response: AxiosResponse<ICourse[]> = await api.get(path, {
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

export const getCourseById = async (id: number) => {
  try {
    const response: AxiosResponse<ICourse> = await api.get(`${path}/${id}`)
    return response.data
  } catch (error) {
    return error
  }
}

export const createCourse = async (body: ICourse) => {
  try {
    const response: AxiosResponse<ICourse> = await api.post(path, {
      ...body,
      category: body.category.map(item => item.value)
    })
    return response.data
  } catch (error) {
    return error
  }
}

export const editCourse = async (body: ICourse) => {
  try {
    const response: AxiosResponse<ICourse> = await api.put(`${path}/${body.id}`, {
      ...body,
      category: body.category.map(item => item.value)
    })
    return response.data
  } catch (error) {
    return error
  }
}

export const deleteCourse = async (id: number) => {
  try {
    const response: AxiosResponse<ICourse> = await api.delete(`${path}/${id}`)
    return response.data
  } catch (error) {
    return error
  }
}