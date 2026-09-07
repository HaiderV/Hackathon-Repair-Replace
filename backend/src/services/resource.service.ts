import axios from "axios";

export interface ResourceItem {
    title: string;
    url: string;
    description: string;
    source: string;
    thumbnail?: string | undefined;
}

export interface ReplacementOptions {
    donate: ResourceItem[];
    refurbish: ResourceItem[];
    recycle: ResourceItem[];
}

export interface ResourceResult {
    repairGuides: ResourceItem[];
    videos: ResourceItem[];
    replacementOptions: ReplacementOptions;
}

interface YouTubeSearchResponse {
    items: {
        id: {
            videoId?: string;
        };
        snippet: {
            title: string;
            description: string;
            thumbnails?: {
                high?: { url: string };
                medium?: { url: string };
                default?: { url: string };
            };
        };
    }[];
}

interface IFixitSuggestResponse {
    results?: {
        dataType?: string;
        title?: string;
        url?: string;
        summary?: string;
        text?: string;
        image?: {
            thumbnail?: string;
            standard?: string;
        };
    }[];
}

const YOUTUBE_API_URL = "https://www.googleapis.com/youtube/v3/search";
const IFIXIT_API_URL = "https://www.ifixit.com/api/2.0/suggest";

/* ------------------------------------------------ */
/* Main Resource Fetcher                            */
/* ------------------------------------------------ */

export const getRepairResources = async (
    item: string,
    problem: string,
    component?: string | null
): Promise<ResourceResult> => {
    const [videos, repairGuides] = await Promise.all([
        searchYouTubeVideos(item, problem, component),
        searchIFixitRepairGuides(item, problem),
    ]);

    const replacementOptions = getReplacementResources(item);

    return {
        repairGuides,
        videos,
        replacementOptions,
    };
};

/* ------------------------------------------------ */
/* 1. YouTube Videos Search                         */
/* ------------------------------------------------ */

const searchYouTubeVideos = async (
    item: string,
    problem: string,
    component?: string | null
): Promise<ResourceItem[]> => {
    const apiKey = process.env.YOUTUBE_API_KEY;

    if (!apiKey) {
        console.warn("YOUTUBE_API_KEY is not configured");
        return [];
    }

    const query = [item, problem, component, "repair tutorial"]
        .filter(Boolean)
        .join(" ");

    try {
        const response = await axios.get<YouTubeSearchResponse>(
            YOUTUBE_API_URL,
            {
                params: {
                    part: "snippet",
                    q: query,
                    type: "video",
                    maxResults: 5,
                    order: "relevance",
                    regionCode: "IN",
                    relevanceLanguage: "en",
                    safeSearch: "strict",
                    key: apiKey,
                },
                timeout: 5000,
            }
        );

        return (response.data.items || [])
            .filter((entry): entry is typeof entry & { id: { videoId: string } } => Boolean(entry.id?.videoId))
            .map((entry) => {
                const thumbnail =
                    entry.snippet.thumbnails?.high?.url ||
                    entry.snippet.thumbnails?.medium?.url ||
                    entry.snippet.thumbnails?.default?.url;

                return {
                    title: entry.snippet.title,
                    url: `https://www.youtube.com/watch?v=${entry.id.videoId}`,
                    description: entry.snippet.description || "YouTube repair walkthrough video.",
                    source: "YouTube",
                    ...(thumbnail ? { thumbnail } : {}),
                };
            });
    } catch (error: any) {
        console.error(
            "YouTube search failed:",
            error.response?.data || error.message
        );
        return [];
    }
};

/* ------------------------------------------------ */
/* 2. iFixit Live Dynamic Guides Search             */
/* ------------------------------------------------ */

