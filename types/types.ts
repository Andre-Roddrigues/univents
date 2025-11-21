export interface CartItem {
  id: string;
  eventId: string;
  eventTitle: string;
  ticketName: string;
  ticketType: string;
  price: number;
  quantity: number;
  availableQuantity: number;
  benefits: Array<{
    id: string;
    name: string;
    description: string;
    icon?: string | null;
  }>; // ou defina uma interface específica para livros
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


export interface ShippingOption {
  id: string;
  name: string;
  price: number;
  label?: string;
}
export interface UserSession {
  email?: string;
  telephone?: number;
  name?: string;
  lastName: string;
  role: string;
}
