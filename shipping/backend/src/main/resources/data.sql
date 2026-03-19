INSERT INTO products (id, name, brand, category, condition_note, price, currency, status, description)
VALUES (1, 'French Door Refrigerator', 'Samsung', 'Refrigerator', 'New', 8500.00, 'GHS', 'AVAILABLE', 'Imported French door fridge, like new.');

INSERT INTO products (id, name, brand, category, condition_note, price, currency, status, description)
VALUES (2, '65-inch Smart TV', 'LG', 'Television', 'New', 6200.00, 'GHS', 'AVAILABLE', '4K UHD Smart TV.');

INSERT INTO products (id, name, brand, category, condition_note, price, currency, status, description)
VALUES (3, 'Queen Mattress', 'Sealy', 'Mattress', 'New', 1800.00, 'GHS', 'AVAILABLE', 'Supportive queen-size mattress.');

INSERT INTO product_images (product_id, image_url) VALUES
 (1, 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b'),
 (1, 'https://images.unsplash.com/photo-1581579188871-45ea61f2a0c8'),
 (2, 'https://images.unsplash.com/photo-1584433304891-8c89e44a0b1a'),
 (2, 'https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04'),
 (3, 'https://images.unsplash.com/photo-1582719478181-2f2df43fb89b'),
 (3, 'https://images.unsplash.com/photo-1616594039964-8c127bc8d4c2');

-- Ensure new inserts do not collide with seeded IDs in local H2.
ALTER TABLE products ALTER COLUMN id RESTART WITH 1000;
