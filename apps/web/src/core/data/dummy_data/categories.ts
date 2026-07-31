import type { Category } from "@/core/types/category_type";

export const categories: Category[] = [
    { id: "classical-historic", title: "Classical & Historic" },
    { id: "landscape", title: "Landscape" },
    { id: "figurative-landscape", title: "Figurative Landscape" },
    { id: "abstract", title: "Abstract" },
    { id: "urban-street-art", title: "Urban & Street Art" },
    { id: "portrait", title: "Portrait" },
    { id: "illustration-fine-art", title: "Illustration & Fine Art" },
    { id: "drawing-sketch", title: "Drawing & Sketch" },
    { id: "abstract-expressionism", title: "Abstract Expressionism" },
    { id: "pop-street-art", title: "Pop & Street Art" },
    { id: "digital-abstract", title: "Digital & Abstract" },
    { id: "digital-modern", title: "Digital & Modern" },
    { id: "digital-anime", title: "Digital Art & Anime" },
] as const;