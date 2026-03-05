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
