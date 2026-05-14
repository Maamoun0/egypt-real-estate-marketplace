import { Property } from '../models/Property';
import { propertySchema, PropertyInput } from '../validation/propertyValidation';

export class PropertyService {
    private mockProperties: Property[] = [
        {
            id: 1,
            title_ar: "فيلا فاخرة بالتجمع الخامس - إطلالة كاملة على الجولف",
            title_en: "Luxury Golf-View Villa in Fifth Settlement",
            description_ar: "فيلا بتصميم عصري فريد في أرقى مراحل التجمع الخامس، تشطيب الترا سوبر لوكس مع حمام سباحة خاص وحديقة منسقة بالكامل. تتكون من 6 غرف نوم رئيسية وريسبشن واسع يتسع لـ 5 قطع.",
            description_en: "Ultra-modern luxury villa in the most prestigious area of New Cairo. Features a private infinity pool, landscaped garden, 6 master bedrooms, and an expansive reception area.",
            price: 25000000,
            currency: "EGP",
            type: "sale",
            category: "villa",
            city: "القاهرة الجديدة",
            district: "التجمع الخامس",
            address_text: "كمبوند ميفيدا، التجمع الخامس، القاهرة الجديدة",
            area_size: 750,
            rooms: 6,
            bathrooms: 7,
            owner_id: 101,
            status: "active",
            is_featured: true,
            created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
            images: [
                "https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1200&q=80",
                "https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=1200&q=80"
            ]
        },
        {
            id: 2,
            title_ar: "شقة الترا سوبر لوكس بزايد مع روف خاص وإطلالة بانورامية",
            title_en: "Ultra Modern Penthouse in Sheikh Zayed with Private Roof",
            description_ar: "بنتهاوس مذهل للبيع في قلب الشيخ زايد، يتميز بروف خاص مجهز ببرجولا ومنطقة شواء. إضاءة طبيعية ممتازة وأنظمة منزل ذكي متكاملة.",
            description_en: "Stunning penthouse in the heart of Sheikh Zayed featuring a private rooftop terrace with pergola and BBQ area. Excellent natural light and smart home automation.",
            price: 8500000,
            currency: "EGP",
            type: "sale",
            category: "apartment",
            city: "الشيخ زايد",
            district: "بيفرلي هيلز",
            address_text: "كمبوند بيفرلي هيلز، الشيخ زايد",
            area_size: 280,
            rooms: 4,
            bathrooms: 4,
            owner_id: 102,
            status: "active",
            is_featured: true,
            created_at: new Date(Date.now() - 86400000 * 5).toISOString(),
            images: [
                "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1200&q=80",
                "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80"
            ]
        },
        {
            id: 3,
            title_ar: "شاليه صف أول على البحر مباشرة - مراسي الساحل الشمالي",
            title_en: "First Row Beachfront Chalet - Marassi North Coast",
            description_ar: "شاليه مفروش بالكامل بأرقى الأثاث المستورد، يطل مباشرة على المياه الفيروزية للبحر الأبيض المتوسط. موقع استثنائي خطوات من الشاطئ والكلوب هاوس.",
            description_en: "Fully furnished beachfront chalet with premium imported furniture, offering direct uninterrupted views of the turquoise Mediterranean sea.",
            price: 15000000,
            currency: "EGP",
            type: "sale",
            category: "apartment",
            city: "الساحل الشمالي",
            district: "مراسي",
            address_text: "قرية مراسي، سيدي عبد الرحمن، الساحل الشمالي",
            area_size: 190,
            rooms: 3,
            bathrooms: 3,
            owner_id: 103,
            status: "active",
            is_featured: false,
            created_at: new Date(Date.now() - 86400000 * 10).toISOString(),
            images: [
                "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80"
            ]
        },
        {
            id: 4,
            title_ar: "مقر إداري فاخر مجهز بالكامل للإيجار - العاصمة الإدارية",
            title_en: "Premium Fully Furnished Office Space - New Capital",
            description_ar: "مساحة مكتبية استثنائية في أكثر أبراج العاصمة الإدارية تميزاً، تشطيبات فاخرة وتكييف مركزي وشبكات إنترنت فائقة السرعة مع إطلالة على البرج الأيقوني.",
            description_en: "Exceptional office space in a landmark tower at the New Administrative Capital. Central AC, high-speed fiber optics, viewing the Iconic Tower.",
            price: 120000,
            currency: "EGP",
            type: "rent",
            category: "apartment",
            city: "العاصمة الإدارية",
            district: "حي المال والأعمال",
            address_text: "منطقة الأعمال المركزية CBD، العاصمة الإدارية الجديدة",
            area_size: 350,
            rooms: 8,
            bathrooms: 3,
            owner_id: 104,
            status: "active",
            is_featured: true,
            created_at: new Date(Date.now() - 86400000 * 1).toISOString(),
            images: [
                "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80"
            ]
        },
        {
            id: 5,
            title_ar: "قطعة أرض ناصية مميزة لبناء قصر - التجمع الأول",
            title_en: "Prime Corner Plot for Luxury Palace - First Settlement",
            description_ar: "أرض سكنية بمساحة ضخمة في موقع استراتيجي بالتجمع الأول، رخصة بناء فيلا/قصر (بدروم + أرضي + دورين + روف)، كاملة المرافق وجاهزة للبناء فوراً.",
            description_en: "Expansive residential corner plot in a premium location at First Settlement. Fully licensed for building a luxury palace/villa.",
            price: 30000000,
            currency: "EGP",
            type: "sale",
            category: "land",
            city: "القاهرة الجديدة",
            district: "التجمع الأول",
            address_text: "حي البنفسج، التجمع الأول، القاهرة الجديدة",
            area_size: 1200,
            rooms: 0,
            bathrooms: 0,
            owner_id: 105,
            status: "active",
            is_featured: false,
            created_at: new Date().toISOString(),
            images: [
                "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=80"
            ]
        }
    ];

