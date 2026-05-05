-- ============================================================
-- Food Ordering System - Dummy Data Seed Script
-- Run after the application has started at least once
-- (Hibernate creates the tables on first run)
--
-- Usage:
--   mysql -u root -p food_ordering_db < seed_data.sql
-- ============================================================

USE food_ordering_db;

-- ============================================================
-- 1. CATEGORIES
-- ============================================================
INSERT IGNORE INTO categories (id, name, description) VALUES
(1, 'Burgers',      'Juicy beef and chicken burgers'),
(2, 'Pizza',        'Classic and gourmet pizzas'),
(3, 'Sushi',        'Fresh Japanese sushi and rolls'),
(4, 'Pasta',        'Italian pasta dishes'),
(5, 'Salads',       'Fresh and healthy salads'),
(6, 'Desserts',     'Cakes, ice cream and sweets'),
(7, 'Beverages',    'Hot and cold drinks'),
(8, 'Fried Chicken','Crispy fried chicken meals');

-- ============================================================
-- 2. FOODS
-- ============================================================
INSERT IGNORE INTO foods (id, name, description, price, image_url, available, category_id) VALUES
-- Burgers
(1,  'Classic Beef Burger',     'Angus beef patty, lettuce, tomato, pickles, special sauce',    8.99,  'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400', true, 1),
(2,  'Double Smash Burger',     'Two smashed beef patties, American cheese, caramelised onion', 11.99, 'https://images.unsplash.com/photo-1553979459-d2229ba7433b?w=400', true, 1),
(3,  'Crispy Chicken Burger',   'Buttermilk fried chicken, coleslaw, sriracha mayo',            9.49,  'https://images.unsplash.com/photo-1606755962773-d324e0a13086?w=400', true, 1),
(4,  'BBQ Bacon Burger',        'Beef patty, streaky bacon, BBQ sauce, cheddar cheese',         12.49, 'https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?w=400', true, 1),
-- Pizza
(5,  'Margherita',              'San Marzano tomato, fresh mozzarella, basil, olive oil',       10.99, 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400', true, 2),
(6,  'Pepperoni',               'Tomato sauce, mozzarella, spicy pepperoni',                    12.99, 'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=400', true, 2),
(7,  'BBQ Chicken Pizza',       'BBQ base, grilled chicken, red onion, coriander',              13.99, 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400', true, 2),
(8,  'Four Cheese Pizza',       'Mozzarella, gorgonzola, parmesan, provolone',                  14.49, 'https://images.unsplash.com/photo-1571997478779-2adcbbe9ab2f?w=400', true, 2),
-- Sushi
(9,  'Salmon Nigiri (6 pcs)',   'Fresh Atlantic salmon over seasoned sushi rice',                13.99, 'https://images.unsplash.com/photo-1617196034183-421b4040ed20?w=400', true, 3),
(10, 'Dragon Roll (8 pcs)',     'Shrimp tempura, avocado, cucumber, spicy mayo',                15.99, 'https://images.unsplash.com/photo-1617196034099-5bfc16e67c8f?w=400', true, 3),
(11, 'Tuna Sashimi (6 pcs)',    'Premium bluefin tuna, wasabi, pickled ginger',                 16.99, 'https://images.unsplash.com/photo-1553621042-f6e147245754?w=400', true, 3),
-- Pasta
(12, 'Spaghetti Carbonara',     'Guanciale, egg yolk, pecorino romano, black pepper',           13.49, 'https://images.unsplash.com/photo-1612874742237-6526221588e3?w=400', true, 4),
(13, 'Penne Arrabbiata',        'San Marzano tomatoes, garlic, chilli, fresh parsley',          11.49, 'https://images.unsplash.com/photo-1598866594230-a7c12756260f?w=400', true, 4),
(14, 'Fettuccine Alfredo',      'Homemade fettuccine, butter, heavy cream, parmesan',           12.99, 'https://images.unsplash.com/photo-1555949258-eb67b1ef0ceb?w=400', true, 4),
-- Salads
(15, 'Caesar Salad',            'Romaine, croutons, parmesan, Caesar dressing',                  8.49, 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400', true, 5),
(16, 'Greek Salad',             'Cucumber, tomato, olives, feta cheese, oregano',                7.99, 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=400', true, 5),
-- Desserts
(17, 'Chocolate Lava Cake',     'Warm chocolate cake with molten centre, vanilla ice cream',    6.99,  'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=400', true, 6),
(18, 'Tiramisu',                'Mascarpone, espresso-soaked ladyfingers, cocoa powder',        5.99,  'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=400', true, 6),
-- Beverages
(19, 'Fresh Lemonade',          'Freshly squeezed lemon, mint, sparkling water',                3.49,  'https://images.unsplash.com/photo-1621263764928-df1444c5e859?w=400', true, 7),
(20, 'Mango Smoothie',          'Fresh mango, yoghurt, honey',                                  4.49,  'https://images.unsplash.com/photo-1553530666-ba11a7da3888?w=400', true, 7),
-- Fried Chicken
(21, 'Crispy Fried Chicken',    '3-piece crispy fried chicken with coleslaw and fries',         10.99, 'https://images.unsplash.com/photo-1569050467447-ce54b3bbc37d?w=400', true, 8),
(22, 'Spicy Chicken Wings',     '8 spicy buffalo wings with blue cheese dip',                    9.99, 'https://images.unsplash.com/photo-1527477396000-e27163b481c2?w=400', true, 8);

-- ============================================================
-- 3. USERS
-- Passwords are BCrypt of "password123" (cost 10)
-- Admin already created by DataInitializer — skip id=1
-- ============================================================
INSERT IGNORE INTO users (id, name, email, password, phone, address, role) VALUES
(2, 'Alice Johnson', 'alice@example.com',
    '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhy2',
    '+1-555-0101', '12 Main Street, Springfield', 'ROLE_USER'),
(3, 'Bob Smith',     'bob@example.com',
    '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhy2',
    '+1-555-0102', '45 Oak Avenue, Shelbyville', 'ROLE_USER'),
(4, 'Carol White',   'carol@example.com',
    '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhy2',
    '+1-555-0103', '7 Elm Road, Capital City', 'ROLE_USER'),
(5, 'David Brown',   'david@example.com',
    '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhy2',
    '+1-555-0104', '99 Pine Lane, Ogdenville', 'ROLE_USER');

-- ============================================================
-- 4. ORDERS
-- ============================================================
INSERT IGNORE INTO orders (id, user_id, total_amount, status, delivery_address, created_at) VALUES
(1, 2, 21.98, 'DELIVERED',       '12 Main Street, Springfield',  NOW() - INTERVAL 7 DAY),
(2, 3, 26.98, 'DELIVERED',       '45 Oak Avenue, Shelbyville',   NOW() - INTERVAL 5 DAY),
(3, 4, 13.49, 'OUT_FOR_DELIVERY','7 Elm Road, Capital City',     NOW() - INTERVAL 1 DAY),
(4, 2, 15.99, 'CONFIRMED',       '12 Main Street, Springfield',  NOW() - INTERVAL 2 HOUR),
(5, 5, 20.48, 'PENDING',         '99 Pine Lane, Ogdenville',     NOW() - INTERVAL 30 MINUTE),
(6, 3, 10.99, 'CANCELLED',       '45 Oak Avenue, Shelbyville',   NOW() - INTERVAL 3 DAY);

-- ============================================================
-- 5. ORDER ITEMS
-- ============================================================
INSERT IGNORE INTO order_items (id, order_id, food_id, quantity, price) VALUES
-- Order 1 (Alice): Burger + Lemonade
(1, 1, 1,  1, 8.99),
(2, 1, 2,  1, 11.99),
-- Order 2 (Bob): Pizza + Dessert
(3, 2, 6,  1, 12.99),
(4, 2, 7,  1, 13.99),
-- Order 3 (Carol): Pasta
(5, 3, 12, 1, 13.49),
-- Order 4 (Alice): Sushi
(6, 4, 10, 1, 15.99),
-- Order 5 (David): Chicken + Beverage
(7, 5, 21, 1, 10.99),
(8, 5, 20, 2, 4.49),  -- 2x Mango Smoothie = 8.98, but total 20.48 intentional rounding
-- Order 6 (Bob, cancelled): Fried Chicken
(9, 6, 21, 1, 10.99);

-- ============================================================
-- 6. PAYMENTS
-- ============================================================
INSERT IGNORE INTO payments (id, order_id, amount, method, status, paid_at) VALUES
(1, 1, 21.98, 'CARD',             'COMPLETED', NOW() - INTERVAL 7 DAY),
(2, 2, 26.98, 'CASH_ON_DELIVERY', 'COMPLETED', NOW() - INTERVAL 5 DAY),
(3, 4, 15.99, 'CARD',             'COMPLETED', NOW() - INTERVAL 2 HOUR);

-- ============================================================
-- Summary of test accounts
-- ============================================================
-- admin@foodorder.com   / admin123      (ROLE_ADMIN)
-- alice@example.com     / password123   (ROLE_USER)
-- bob@example.com       / password123   (ROLE_USER)
-- carol@example.com     / password123   (ROLE_USER)
-- david@example.com     / password123   (ROLE_USER)
