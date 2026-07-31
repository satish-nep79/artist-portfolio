export interface Artwork {
    id: number;
    title: string;
    category: string;
    medium: string;
    year: number;
    imageUrl: string;
    width: number;
    height: number;
    measurementUnit: string;
    description?: string;
    price?: number;
    currency?: string;
    isFeatured?: boolean;
    status: "available" | "sold" | "not for sale";

}