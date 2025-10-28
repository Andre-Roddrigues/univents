export interface Ebook {
  id?: string;
  title: string;
  authors: string[];
  coverImage: string;
  categories: string[];
  price: number;
  rating: number;
  description?: string;
  pages?: number;
}
export interface searchParamsProps {
  searchParams: { [key: string]: string | string[] | undefined };
}
export interface paramsProps {
  params: {
    id: string;
  };
}

export interface Category {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}
export interface Cover {
  url: string;
  id: string;
  fileName: string;
  originalName: string;
  ebookId: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}
export type DeliveryFee = {
  id: string;
  province: string;
  price: string;
};

export interface Book {
  id: string;
  title: string;
  author: string[];
  cover: Cover;
  quantity?: number;
  description: string;
  price: number;
  priceAfterDiscount: number;
  discountPercentage: number;
  rating: number;
  categories: Category[];
  totalReviews?: number;
  format?: string;
  pages?: number;
  publishDate: string;
  publisher?: {
    id?: string;
    name?: string;
    email?: string;
    phone?: string;
  };
  library?: {
    id: string;
    name: string;
    email: string;
    phone: string;
  };
}

export interface CartItem {
  book: Book;
  quantity: number;
}

export interface ShippingOption {
  id: string;
  name: string;
  price: number;
  label?: string;
}
export interface UserSession {
  accessToken: string;
  iss?: string;
  aud?: string;
  sub?: number;
  email?: string;
  telephone?: number;
  statusAccount?: boolean;
  name?: string;
  lastname?: string;
  id?: number;
  exp?: string;
}
