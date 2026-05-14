import { PropertyService } from '../services/property_service';
import { propertySchema } from '../validation/propertyValidation';
import { ZodError } from 'zod';

export class PropertyController {
    private propertyService: PropertyService;

    constructor() {
        this.propertyService = new PropertyService();
    }

    async getProperties(req: any, res: any) {
        try {
            const properties = await this.propertyService.getAllProperties(req.query);
            res.status(200).json({
                success: true,
                data: properties
            });
        } catch (error) {
            console.error("Error in getProperties:", error);
            res.status(500).json({ 
                success: false, 
                message: "حدث خطأ أثناء جلب العقارات" 
            });
        }
    }

    async getPropertyDetails(req: any, res: any) {
        try {
            const id = Number(req.params.id);
            if (isNaN(id)) {
                return res.status(400).json({ success: false, message: "معرف العقار غير صحيح" });
            }

            const property = await this.propertyService.getPropertyById(id);
            if (!property) {
                return res.status(404).json({ success: false, message: "العقار غير موجود" });
            }

            res.status(200).json({
                success: true,
                data: property
            });
        } catch (error) {
            console.error("Error in getPropertyDetails:", error);
            res.status(500).json({ 
                success: false, 
                message: "حدث خطأ أثناء جلب تفاصيل العقار" 
            });
        }
    }

    async create(req: any, res: any) {
        try {
            const validatedData = propertySchema.parse(req.body);
            const ownerId = req.user?.id || 1; 

            const newProperty = await this.propertyService.createProperty(validatedData, ownerId);
            
            res.status(201).json({
                success: true,
                message: "تم إنشاء العقار بنجاح",
                data: newProperty
            });
        } catch (error) {
            if (error instanceof ZodError) {
                return res.status(400).json({
                    success: false,
                    message: "بيانات غير صالحة",
                    errors: error.errors.map(e => ({ path: e.path, message: e.message }))
                });
            }
            console.error("Error in create property:", error);
            res.status(500).json({ 
                success: false, 
                message: "حدث خطأ أثناء إضافة العقار" 
            });
        }
    }
}
