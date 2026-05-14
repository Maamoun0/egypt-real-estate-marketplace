export interface Property {
    id: number;
    title_ar: string;
    title_en?: string;
    description_ar: string;
    description_en?: string;
    price: number;
    currency: string;
    type: 'sale' | 'rent';
    category: 'apartment' | 'villa' | 'land';
    city: string;
    district?: string;
    address_text?: string;
    area_size?: number;
    rooms?: number;
    bathrooms?: number;
    owner_id: number;
    status: 'draft' | 'pending' | 'active' | 'rejected' | 'sold';
    is_featured: boolean;
    created_at: string;
    images?: string[];
}