const searchIFixitRepairGuides = async (
    item: string,
    problem: string
): Promise<ResourceItem[]> => {
    const query = `${item} ${problem}`.trim();

    try {
        // 1st attempt: Search using item and problem
        const response = await axios.get<IFixitSuggestResponse>(
            `${IFIXIT_API_URL}/${encodeURIComponent(query)}`,
            {
                params: { do: "guides" },
                timeout: 5000,
            }
        );

        const results = response.data.results || [];
        const guideResults = results.filter(
            (guide) => guide.url && (!guide.dataType || guide.dataType.toLowerCase().includes("guide"))
        );

        if (guideResults.length > 0) {
            return guideResults.slice(0, 3).map((guide) => ({
                title: guide.title || `Repair guide for ${item}`,
                url: guide.url!,
                description: guide.summary || guide.text || `Step-by-step repair guide for ${item}.`,
                source: "iFixit",
                ...(guide.image?.thumbnail || guide.image?.standard
                    ? { thumbnail: guide.image.thumbnail || guide.image.standard }
                    : {}),
            }));
        }

        // 2nd attempt: Search using item only
        const fallbackResponse = await axios.get<IFixitSuggestResponse>(
            `${IFIXIT_API_URL}/${encodeURIComponent(item)}`,
            {
                params: { do: "guides" },
                timeout: 5000,
            }
        );

        const fallbackResults = fallbackResponse.data.results || [];
        const fallbackGuides = fallbackResults.filter(
            (guide) => guide.url && (!guide.dataType || guide.dataType.toLowerCase().includes("guide"))
        );

        if (fallbackGuides.length > 0) {
            return fallbackGuides.slice(0, 3).map((guide) => ({
                title: guide.title || `${item} Repair Guide`,
                url: guide.url!,
                description: guide.summary || guide.text || `iFixit repair guide for ${item}.`,
                source: "iFixit",
                ...(guide.image?.thumbnail || guide.image?.standard
                    ? { thumbnail: guide.image.thumbnail || guide.image.standard }
                    : {}),
            }));
        }
    } catch (error: any) {
        console.error("iFixit API search failed:", error.response?.data || error.message);
    }

    return [];
};

/* ------------------------------------------------ */
/* 3. Categorized Replacement & Disposal Resources  */
/* ------------------------------------------------ */

// Item category classifier
const categorizeItem = (item: string) => {
    const text = item.toLowerCase();

    const isElectronic = [
        "phone", "smartphone", "mobile", "laptop", "computer", "desktop", "monitor",
        "keyboard", "mouse", "tablet", "ipad", "headphone", "earphone", "earbuds",
        "charger", "adapter", "cable", "television", "tv", "camera", "printer",
        "router", "speaker", "console", "controller", "refrigerator", "fridge",
        "washing machine", "microwave", "air conditioner", "ac", "watch", "smartwatch",
        "battery", "power bank", "appliance", "circuit", "electronic"
    ].some((kw) => text.includes(kw));

    const isFurniture = [
        "chair", "table", "desk", "sofa", "couch", "bed", "cabinet", "shelf",
        "bookshelf", "wardrobe", "drawer", "stool", "bench", "wood", "wooden"
    ].some((kw) => text.includes(kw));

    const isClothing = [
        "shirt", "pant", "jeans", "jacket", "coat", "sweater", "dress", "zipper",
        "bag", "backpack", "shoe", "shoes", "boot", "boots", "belt", "fabric", "cloth"
    ].some((kw) => text.includes(kw));

    return { isElectronic, isFurniture, isClothing };
};

// Brand take-back directory for recycling
const MANUFACTURER_RECYCLING_PROGRAMS: Record<string, ResourceItem> = {
    apple: {
        title: "Apple India Trade In & Recycling",
        url: "https://www.apple.com/in/reuse-recycle/",
        description: "Official Apple take-back and recycling program for iPhone, Mac, iPad, and accessories.",
        source: "Apple",
    },
    samsung: {
        title: "Samsung India Care for Clean India (E-Waste)",
        url: "https://www.samsung.com/in/care-for-clean-india/",
        description: "Samsung India's official authorized e-waste collection and recycling portal.",
        source: "Samsung India",
    },
    dell: {
        title: "Dell Responsible Asset Recovery & Recycling",
        url: "https://www.dell.com/en-in/lp/recovery-recycling-consumer-solutions",
        description: "Dell's official consumer equipment recycling and drop-off solutions in India.",
        source: "Dell",
    },
    lenovo: {
        title: "Lenovo India Product Takeback & Recycling",
        url: "https://www.lenovo.com/in/en/sustainability-product-recycling/",
        description: "Lenovo's authorized e-waste collection center locator and disposal service.",
        source: "Lenovo",
    },
    hp: {
        title: "HP Planet Partners Recycling Program",
        url: "https://www.hp.com/in-en/hp-information/sustainable-impact/planet-recycling.html",
        description: "HP's free and responsible recycling program for printers, laptops, and ink cartridges.",
        source: "HP",
    },
    sony: {
        title: "Sony India E-Waste Management",
        url: "https://www.sony.co.in/electronics/eco/green-management",
        description: "Sony's official collection center network for recycling audio, TV, and cameras.",
        source: "Sony India",
    },
};

