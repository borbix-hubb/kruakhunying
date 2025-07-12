-- Create menu_categories table
CREATE TABLE menu_categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE,
    slug VARCHAR(50) NOT NULL UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Create menu_items table
CREATE TABLE menu_items (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    category_id INTEGER REFERENCES menu_categories(id),
    is_popular BOOLEAN DEFAULT FALSE,
    is_recommended BOOLEAN DEFAULT FALSE,
    is_hot BOOLEAN DEFAULT FALSE,
    is_available BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Create customers table
CREATE TABLE customers (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    dorm VARCHAR(50),
    room VARCHAR(20),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Create orders table
CREATE TABLE orders (
    id SERIAL PRIMARY KEY,
    order_number VARCHAR(20) UNIQUE NOT NULL,
    customer_id INTEGER REFERENCES customers(id),
    total_amount DECIMAL(10, 2) NOT NULL,
    status VARCHAR(20) DEFAULT 'pending', -- pending, preparing, completed, cancelled
    payment_method VARCHAR(20), -- promptpay, cash
    payment_status VARCHAR(20) DEFAULT 'pending', -- pending, paid
    note TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Create order_items table
CREATE TABLE order_items (
    id SERIAL PRIMARY KEY,
    order_id INTEGER REFERENCES orders(id) ON DELETE CASCADE,
    menu_item_id INTEGER REFERENCES menu_items(id),
    quantity INTEGER NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    subtotal DECIMAL(10, 2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Create admin_users table
CREATE TABLE admin_users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(100),
    role VARCHAR(50) DEFAULT 'admin',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    last_login TIMESTAMP WITH TIME ZONE
);

-- Insert initial categories
INSERT INTO menu_categories (name, slug) VALUES
    ('ข้าว', 'rice'),
    ('เส้น', 'noodle'),
    ('กับข้าว', 'sidedish'),
    ('เครื่องดื่ม', 'drink');

-- Insert sample menu items
INSERT INTO menu_items (name, description, price, category_id, is_popular, is_recommended, is_hot) VALUES
    ('ข้าวผัดกุ้ง', 'ข้าวผัดกุ้งสด หอมกระเทียม พริกไทย', 50, 1, FALSE, FALSE, TRUE),
    ('ข้าวผัดหมู', 'ข้าวผัดหมูนุ่ม ใส่ไข่ดาว อร่อยมาก', 45, 1, TRUE, FALSE, FALSE),
    ('ข้าวผัดไก่', 'ข้าวผัดไก่ หอมพริกไทย กลมกล่อม', 45, 1, FALSE, FALSE, FALSE),
    ('ข้าวผัดปู', 'ข้าวผัดปู เนื้อปูแน่นๆ หอมมัน', 55, 1, FALSE, TRUE, FALSE),
    ('ข้าวผัดผัก', 'ข้าวผัดผักรวม สำหรับมังสวิรัติ สุขภาพดี', 40, 1, FALSE, FALSE, FALSE),
    ('ผัดไทยกุ้งสด', 'ผัดไทยกุ้งสด รสชาติต้นตำรับ', 45, 2, TRUE, FALSE, FALSE),
    ('ผัดซีอิ๊วหมู', 'เส้นใหญ่ผัดซีอิ๊ว หมูนุ่ม', 40, 2, FALSE, FALSE, FALSE),
    ('ราดหน้าหมู', 'ราดหน้าเส้นใหญ่ น้ำข้นกำลังดี', 45, 2, FALSE, FALSE, FALSE),
    ('บะหมี่แห้ง', 'บะหมี่แห้งหมูแดง กรอบนอกนุ่มใน', 35, 2, FALSE, FALSE, FALSE),
    ('ก๋วยเตี๋ยวต้มยำ', 'ต้มยำน้ำข้น รสจัดจ้าน', 40, 2, FALSE, FALSE, TRUE),
    ('ไก่ทอดกระเทียม', 'ไก่ทอดกรอบ หอมกระเทียม', 50, 3, FALSE, TRUE, FALSE),
    ('หมูกรอบคั่วพริกเกลือ', 'หมูกรอบ คั่วพริกเกลือ', 55, 3, FALSE, FALSE, TRUE),
    ('ผัดกะเพราหมูสับ', 'กะเพราหมูสับ ใบกะเพราหอม', 45, 3, TRUE, FALSE, TRUE),
    ('ต้มยำกุ้ง', 'ต้มยำกุ้งน้ำข้น รสชาติจัดจ้าน', 60, 3, FALSE, TRUE, TRUE),
    ('ยำวุ้นเส้น', 'ยำวุ้นเส้น รสชาติกลมกล่อม', 35, 3, FALSE, FALSE, FALSE),
    ('ชาเย็น', 'ชาเย็นหวานมัน', 25, 4, TRUE, FALSE, FALSE),
    ('กาแฟเย็น', 'กาแฟเย็นหอมมัน', 25, 4, FALSE, FALSE, FALSE),
    ('น้ำส้ม', 'น้ำส้มคั้นสด', 20, 4, FALSE, FALSE, FALSE),
    ('โค้ก', 'โค้กเย็นๆ', 15, 4, FALSE, FALSE, FALSE),
    ('น้ำเปล่า', 'น้ำเปล่าเย็น', 10, 4, FALSE, FALSE, FALSE);

-- Create indexes for better performance
CREATE INDEX idx_menu_items_category ON menu_items(category_id);
CREATE INDEX idx_orders_customer ON orders(customer_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_order_items_order ON order_items(order_id);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc', NOW());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_menu_items_updated_at BEFORE UPDATE ON menu_items
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();