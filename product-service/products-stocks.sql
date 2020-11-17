create extension if not exists "uuid-ossp";

create table if not exists products (
	id uuid primary key default uuid_generate_v4(),
	title text not null,
	description text,
	price integer
);

create table if not exists stocks (
	product_id uuid references products (id),
	count integer
);

insert into products (title, description, price) values 
('Product 1', 'Product description 1', 5),
('Product 2', 'Product description 2', 10),
('Product 3', 'Product description 3', 15),
('Product 4', 'Product description 4', 25),
('Product 5', 'Product description 5', 24),
('Product 6', 'Product description 6', 77),
('Product 7', 'Product description 7', 2),
('Product 8', 'Product description 8', 15),
('Product 9', 'Product description 9', 68),
('Product 10', 'Product description 10', 51);

insert into stocks (product_id, count) values
('add144dc-8569-4af0-8f52-45c645ed26ae', 10),
('77de79a2-2ee6-42e4-9301-7dad888e74b5', 10),
('91a40e0f-f3ad-467a-bc1a-34db3660b54a', 10),
('68681153-d54b-4108-a449-c5827a087e54', 10),
('5af5ddb6-0c7e-4713-8703-2375fba82efd', 10),
('55a803ea-1ccb-40be-b11b-1dd4c2026dc8', 10),
('e613dd20-2001-42ef-a5c6-d52f89f15279', 10),
('1538eec5-d0b8-45bc-bf12-38c6806f0d9d', 10),
('32d198fe-ff55-4f24-a0ff-c90830de1f50', 10),
('6243d1cd-b2b4-4634-bbaf-8998d1bf191f', 10);