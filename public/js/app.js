// Shared State
let properties = [];
let currentLang = 'ar';
let currentTypeFilter = 'all';

// DOM Elements
const grid = document.getElementById('properties-grid');
const loader = document.getElementById('loader');
const emptyState = document.getElementById('empty-state');
const resultsCount = document.getElementById('results-count');
const searchInput = document.getElementById('search-input');
const categorySelect = document.getElementById('category-select');
const btnSearch = document.getElementById('btn-execute-search');

const addModal = document.getElementById('add-modal');
const detailsModal = document.getElementById('details-modal');
const modalDetailsBody = document.getElementById('modal-details-body');
const addPropertyForm = document.getElementById('add-property-form');

const btnLangToggle = document.getElementById('btn-lang-toggle');
const btnThemeToggle = document.getElementById('btn-theme-toggle');
const btnOpenAddModal = document.getElementById('btn-open-add-modal');

// Translations Map for UI Switching
const translations = {
    ar: {
        title: "إمكان للعقارات الفاخرة",
        home: "الرئيسية",
        featured: "المميز",
        addBtn: "أضف عقارك",
        heroSubtitle: "بوابتك للرقي والاستثمار",
        heroTitle: "اكتشف مسكنك الفاخر في <span>أرقى مواقع مصر</span>",
        heroDesc: "نقدم لك مجموعة منتقاة بعناية من أفضل الفلل والشقق والأراضي الحصرية لتجربة معيشية استثنائية.",
        tabAll: "الكل",
        tabSale: "للبيع",
        tabRent: "للإيجار",
        searchLabel: "🔍 الكلمة المفتاحية",
        searchPlaceholder: "ابحث بالمدينة، المنطقة، أو اسم العقار...",
        catLabel: "🏢 نوع العقار",
        catAll: "جميع الأنواع",
        catApt: "شقق وفنادق",
        catVilla: "فلل وقصور",
        catLand: "أراضي",
        btnSearch: "بحث متقدم",
        secTitle: "العقارات المتاحة",
        secSub: "أحدث العروض الحصرية الموثقة",
        foundText: "تم العثور على: ",
        propUnit: "عقار",
        emptyTitle: "لم يتم العثور على عقارات مطابقة",
        emptyDesc: "حاول تعديل خيارات البحث أو أضف عقاراً جديداً الآن.",
        resetBtn: "إعادة ضبط البحث",
        loading: "جاري تحميل العقارات الفاخرة...",
        rooms: "غرف",
        baths: "حمام",
        area: "م²",
        saleBadge: "للبيع",
        rentBadge: "للإيجار",
        featuredBadge: "مميز",
        currency: "ج.م",
        modalSpecs: { rooms: "غرف النوم", baths: "الحمامات", area: "المساحة", purpose: "الغرض", cat: "الفئة" },
        whatsapp: "تواصل واتساب",
        call: "اتصال هاتفي",
        modalAddTitle: "إضافة عقار فاخر جديد",
        modalAddSub: "يرجى ملء تفاصيل العقار بدقة ليتم عرضه للعملاء",
        cancel: "إلغاء",
        publish: "نشر العقار الفاخر",
        successMsg: "تم نشر عقارك الفاخر بنجاح! يظهر الآن في مقدمة العروض."
    },
    en: {
        title: "EMKAN Luxury Real Estate",
        home: "Home",
        featured: "Featured",
        addBtn: "Add Property",
        heroSubtitle: "Your Gateway to Premium Investment",
        heroTitle: "Discover Luxury Living in <span>Egypt's Prime Locations</span>",
        heroDesc: "We offer a handpicked selection of exclusive villas, upscale apartments, and premium lands for an exceptional lifestyle.",
        tabAll: "All",
        tabSale: "For Sale",
        tabRent: "For Rent",
        searchLabel: "🔍 Keyword Search",
        searchPlaceholder: "Search by city, district, or title...",
        catLabel: "🏢 Property Category",
        catAll: "All Categories",
        catApt: "Apartments & Hotels",
        catVilla: "Villas & Palaces",
        catLand: "Lands & Plots",
        btnSearch: "Advanced Search",
        secTitle: "Available Properties",
        secSub: "Latest Verified Exclusive Listings",
        foundText: "Found: ",
        propUnit: "properties",
        emptyTitle: "No Matching Properties Found",
        emptyDesc: "Try adjusting your search criteria or list a new property now.",
        resetBtn: "Reset Filters",
        loading: "Loading luxury listings...",
        rooms: "Rooms",
        baths: "Baths",
        area: "m²",
        saleBadge: "For Sale",
        rentBadge: "For Rent",
        featuredBadge: "Featured",
        currency: "EGP",
        modalSpecs: { rooms: "Bedrooms", baths: "Bathrooms", area: "Area Size", purpose: "Purpose", cat: "Category" },
        whatsapp: "WhatsApp Chat",
        call: "Direct Call",
        modalAddTitle: "List a New Luxury Property",
        modalAddSub: "Please fill in the comprehensive details to showcase your real estate",
        cancel: "Cancel",
        publish: "Publish Property",
        successMsg: "Your luxury property has been published successfully! It is now featured at the top."
    }
};

