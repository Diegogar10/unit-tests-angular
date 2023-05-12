import { Category } from "./category.models";

export interface Product {
  id: string;
  price: number;
  title: string;
  images: string[];
  description: string;
  category: Category;
  taxes?:number;
}

export interface Cart {
  id: string;
  qty: number,
  product: Product
}

export interface CreateProductDTO extends Omit<Product, 'id' | 'category'> {
  categoryId: number;
}

export interface UpdateProductDTO extends Partial<CreateProductDTO> {}

export interface ProductItem extends Omit<Product, 'category' | 'description' | 'images'>{
  qty: number;
  image:string;
}
