export const formatPrice = (price: number, currency: string = 'EGP', language: 'ar' | 'en' = 'ar') => {
    return new Intl.NumberFormat(language === 'ar' ? 'ar-EG' : 'en-US', {
        style: 'currency',
        currency: currency,
        maximumFractionDigits: 0
    }).format(price);
};

export const getTranslation = (ar: string, en?: string, language: 'ar' | 'en' = 'ar') => {
    return language === 'ar' ? ar : en || ar;
};
