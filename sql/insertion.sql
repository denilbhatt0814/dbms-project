INSERT INTO Category (category_name) VALUES
('Electronics'),
('Groceries'),
('Clothing'),
('Home & Kitchen');

INSERT INTO Supplier (company_name, contact_name, email, phone) VALUES
('Electronics Corp', 'John Smith', 'john@electronicscorp.com', '555-123-4567'),
('Grocery Wholesalers', 'Jane Doe', 'jane@grocerywholesalers.com', '555-987-6543'),
('Clothing Co', 'William Johnson', 'william@clothingco.com', '555-555-1212'),
('Home & Kitchen Supplies', 'Emma Wilson', 'emma@homekitchensupplies.com', '555-555-0000');

INSERT INTO Product (category_id, supplier_id, product_name, price, description) VALUES
(1, 1, 'Laptop', 999.99, 'High-performance laptop with 16GB RAM and 512GB SSD'),
(1, 1, 'Smartphone', 799.99, 'Latest smartphone with a high-resolution camera and long-lasting battery'),
(2, 2, 'Milk', 3.49, 'Gallon of whole milk'),
(2, 2, 'Bread', 2.99, 'Loaf of whole wheat bread'),
(3, 3, 'T-shirt', 14.99, 'Cotton T-shirt with a round neck'),
(3, 3, 'Jeans', 39.99, 'Slim-fit jeans made with high-quality denim'),
(4, 4, 'Cookware Set', 89.99, '10-piece non-stick cookware set'),
(4, 4, 'Dinnerware Set', 119.99, '16-piece ceramic dinnerware set');

INSERT INTO Customer (first_name, last_name, email, phone) VALUES
('Alice', 'Brown', 'alice.brown@email.com', '555-111-2222'),
('Bob', 'Johnson', 'bob.johnson@email.com', '555-333-4444'),
('Charlie', 'Lee', 'charlie.lee@email.com', '555-555-6666'),
('David', 'Smith', 'david.smith@email.com', '555-777-8888');

INSERT INTO Employee (first_name, last_name, email, phone, position) VALUES
('Ella', 'Garcia', 'ella.garcia@email.com', '555-101-2020', 'Cashier'),
('Frank', 'Hernandez', 'frank.hernandez@email.com', '555-303-4040', 'Manager'),
('Grace', 'Martinez', 'grace.martinez@email.com', '555-505-6060', 'Stock Clerk'),
('Henry', 'White', 'henry.white@email.com', '555-707-8080', 'Cashier');

INSERT INTO Bill (customer_id, employee_id, date, total_amount) VALUES
(1, 1, '2023-01-01', 45.98),
(2, 1, '2023-01-02', 26.98),
(3, 2, '2023-01-03', 54.98),
(4, 2, '2023-01-04', 129.99),
(1, 1, '2023-01-05', 164.98),
(2, 1, '2023-01-06', 84.98),
(3, 2, '2023-01-07', 102.98),
(4, 2, '2023-01-08', 19.98);

INSERT INTO Bill_Product (bill_id, product_id, quantity) VALUES
(1, 3, 2),
(1, 4, 1),
(2, 3, 1),
(2, 4, 1),
(3, 5, 1),
(3, 6, 1),
(4, 7, 1),
(5, 1, 1),
(5, 2, 1),
(6, 5, 2),
(6, 6, 1),
(7, 1, 1),
(7, 3, 3),
(8, 4, 2);

INSERT INTO Inventory (product_id, quantity) VALUES
(1, 10),
(2, 15),
(3, 50),
(4, 40),
(5, 25),
(6, 30),
(7, 20),
(8, 20);