    async getAllProperties(filters?: any): Promise<Property[]> {
        console.log("Fetching properties with filters:", filters);
        let result = [...this.mockProperties];

        if (filters) {
            if (filters.category && filters.category !== 'all') {
                result = result.filter(p => p.category === filters.category);
            }
            if (filters.type && filters.type !== 'all') {
                result = result.filter(p => p.type === filters.type);
            }
            if (filters.search) {
                const query = filters.search.toLowerCase();
                result = result.filter(p => 
                    p.title_ar.toLowerCase().includes(query) ||
                    (p.title_en && p.title_en.toLowerCase().includes(query)) ||
                    p.city.toLowerCase().includes(query) ||
                    (p.district && p.district.toLowerCase().includes(query))
                );
            }
        }

        return result;
    }

    async getPropertyById(id: number): Promise<Property | null> {
        return this.mockProperties.find(p => p.id === id) || null;
    }

    async createProperty(data: PropertyInput, ownerId: number): Promise<Property> {
        const newProperty: Property = {
            ...data,
            id: Date.now(),
            owner_id: ownerId,
            status: 'active', // Make newly added property automatically visible to wow the user
            is_featured: true,
            created_at: new Date().toISOString(),
            currency: data.currency || 'EGP',
            images: data.images && data.images.length > 0 ? data.images : [
                "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1200&q=80"
            ]
        } as Property;
        
        // Add to beginning of array so it appears first
        this.mockProperties.unshift(newProperty);
        return newProperty;
    }

    async updateProperty(id: number, data: Partial<PropertyInput>): Promise<Property | null> {
        const index = this.mockProperties.findIndex(p => p.id === id);
        if (index === -1) return null;
        
        this.mockProperties[index] = { 
            ...this.mockProperties[index], 
            ...data,
            id: this.mockProperties[index].id,
            owner_id: this.mockProperties[index].owner_id
        };
        return this.mockProperties[index];
    }

    async deleteProperty(id: number): Promise<boolean> {
        const initialLength = this.mockProperties.length;
        this.mockProperties = this.mockProperties.filter(p => p.id !== id);
        return this.mockProperties.length < initialLength;
    }
}

