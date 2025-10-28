import { JSX } from "react";

export default async function Await<T>({
  promise,
  children,
}: {
  promise: Promise<T> | any;
  children: (value: T) => JSX.Element;
}) {
  let books = await promise;

  return children(books);
}
