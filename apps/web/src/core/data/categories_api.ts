import { categories } from "@/core/data/dummy_data/categories";
import type { Category } from "@/core/types/category_type";

const API_DELAY = 500;

const delay = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms));

export const CategoryApi = {
    async getAll(): Promise<Category[]> {
        await delay(API_DELAY);
        return categories;
    },
};