// Formatter helper
function formatNumber(num) {
    return new Intl.NumberFormat(currentLang === 'ar' ? 'ar-EG' : 'en-US').format(num);
}

// Fetch Initial Listings
async function fetchProperties(filters = {}) {
    showLoader(true);
    try {
        const params = new URLSearchParams();
        if (filters.category && filters.category !== 'all') params.append('category', filters.category);
        if (filters.type && filters.type !== 'all') params.append('type', filters.type);
        if (filters.search) params.append('search', filters.search);

        const response = await fetch(`/api/properties?${params.toString()}`);
        const data = await response.json();
        
        if (data.success) {
            properties = data.data;
            renderProperties();
        } else {
            console.error("Server return false:", data.message);
            showLoader(false);
        }
    } catch (err) {
        console.error("Error fetching properties:", err);
        showLoader(false);
    }
}

// Render dynamic properties grid
function renderProperties() {
    showLoader(false);
    grid.innerHTML = '';
    
    const t = translations[currentLang];
    resultsCount.innerText = formatNumber(properties.length);
    document.querySelector('#results-count-wrapper span').innerText = t.foundText;
    
    if (properties.length === 0) {
        emptyState.classList.remove('hidden');
        return;
    } else {
        emptyState.classList.add('hidden');
    }

    properties.forEach(prop => {
        const title = currentLang === 'ar' ? prop.title_ar : (prop.title_en || prop.title_ar);
        const imgUrl = prop.images && prop.images.length > 0 ? prop.images[0] : 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1200&q=80';
        const purposeBadgeText = prop.type === 'sale' ? t.saleBadge : t.rentBadge;
        const priceFormatted = `${formatNumber(prop.price)} ${t.currency}`;

        const card = document.createElement('div');
        card.className = 'property-card';
        card.onclick = () => openPropertyDetails(prop);

        // Build specifications snippet conditionally
        let specsHtml = '';
        if (prop.category !== 'land') {
            specsHtml += `
                <div class="spec-item">
                    <span>🛏️</span> <strong>${prop.rooms || 0}</strong> ${t.rooms}
                </div>
                <div class="spec-item">
                    <span>🚿</span> <strong>${prop.bathrooms || 0}</strong> ${t.baths}
                </div>
            `;
        }
        if (prop.area_size) {
            specsHtml += `
                <div class="spec-item">
                    <span>📐</span> <strong>${formatNumber(prop.area_size)}</strong> ${t.area}
                </div>
            `;
        }

        card.innerHTML = `
            <div class="card-image-wrapper">
                <img src="${imgUrl}" alt="${title}" class="card-image" loading="lazy">
                <div class="card-badges">
                    <span class="badge-purpose ${prop.type}">${purposeBadgeText}</span>
                    ${prop.is_featured ? `<span class="badge-featured">${t.featuredBadge}</span>` : ''}
                </div>
            </div>
            <div class="card-body">
                <div class="card-price">${priceFormatted}</div>
                <h3 class="card-title">${title}</h3>
                <div class="card-specs">
                    ${specsHtml}
                </div>
            </div>
            <div class="card-footer">
                <span>📍</span> <span>${prop.city}${prop.district ? `، ${prop.district}` : ''}</span>
            </div>
        `;

        grid.appendChild(card);
    });
}

// Filter tabs interaction
document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
        document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        e.target.classList.add('active');
        currentTypeFilter = e.target.getAttribute('data-type');
        triggerSearch();
    });
});

// Direct search triggers
btnSearch.addEventListener('click', triggerSearch);
searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') triggerSearch();
});
categorySelect.addEventListener('change', triggerSearch);

function triggerSearch() {
    const searchVal = searchInput.value.trim();
    const catVal = categorySelect.value;
    
    fetchProperties({
        category: catVal,
        type: currentTypeFilter,
        search: searchVal
    });
}

function resetFilters() {
    searchInput.value = '';
    categorySelect.value = 'all';
    currentTypeFilter = 'all';
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    document.querySelector('.tab-btn[data-type="all"]').classList.add('active');
    
    document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
    document.getElementById('btn-home').classList.add('active');

    fetchProperties();
}

