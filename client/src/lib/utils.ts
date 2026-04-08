import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getNarutoRank(level: number): string {
  if (level >= 30) return "Kage";
  if (level >= 20) return "Jonin";
  if (level >= 10) return "Chunin";
  return "Genin";
}
