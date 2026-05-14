
-- DDL for Real Estate Marketplace Egypt
-- Target DB: PostgreSQL 14+

-- 2.1 Users
CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    phone VARCHAR(20) UNIQUE NOT NULL,
    role VARCHAR(20) NOT NULL DEFAULT 'user', -- user / admin
    is_verified BOOLEAN DEFAULT FALSE,
    preferred_language VARCHAR(5) DEFAULT 'ar',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2.2 Profiles
CREATE TABLE profiles (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(255),
    city VARCHAR(100),
    avatar TEXT
);

-- 2.3 Properties
CREATE TABLE properties (
    id BIGSERIAL PRIMARY KEY,

    title_ar TEXT NOT NULL,
    title_en TEXT,

    description_ar TEXT NOT NULL,
    description_en TEXT,

    price NUMERIC NOT NULL CHECK (price > 0),
    currency VARCHAR(10) DEFAULT 'EGP',

    type VARCHAR(10) NOT NULL CHECK (type IN ('sale','rent')),
    category VARCHAR(20) NOT NULL CHECK (category IN ('apartment','villa','land')),

    city VARCHAR(100) NOT NULL,
    district VARCHAR(100),
    address_text TEXT,

    area_size NUMERIC CHECK (area_size > 0),
    rooms INT CHECK (rooms >= 0),
    bathrooms INT CHECK (bathrooms >= 0),

    owner_id BIGINT REFERENCES users(id) ON DELETE CASCADE,

    status VARCHAR(20) DEFAULT 'pending'
        CHECK (status IN ('draft','pending','active','rejected','sold')),

    is_featured BOOLEAN DEFAULT FALSE,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2.4 Property Images
CREATE TABLE property_images (
    id BIGSERIAL PRIMARY KEY,
    property_id BIGINT REFERENCES properties(id) ON DELETE CASCADE,
    url TEXT NOT NULL,
    sort_order INT DEFAULT 0
);

-- 2.5 Favorites
CREATE TABLE favorites (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT REFERENCES users(id) ON DELETE CASCADE,
    property_id BIGINT REFERENCES properties(id) ON DELETE CASCADE,
    UNIQUE (user_id, property_id)
);

-- 2.6 Contact Logs
CREATE TABLE contact_logs (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT REFERENCES users(id) ON DELETE SET NULL,
    property_id BIGINT REFERENCES properties(id) ON DELETE CASCADE,
    method VARCHAR(20) CHECK (method IN ('call','whatsapp')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2.7 Reports
CREATE TABLE reports (
    id BIGSERIAL PRIMARY KEY,
    property_id BIGINT REFERENCES properties(id) ON DELETE CASCADE,
    user_id BIGINT REFERENCES users(id) ON DELETE SET NULL,
    reason TEXT,
    status VARCHAR(20) DEFAULT 'open'
        CHECK (status IN ('open','resolved')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2.8 System Settings
CREATE TABLE system_settings (
    key VARCHAR(100) PRIMARY KEY,
    value TEXT
);

-- 3. Indexes
CREATE INDEX idx_properties_city ON properties(city);
CREATE INDEX idx_properties_district ON properties(district);
CREATE INDEX idx_properties_category ON properties(category);
CREATE INDEX idx_properties_price ON properties(price);
CREATE INDEX idx_properties_type ON properties(type);
CREATE INDEX idx_properties_status ON properties(status);
CREATE INDEX idx_properties_owner ON properties(owner_id);
CREATE INDEX idx_properties_created_at ON properties(created_at DESC);

CREATE INDEX idx_property_images_property ON property_images(property_id);
CREATE INDEX idx_favorites_user ON favorites(user_id);
CREATE INDEX idx_contact_logs_property ON contact_logs(property_id);
CREATE INDEX idx_reports_property ON reports(property_id);

-- 4. Seed Data
INSERT INTO system_settings (key, value) VALUES
('AUTO_APPROVE_LISTINGS', 'false'),
('MAX_LISTINGS_PER_DAY', '5'),
('REQUIRE_PHONE_VERIFICATION', 'true');
