# Auth

## POST /auth/login
> Đăng nhập và nhận JWT token

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
