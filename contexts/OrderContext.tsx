"use client";
import { Book } from "@/types/types";
import React, { createContext, useContext, useState, useEffect } from "react";

export interface OrderItem {
  book: Book;
  quantity: number;
}

export interface Order {
  id: string;
  items: OrderItem[];
  total: number;
  date: string;
  status: "pending" | "processing" | "completed" | "cancelled";
}

interface OrderContextType {
  orders: Order[];
  addOrder: (items: OrderItem[], total: number) => void;
  getOrderById: (id: string) => Order | undefined;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export const useOrders = () => {
  const context = useContext(OrderContext);
  if (!context) {
    throw new Error("useOrders must be used within an OrderProvider");
  }
  return context;
};

export const OrderProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [orders, setOrders] = useState<Order[]>([]);

  // Carregar pedidos do localStorage
  useEffect(() => {
    const savedOrders = localStorage.getItem("orders");
    if (savedOrders) {
      setOrders(JSON.parse(savedOrders));
    }
  }, []);

  // Salvar pedidos no localStorage
  useEffect(() => {
    localStorage.setItem("orders", JSON.stringify(orders));
  }, [orders]);

  const addOrder = (items: OrderItem[], total: number) => {
    const newOrder: Order = {
      id: Date.now().toString(),
      items,
      total,
      date: new Date().toISOString(),
      status: "pending",
    };

    setOrders((prev) => [newOrder, ...prev]);
  };

  const getOrderById = (id: string) => {
    return orders.find((order) => order.id === id);
  };

  return (
    <OrderContext.Provider value={{ orders, addOrder, getOrderById }}>
      {children}
    </OrderContext.Provider>
  );
};
