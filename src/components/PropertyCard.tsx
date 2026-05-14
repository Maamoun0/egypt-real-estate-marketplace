import React from 'react';
import styles from '../styles/property_card.module.css';
import { Property } from '../models/Property';
import { formatPrice, getTranslation } from '../utils/formatters';

interface PropertyCardProps {
    property: Property;
    language?: 'ar' | 'en';
}

const PropertyCard: React.FC<PropertyCardProps> = ({ property, language = 'ar' }) => {
    const title = getTranslation(property.title_ar, property.title_en, language);
    const priceFormatted = formatPrice(property.price, property.currency, language);

    return (
        <div className={`${styles.card} ${language === 'ar' ? styles.rtl : styles.ltr}`}>
            <div className={styles.imageWrapper}>
                <img 
                    src={property.images && property.images.length > 0 ? property.images[0] : '/placeholder.jpg'} 
                    alt={title} 
                    className={styles.image}
                    loading="lazy"
                />
                <div className={styles.badge}>
                    {property.type === 'sale' 
                        ? (language === 'ar' ? 'للبيع' : 'For Sale') 
                        : (language === 'ar' ? 'للإيجار' : 'For Rent')
                    }
                </div>
                {property.is_featured && (
                    <div className={styles.featuredBadge}>
                        {language === 'ar' ? 'مميز' : 'Featured'}
                    </div>
                )}
            </div>
            
            <div className={styles.content}>
                <div className={styles.price}>{priceFormatted}</div>
                <h3 className={styles.title}>{title}</h3>
                
                <div className={styles.details}>
                    <div className={styles.detailItem}>
                        <span className={styles.icon}>🛏️</span>
                        <span>{property.rooms} {language === 'ar' ? 'غرف' : 'Rooms'}</span>
                    </div>
                    <div className={styles.detailItem}>
                        <span className={styles.icon}>🚿</span>
                        <span>{property.bathrooms} {language === 'ar' ? 'حمام' : 'Baths'}</span>
                    </div>
                    <div className={styles.detailItem}>
                        <span className={styles.icon}>📏</span>
                        <span>{property.area_size} م²</span>
                    </div>
                </div>
            </div>

            <div className={styles.footer}>
                <span className={styles.location}>📍 {property.city}, {property.district}</span>
            </div>
        </div>
    );
};

export default PropertyCard;
