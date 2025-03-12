import { placeMarkGeometryCoordinatesType } from "../types";

type GeometryType = {
    type: "Point";
    coordinates: placeMarkGeometryCoordinatesType; // Массив с координатами
};

type OfferParamType = {
    name: string
    '#text': string | number
}
type ApiResponseFilters = {
    "Метро": string[],
    "Площадь (диапазон)": string[],
    "Район": string[],
    "Состояние": string[],
    "Строительная готовность": string[],
}
export type ApiResponseCategories = { [key: string]: string }
type GettingOfferType = {
    name: string
    categoryId: number,
    count: number,
    currencyId: string,
    description: string,
    id: string,
    param: OfferParamType[],
    picture: string[],
    position: { x: number, y: number },
    price: number,
    url: string
    vendor: string
}
export type ReturningOfferType = Omit<GettingOfferType, 'categoryId' | 'position'> & {
    categoryId: string;
    geometry: GeometryType; // Добавляем новое поле geometry
};
type GettingApiResponse = {
    categories: ApiResponseCategories,
    count: number,
    filters: ApiResponseFilters
    offers: { [key: string]: GettingOfferType[] }
    priceRange: {
        max: number,
        min: number
    }
}
export type ReturningApiResponse = Omit<GettingApiResponse, 'offers'> & {
    offers: ReturningOfferType[]
}
export const api = {
    getData: async (): Promise<ReturningApiResponse | undefined> => {
        try {
            const response = await fetch("https://idre.inbis.pro/api/get-markers");
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data: GettingApiResponse = await response.json();

            // Transform offers to parse categoryId as a string and add geometry
            const transformedOffers: ReturningOfferType[] = Object.entries(data.offers).flatMap(([_key, offers]) =>
                offers.map(offer => {
                    const { position, ...rest } = offer; // Деструктурируем, чтобы удалить position
                    return {
                        ...rest,
                        categoryId: String(offer.categoryId), // Преобразуем categoryId в строку
                        geometry: {
                            type: "Point",
                            coordinates: [position.x, position.y] // Используем position для создания координат
                        }
                    };
                })
            );
            // Return the transformed data
            return {
                ...data,
                offers: transformedOffers // Use the transformed offers
            } as ReturningApiResponse; // Cast to ReturningApiResponse
        } catch (error) {
            console.error("Error fetching data:", error);
            return undefined;
        }
    }
}