const findManufacturerResource = (item: string): ResourceItem[] => {
    const text = item.toLowerCase();
    for (const [brand, resource] of Object.entries(MANUFACTURER_RECYCLING_PROGRAMS)) {
        if (text.includes(brand)) {
            return [resource];
        }
    }
    return [];
};

// 3a. Recycling resources
const getRecyclingResources = (item: string): ResourceItem[] => {
    const { isElectronic, isFurniture, isClothing } = categorizeItem(item);
    const manufacturerMatch = findManufacturerResource(item);

    if (isElectronic) {
        return [
            ...manufacturerMatch,
            {
                title: "CPCB E-Waste Management Portal",
                url: "https://eprewaste.cpcb.gov.in/",
                description: "Official Government of India portal to find authorized e-waste recyclers and collection points.",
                source: "Central Pollution Control Board",
            },
            {
                title: "Karo Sambhav Certified E-Waste Recycling",
                url: "https://www.karosambhav.com/",
                description: "Authorized Producer Responsibility Organization (PRO) for responsible e-waste drop-off across India.",
                source: "Karo Sambhav",
            },
        ];
    }

    if (isClothing) {
        return [
            {
                title: "Goonj Cloth & Material Upcycling",
                url: "https://goonj.org/",
                description: "Turn old garments, fabrics, and school bags into meaningful community utility kits.",
                source: "Goonj",
            },
            {
                title: "Local Garment & Textile Recycling",
                url: "https://www.thekabadiwala.com/",
                description: "Book doorstep pickup for old textiles, paper, and dry recyclables.",
                source: "The Kabadiwala",
            },
        ];
    }

    if (isFurniture) {
        return [
            {
                title: "Scrap & Wood Reclamation Services",
                url: "https://www.thekabadiwala.com/",
                description: "Schedule recyclable material collection for wood, metal, and plastic furniture frames.",
                source: "The Kabadiwala",
            },
        ];
    }

    // General fallback
    return [
        {
            title: "Doorstep Recyclable Scrap Collection",
            url: "https://www.thekabadiwala.com/",
            description: "Sell or responsibly recycle paper, plastic, metal, and dry domestic waste.",
            source: "The Kabadiwala",
        },
    ];
};

// 3b. Refurbishment resources
const getRefurbishmentResources = (item: string): ResourceItem[] => {
    const { isElectronic, isFurniture } = categorizeItem(item);

    if (isElectronic) {
        return [
            {
                title: "Cashify Certified Refurbished & Buyback",
                url: "https://www.cashify.in/",
                description: "Sell, buy certified refurbished electronics, or request doorstep repair diagnostics.",
                source: "Cashify",
            },
            {
                title: "Amazon Renewed (Certified Pre-Owned)",
                url: "https://www.amazon.in/Amazon-Renewed/b?ie=UTF8&node=11400137031",
                description: "Browse certified refurbished appliances and electronics tested to work like new.",
                source: "Amazon Renewed",
            },
        ];
    }

    if (isFurniture) {
        return [
            {
                title: "Furniture Refurbishment & Re-upholstery",
                url: "https://www.urbancompany.com/",
                description: "Book professional carpenters and upholstery technicians for restorative polish and fixes.",
                source: "Urban Company",
            },
        ];
    }

    return [];
};

// 3c. Donation resources
const getDonationResources = (item: string): ResourceItem[] => {
    const { isClothing, isElectronic } = categorizeItem(item);

    const donationList: ResourceItem[] = [
        {
            title: "Goonj Material Donation Program",
            url: "https://goonj.org/drop-off-centres/",
            description: "Donate wearable clothes, school supplies, utensils, and usable household goods at nationwide drop-off centers.",
            source: "Goonj",
        },
        {
            title: "GiveIndia Giving Network",
            url: "https://www.giveindia.org/",
            description: "India's largest trusted donation platform supporting verified community non-profits.",
            source: "GiveIndia",
        },
    ];

    if (isElectronic) {
        donationList.unshift({
            title: "Donate Old Usable Devices (Digital Empowerment)",
            url: "https://www.giveindia.org/",
            description: "Help students and community centers by donating functioning smartphones, tablets, or laptops.",
            source: "GiveIndia",
        });
    }

    return donationList.slice(0, 2);
};

// 3d. Combined Replacement Resources
const getReplacementResources = (item: string): ReplacementOptions => {
    return {
        donate: getDonationResources(item),
        refurbish: getRefurbishmentResources(item),
        recycle: getRecyclingResources(item),
    };
};