function filterFeatured() {
    document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
    document.getElementById('btn-featured').classList.add('active');

    // Filter local loaded properties or trigger fetch
    const featuredProps = properties.filter(p => p.is_featured);
    properties = featuredProps;
    renderProperties();
}

function showLoader(show) {
    if (show) {
        loader.classList.remove('hidden');
        grid.innerHTML = '';
        emptyState.classList.add('hidden');
    } else {
        loader.classList.add('hidden');
    }
}

// ==================================================================
// Details Modal Rendering
// ==================================================================
function openPropertyDetails(prop) {
    const t = translations[currentLang];
    const title = currentLang === 'ar' ? prop.title_ar : (prop.title_en || prop.title_ar);
    const desc = currentLang === 'ar' ? prop.description_ar : (prop.description_en || prop.description_ar);
    const imgUrl = prop.images && prop.images.length > 0 ? prop.images[0] : 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1200&q=80';
    const priceFormatted = `${formatNumber(prop.price)} ${t.currency}`;
    const purposeText = prop.type === 'sale' ? t.tabSale : t.tabRent;
    
    let catText = t.catApt;
    if (prop.category === 'villa') catText = t.catVilla;
    if (prop.category === 'land') catText = t.catLand;

    let specsBoxes = `
        <div class="spec-box">
            <div class="spec-box-label">${t.modalSpecs.purpose}</div>
            <div class="spec-box-value">${purposeText}</div>
        </div>
        <div class="spec-box">
            <div class="spec-box-label">${t.modalSpecs.cat}</div>
            <div class="spec-box-value">${catText}</div>
        </div>
    `;

    if (prop.category !== 'land') {
        specsBoxes += `
            <div class="spec-box">
                <div class="spec-box-label">${t.modalSpecs.rooms}</div>
                <div class="spec-box-value">${prop.rooms || 0}</div>
            </div>
            <div class="spec-box">
                <div class="spec-box-label">${t.modalSpecs.baths}</div>
                <div class="spec-box-value">${prop.bathrooms || 0}</div>
            </div>
        `;
    }
    if (prop.area_size) {
        specsBoxes += `
            <div class="spec-box">
                <div class="spec-box-label">${t.modalSpecs.area}</div>
                <div class="spec-box-value">${formatNumber(prop.area_size)} ${t.area}</div>
            </div>
        `;
    }

    modalDetailsBody.innerHTML = `
        <img src="${imgUrl}" alt="${title}" class="details-view-img">
        <div class="details-view-body">
            <div class="details-view-header">
                <div>
                    <h2 class="details-view-title">${title}</h2>
                    <p style="color: var(--text-muted); margin-top: 4px;">📍 ${prop.address_text || `${prop.city}، ${prop.district || ''}`}</p>
                </div>
                <div class="details-view-price">${priceFormatted}</div>
            </div>
            
            <div class="details-view-desc">
                ${desc.replace(/\n/g, '<br>')}
            </div>

            <div class="details-view-grid">
                ${specsBoxes}
            </div>

            <div class="details-actions">
                <a href="https://wa.me/201001234567?text=${encodeURIComponent(`مرحباً، أود الاستفسار عن العقار: ${title}`)}" target="_blank" class="btn-whatsapp">
                    💬 ${t.whatsapp}
                </a>
                <a href="tel:+201001234567" class="btn-call">
                    📞 ${t.call}
                </a>
            </div>
        </div>
    `;

    detailsModal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
}

function closeDetailsModal() {
    detailsModal.classList.add('hidden');
    document.body.style.overflow = 'auto';
}

// ==================================================================
// Add Property Form Submission & Interaction
// ==================================================================
btnOpenAddModal.addEventListener('click', () => {
    addModal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
});

function closeAddModal() {
    addModal.classList.add('hidden');
    document.body.style.overflow = 'auto';
    addPropertyForm.reset();
}

addPropertyForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const submitBtn = document.getElementById('btn-submit-property');
    const originalText = submitBtn.innerText;
    submitBtn.innerText = 'جاري النشر...';
    submitBtn.disabled = true;

    const imgUrlInput = document.getElementById('p-image-url').value.trim();
    const imagesArr = imgUrlInput ? [imgUrlInput] : [];

    const payload = {
        title_ar: document.getElementById('p-title-ar').value.trim(),
        title_en: document.getElementById('p-title-en').value.trim() || undefined,
        description_ar: document.getElementById('p-desc-ar').value.trim(),
        description_en: document.getElementById('p-desc-en').value.trim() || undefined,
        price: Number(document.getElementById('p-price').value),
        type: document.getElementById('p-type').value,
        category: document.getElementById('p-category').value,
        city: document.getElementById('p-city').value.trim(),
        district: document.getElementById('p-district').value.trim() || undefined,
        area_size: Number(document.getElementById('p-area').value) || undefined,
        rooms: Number(document.getElementById('p-rooms').value) || 0,
        bathrooms: Number(document.getElementById('p-baths').value) || 0,
        images: imagesArr
    };

    try {
        const res = await fetch('/api/properties', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        const data = await res.json();
        if (data.success) {
            // Unshift new item locally to refresh dynamic UI flawlessly
            properties.unshift(data.data);
            closeAddModal();
            renderProperties();
            
            // Notification toast
            alert(translations[currentLang].successMsg);
        } else {
            alert('حدث خطأ أثناء إضافة العقار: ' + (data.message || 'بيانات غير صالحة'));
        }
    } catch (err) {
        console.error("Submission error:", err);
        alert('حدث خطأ في الاتصال بالسيرفر.');
    } finally {
        submitBtn.innerText = originalText;
        submitBtn.disabled = false;
    }
});

// ==================================================================
// Language Switching Mechanism
// ==================================================================
btnLangToggle.addEventListener('click', () => {
    currentLang = currentLang === 'ar' ? 'en' : 'ar';
    document.documentElement.setAttribute('lang', currentLang);
    document.documentElement.setAttribute('dir', currentLang === 'ar' ? 'rtl' : 'ltr');
    
    // Switch button display label
    document.querySelector('.lang-text').innerText = currentLang === 'ar' ? 'EN' : 'عربي';

    // Translate statically targeted items
    applyStaticTranslations();
    
    // Re-render data strings
    renderProperties();
});

function applyStaticTranslations() {
    const t = translations[currentLang];
    
    // Document Title
    document.title = `${t.title} | Premium Portal`;
    
    // Brand links/text
    document.getElementById('btn-home').innerText = t.home;
    document.getElementById('btn-featured').innerText = t.featured;
    document.querySelector('.btn-text').innerText = t.addBtn;
    
    // Hero elements
    document.querySelector('.hero-badge').innerText = t.heroSubtitle;
    document.querySelector('.hero-title').innerHTML = t.heroTitle;
    document.querySelector('.hero-description').innerText = t.heroDesc;
    
    // Tabs
    document.getElementById('tab-all-types').innerText = t.tabAll;
    document.getElementById('tab-sale').innerText = t.tabSale;
    document.getElementById('tab-rent').innerText = t.tabRent;
    
    // Inputs placeholders/labels
    document.querySelector('label[for="search-input"]').innerText = t.searchLabel;
    searchInput.placeholder = t.searchPlaceholder;
    document.querySelector('label[for="category-select"]').innerText = t.catLabel;
    
    categorySelect.options[0].text = t.catAll;
    categorySelect.options[1].text = t.catApt;
    categorySelect.options[2].text = t.catVilla;
    categorySelect.options[3].text = t.catLand;
    
    btnSearch.innerText = t.btnSearch;
    
    // Section header
    document.querySelector('.section-title').innerText = t.secTitle;
    document.querySelector('.section-subtitle').innerText = t.secSub;
    
    // Empty state / Loader
    document.querySelector('.loader-container p').innerText = t.loading;
    document.querySelector('.empty-state h3').innerText = t.emptyTitle;
    document.querySelector('.empty-state p').innerText = t.emptyDesc;
    document.querySelector('.empty-state button').innerText = t.resetBtn;
    
    // Add modal texts
    document.querySelector('.add-modal-card .modal-title').innerText = t.modalAddTitle;
    document.querySelector('.add-modal-card .modal-subtitle').innerText = t.modalAddSub;
    document.querySelector('#add-property-form .btn-secondary').innerText = t.cancel;
    document.querySelector('#add-property-form .btn-primary').innerText = t.publish;
}

// ==================================================================
// Theme Toggle Mechanism
// ==================================================================
btnThemeToggle.addEventListener('click', () => {
    const isDark = document.body.classList.contains('dark-theme');
    if (isDark) {
        document.body.classList.remove('dark-theme');
        document.body.classList.add('light-theme');
        btnThemeToggle.innerText = '🌙';
    } else {
        document.body.classList.remove('light-theme');
        document.body.classList.add('dark-theme');
        btnThemeToggle.innerText = '☀️';
    }
});

// Kickstart
document.addEventListener('DOMContentLoaded', () => {
    fetchProperties();
});
