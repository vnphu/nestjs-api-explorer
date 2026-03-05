# Products

## GET /products
> Danh sách sản phẩm (public)

query:
  page: number, default(1)
  limit: number, default(20)
  search: string
  minPrice: number, min(0)
  maxPrice: number

## GET /products/:id
> Chi tiết sản phẩm

params:
  id: string, required

## GET /products/:id/reviews
> Danh sách đánh giá của sản phẩm

params:
  id: string, required

query:
  page: number, default(1)
  limit: number, default(10)

## POST /products
> Tạo sản phẩm mới

headers:
  Authorization: required

body:
  name: string, required, minLength(2), maxLength(200)
  price: number, required, min(0)
  description: string, maxLength(2000)
  stock: number, min(0)

## PUT /products/:id
> Cập nhật sản phẩm

params:
  id: string, required

headers:
  Authorization: required

body:
  name: string, minLength(2)
  price: number, min(0)

## DELETE /products/:id
> Xoá sản phẩm

params:
  id: string, required

headers:
  Authorization: required
