# Users

## GET /users
> Danh sách tất cả users (admin only)

headers:
  Authorization: required

query:
  page: number, default(1)
  limit: number, default(20), max(100)
  search: string

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
