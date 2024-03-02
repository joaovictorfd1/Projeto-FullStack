interface Option {
  value: string;
  label: string;
}

export interface ICourse {
  id?: number
  title: string
  description: string
  price: number
  discountPercentage: number
  rating: number
  stock: number
  brand: string
  category: Option[]
  thumbnail?: string
  images: string[]
}