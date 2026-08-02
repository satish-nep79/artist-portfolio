import { artworks } from "@/core/data/dummy_data/artworks_list";
import type { Artwork } from "@/core/types/artwork";

const API_DELAY = 500;

const delay = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms));

export const ArtworkApi = {
    async getAll(): Promise<Artwork[]> {
        await delay(API_DELAY);
        return artworks;
    },

    async getFeatured(): Promise<Artwork[]> {
        await delay(API_DELAY);
        return artworks.filter((artwork) => artwork.isFeatured);
    },

    async getLatest(limit = 10): Promise<Artwork[]> {
        await delay(API_DELAY);

        return [...artworks]
            .sort((a, b) => b.id - a.id)
            .slice(0, limit);
    },

    async getById(id: number): Promise<Artwork | undefined> {
        await delay(API_DELAY);
        return artworks.find((artwork) => artwork.id === id);
    },

    async getBySlug(slug: string): Promise<Artwork | undefined> {
        await delay(API_DELAY);
        return artworks.find((artwork) => artwork.slug === slug);
    },

    async getByCategory(category: string): Promise<Artwork[]> {
        await delay(API_DELAY);

        return artworks.filter(
            (artwork) =>
                artwork.category.toLowerCase() === category.toLowerCase()
        );
    },
};