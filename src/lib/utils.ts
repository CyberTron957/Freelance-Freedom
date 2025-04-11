import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(timestamp: number) {
  return new Date(timestamp).toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function shortenAddress(address: string) {
  if (!address || address === "0x000...000") return address;
  return address.length > 10
    ? `${address.substring(0, 6)}...${address.substring(address.length - 4)}`
    : address;
} 