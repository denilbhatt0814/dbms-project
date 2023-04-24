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
