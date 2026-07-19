import type { ProgramModel } from "@/features/program_section/types/program_model";

export const ProgramData: ProgramModel[] = [
    {
        id: "1",
        link: "https://www.example.com/botanical-watercolour-workshop",
        tag: "WORKSHOP",
        title: "Botanical Watercolour Workshop",
        startDate: new Date("2026-08-18"),
        endDate: new Date("2026-08-20"),
        startTime: new Date("2026-08-18T10:00:00"),
        endTime: new Date("2026-08-20T16:00:00"),
        location: "Pokhara, Nepal",
        description: "Spend three inspiring days exploring botanical illustration through watercolor techniques, guided by observation, creativity, and the beauty of nature.",
        buttonText: "Reserve Your Spot",
        imageUrl: "https://res.cloudinary.com/ioltw4a4/image/upload/v1784217073/art-institute-of-chicago-w9njMDJJ3c4-unsplash_pjok5g.jpg"
    },
    {
        id: "2",
        tag: "EXHIBITION",
        title: "Echoes of the Himalayas",
        startDate: new Date("2026-09-12"),
        endDate: new Date("2026-10-05"),
        startTime: new Date("2026-09-12T10:00:00"),
        endTime: new Date("2026-10-05T18:00:00"),
        location: "Pokhara Art Gallery",
        description: "A solo exhibition featuring landscapes and contemporary paintings inspired by Nepal's mountains, culture, and quiet moments of everyday life.",
        buttonText: "View Exhibition",
        imageUrl: "https://res.cloudinary.com/ioltw4a4/image/upload/v1784217066/raimond-klavins-L6jxljMeUoo-unsplash_kundbn.jpg"
    },
    {
        id: "3",
        tag: "COMMUNITY",
        title: "Creative Weekend for Young Artists",
        startDate: new Date("2026-10-24"),
        endDate: new Date("2026-10-25"),
        startTime: new Date("2026-10-24T10:00:00"),
        endTime: new Date("2026-10-25T18:00:00"),
        location: "Lakeside, Pokhara",
        description: "A weekend of hands-on painting, storytelling, and collaborative art activities designed to encourage creativity in children and young artists.",
        buttonText: "Join the Program",
        imageUrl: "https://res.cloudinary.com/ioltw4a4/image/upload/v1784217056/clayton-cardinalli-lGVqqwogRJY-unsplash_kuh65l.jpg"
    },
    {
        id: "4",
        link: "https://www.example.com/art-by-the-lake-live-painting",
        tag: "LIVE PAINTING",
        title: "Art by the Lake",
        startDate: new Date("2026-11-14"),
        endDate: new Date("2026-11-14"),
        startTime: new Date("2026-11-14T10:00:00"),
        endTime: new Date("2026-11-14T18:00:00"),
        location: "Phewa Lakeside, Pokhara",
        description: "Experience a live painting session inspired by the changing colors of Phewa Lake, where visitors can watch the creative process unfold and engage with the artist throughout the day.",
        buttonText: "Learn More",
        imageUrl: "https://res.cloudinary.com/ioltw4a4/image/upload/v1784217058/sasha-matveeva-WLeoQKCFQUw-unsplash_yyviri.jpg"
    }
]