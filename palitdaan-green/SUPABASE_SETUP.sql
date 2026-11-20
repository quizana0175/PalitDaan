-- ==========================================================
-- PALITDAAN GREEN - SUPABASE POSTGRESQL SCHEMA
-- Ready for copy-pasting into the Supabase SQL Editor
-- ==========================================================

-- 1. PROFILES / USERS TABLE
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id TEXT UNIQUE NOT NULL,
    full_name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    role TEXT NOT NULL DEFAULT 'student' CHECK (role IN ('student', 'faculty', 'staff', 'admin')),
    department TEXT DEFAULT 'College of Computer Studies',
    mobile TEXT,
    dietary_notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. MENU ITEMS / INVENTORY TABLE
CREATE TABLE IF NOT EXISTS public.menu_items (
    id BIGSERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    price NUMERIC(10,2) NOT NULL,
    description TEXT,
    image_url TEXT,
    rating TEXT DEFAULT '4.8',
    calories TEXT,
    is_sold_out BOOLEAN DEFAULT false NOT NULL,
    stock_count INTEGER DEFAULT 20 NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. ORDERS TABLE
CREATE TABLE IF NOT EXISTS public.orders (
    id TEXT PRIMARY KEY, -- e.g. #PDG-101
    user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    customer_name TEXT NOT NULL,
    total_amount NUMERIC(10,2) NOT NULL,
    status TEXT NOT NULL DEFAULT 'Pending Payment' 
        CHECK (status IN ('Pending Payment', 'Paid', 'Being Prepared', 'Ready for Pickup', 'Completed', 'Cancelled')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. ORDER ITEMS BREAKDOWN TABLE
CREATE TABLE IF NOT EXISTS public.order_items (
    id BIGSERIAL PRIMARY KEY,
    order_id TEXT REFERENCES public.orders(id) ON DELETE CASCADE NOT NULL,
    menu_item_id BIGINT REFERENCES public.menu_items(id) ON DELETE SET NULL,
    food_name TEXT NOT NULL,
    unit_price NUMERIC(10,2) NOT NULL,
    quantity INTEGER NOT NULL DEFAULT 1,
    comment TEXT,
    allergens TEXT[] DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- -------------------------------------------------------------
-- SEED INITIAL MENU DATA
-- -------------------------------------------------------------
INSERT INTO public.menu_items (name, category, price, description, image_url, calories, is_sold_out, stock_count)
VALUES
('Classic Cheeseburger', 'Burgers & Sandwiches', 85.00, 'Juicy beef patty with melted cheese, fresh crisp lettuce, and ripe tomatoes in a toasted sesame bun.', 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=600&q=80', '450 kcal', false, 25),
('Spicy Fried Chicken Meal', 'Rice Meals', 110.00, 'Crispy, golden-brown spiced fried chicken seasoned with secret herb glaze, served with warm rice and gravy.', 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?auto=format&fit=crop&w=600&q=80', '580 kcal', false, 30),
('Fresh Mango Graham Shake', 'Beverages & Shakes', 65.00, 'Fresh Carabao mango smoothie layered with sweet cream and crushed honey graham crackers.', 'https://images.unsplash.com/photo-1546173159-315724a31696?auto=format&fit=crop&w=600&q=80', '320 kcal', false, 15),
('Sizzling Pork Sisig Combo', 'Rice Meals', 130.00, 'Savory minced pork with calamansi, chili, creamy dressing, sunny-side-up egg, and aromatic garlic rice.', 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=600&q=80', '620 kcal', false, 20),
('Savory Spaghetti Bolognese', 'Pasta & Noodles', 95.00, 'Al dente pasta tossed in rich sweet-savory beef bolognese sauce topped with generous grated cheddar.', 'https://images.unsplash.com/photo-1622973536968-3ead9e780960?auto=format&fit=crop&w=600&q=80', '510 kcal', false, 18),
('Halo-Halo Fiesta Special', 'Desserts', 80.00, 'Shaved ice with ube halaya, leche flan, sweet beans, nata de coco, pinipig, and creamy evaporated milk.', 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?auto=format&fit=crop&w=600&q=80', '380 kcal', false, 12),
('Pork BBQ Skewers (2pcs)', 'Snacks & Grills', 75.00, 'Tender grilled pork skewers basted with sweet and tangy Filipino-style barbecue marinade glaze.', 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=600&q=80', '410 kcal', false, 25),
('Creamy Buko Pandan Salad', 'Desserts', 55.00, 'Refreshing young coconut ribbons with pandan-infused jelly cubes in rich sweetened cream.', 'https://images.unsplash.com/photo-1505252585461-04db1eb84625?auto=format&fit=crop&w=600&q=80', '290 kcal', false, 10)
ON CONFLICT DO NOTHING;

-- -------------------------------------------------------------
-- ROW LEVEL SECURITY (RLS) POLICIES
-- -------------------------------------------------------------
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.menu_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

-- Allow public read of menu items
CREATE POLICY "Public can view menu items" ON public.menu_items
    FOR SELECT USING (true);

-- Allow authenticated users / admins full access
CREATE POLICY "Full access to orders for authenticated users" ON public.orders
    FOR ALL USING (true);

CREATE POLICY "Full access to order items" ON public.order_items
    FOR ALL USING (true);
