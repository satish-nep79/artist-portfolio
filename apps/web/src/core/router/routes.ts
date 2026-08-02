export const ROUTES = {
    HOME: () => "/",
    HERO: () => "/#hero",
    GALLERY: () => "/#gallery",
    ABOUT: () => "/#about",
    PROGRAMS: () => "/#programs",
    WORK_WITH_ME: () => "/#work-with-me",
    CONTACT: () => "/#contact",
    GALLERYPage: () => "/gallery",
    PROGRAMSPage: () => "/programs",
    PURCHASE_INQUIRY: (artId: string = ":artId") => `/purchase-inquiry/${artId}`,
    CUSTOM_ARTWORK_INQUIRY: (artId: string = ":artId") => `/custom-artwork-inquiry/${artId}`,
    NOT_FOUND: () => "*",
} as const;

// Optional: Type helper if you ever need route types
export type AppRoute = (typeof ROUTES)[keyof typeof ROUTES];