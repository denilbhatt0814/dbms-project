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