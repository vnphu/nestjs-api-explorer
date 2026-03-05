# Auth

## POST /auth/login
> Đăng nhập và nhận JWT token
> Không cần xác thực trước

body:
  email: string, required, isEmail
  password: string, required, minLength(6)

response:
  token: string

## POST /auth/register
> Đăng ký tài khoản mới

body:
  name: string, required, minLength(2), maxLength(50)
  email: string, required, isEmail
  password: string, required, minLength(8)

## GET /auth/me
> Lấy thông tin user đang đăng nhập

headers:
  Authorization: required, Bearer {token}

response:
  id: string
  email: string
  name: string

---

# Users

## GET /users
> Danh sách tất cả users (admin only)

headers:
  Authorization: required

query:
  page: number, default(1)
  limit: number, default(20), max(100)
  search: string, tìm theo tên hoặc email

## GET /users/:id
> Lấy thông tin một user

params:
  id: string, required

headers:
  Authorization: required

## POST /users
> Tạo user mới

headers:
  Authorization: required

body:
  name: string, required
  email: string, required, isEmail
  password: string, required, minLength(8)

## PUT /users/:id
> Cập nhật thông tin user

params:
  id: string, required

headers:
  Authorization: required

body:
  name: string, minLength(2)
  email: string, isEmail

## DELETE /users/:id
> Xoá user

params:
  id: string, required

headers:
  Authorization: required

---

# Products

## GET /products
> Danh sách sản phẩm (public)

query:
  page: number, default(1)
  limit: number, default(20)
  search: string
  minPrice: number, min(0)
  maxPrice: number
  inStock: boolean

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
  isActive: boolean
  tags: array

## PUT /products/:id
> Cập nhật sản phẩm

params:
  id: string, required

headers:
  Authorization: required

body:
  name: string, minLength(2)
  price: number, min(0)
  description: string
  stock: number, min(0)
  isActive: boolean

## DELETE /products/:id
> Xoá sản phẩm

params:
  id: string, required

headers:
  Authorization: required

---

# Orders

## GET /orders
> Danh sách đơn hàng của user hiện tại

headers:
  Authorization: required

query:
  page: number, default(1)
  limit: number, default(20)
  status: string, isIn(pending,processing,shipped,delivered,cancelled)

## POST /orders
> Đặt hàng mới

headers:
  Authorization: required

body:
  productId: string, required
  quantity: number, required, min(1)
  address: string, required
  note: string, maxLength(500)
  couponCode: string

response:
  orderId: string
  status: string
  total: number

## GET /orders/:orderId
> Chi tiết đơn hàng

params:
  orderId: string, required

headers:
  Authorization: required

## PUT /orders/:orderId/status
> Cập nhật trạng thái đơn hàng (admin)

params:
  orderId: string, required

headers:
  Authorization: required

body:
  status: string, required, isIn(processing,shipped,delivered,cancelled)
  note: string
