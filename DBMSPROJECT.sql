create database dbmsproject;
use dbmsproject;

CREATE TABLE Category (
    category_id INT AUTO_INCREMENT PRIMARY KEY,
    category_name VARCHAR(255) NOT NULL
);

CREATE TABLE Supplier (
    supplier_id INT AUTO_INCREMENT PRIMARY KEY,
    company_name VARCHAR(255) NOT NULL,
    contact_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(20) NOT NULL
);

CREATE TABLE Product (
    product_id INT AUTO_INCREMENT PRIMARY KEY,
    category_id INT,
    supplier_id INT,
    product_name VARCHAR(255) NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    description TEXT,
    FOREIGN KEY (category_id) REFERENCES Category(category_id),
    FOREIGN KEY (supplier_id) REFERENCES Supplier(supplier_id)
);

CREATE TABLE Customer (
    customer_id INT AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(20) NOT NULL
);

CREATE TABLE Employee (
    employee_id INT AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    position VARCHAR(255) NOT NULL
);

CREATE TABLE Bill (
    bill_id INT AUTO_INCREMENT PRIMARY KEY,
    customer_id INT,
    employee_id INT,
    date DATE NOT NULL,
    total_amount DECIMAL(10, 2) NOT NULL,
    FOREIGN KEY (customer_id) REFERENCES Customer(customer_id),
    FOREIGN KEY (employee_id) REFERENCES Employee(employee_id)
);

CREATE TABLE Bill_Product (
    bill_id INT,
    product_id INT,
    quantity INT NOT NULL,
    PRIMARY KEY (bill_id, product_id),
    FOREIGN KEY (bill_id) REFERENCES Bill(bill_id),
    FOREIGN KEY (product_id) REFERENCES Product(product_id)
);

CREATE TABLE Inventory (
    product_id INT PRIMARY KEY,
    quantity INT NOT NULL,
    FOREIGN KEY (product_id) REFERENCES Product(product_id)
);

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

use dbms_project;
SELECT * FROM Product;

ALTER TABLE Product ADD column quantity int;
select * from Product;

update Product
set quantity = (
	select quantity from Inventory where Inventory.product_id = product.product_id
);

drop table Inventory;

ALTER TABLE Product 
rename column price to retail_price;

alter table Product add column cost_price decimal(10,2);
update Product
set cost_price = retail_price - (retail_price * 0.1);
