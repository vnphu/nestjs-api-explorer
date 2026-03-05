# @vnphu/nestjs-api-explorer

An in-app API explorer for NestJS — like Postman, but embedded directly into your application. Auto-discovers your routes from the Express router and lets you document them with a simple Markdown file.

## Features

- **Route auto-discovery** — scans the live Express router, no decorators needed
- **Markdown docs** — document body fields, query params, headers, and responses in a simple `.md` file or a folder of `.md` files
- **Full request builder** — path params, query params, headers, auth, and body
- **Global auth** — set Bearer Token / Basic Auth / API Key once, applies to all requests
- **Body types** — JSON (with formatter), Form-encoded, Plain text
- **Response viewer** — syntax-highlighted JSON, status badge, timing, response headers
- **Route grouping** — groups defined in your docs file, with collapse/expand
- **Auto-disabled in production** — `NODE_ENV=production` disables the explorer automatically

## Installation

```bash
npm install @vnphu/nestjs-api-explorer
```

## Quick Start

### 1. Import the module

```typescript
import { ApiExplorerModule } from '@vnphu/nestjs-api-explorer';

@Module({
  imports: [
    ApiExplorerModule.register({
      path: 'api-explorer',   // serves UI at /api-explorer
      title: 'My API',
      docsFile: './api-explorer.md',  // optional but recommended
    }),
  ],
})
export class AppModule {}
```

Open your browser at `http://localhost:3000/api-explorer`.

---

## Documenting your API (Markdown)

### Option A — Single file

Point `docsFile` to a `.md` file anywhere in your project:

```typescript
ApiExplorerModule.register({
  docsFile: './api-explorer.md',
})
```

### Option B — Folder of files

Point `docsFolder` to a directory. All `.md` files inside (including subfolders) are scanned and merged automatically:

```typescript
ApiExplorerModule.register({
  docsFolder: './docs',
})
```

Example folder structure:

```
docs/
├── auth.md
├── users.md
└── shop/
    ├── products.md
    └── orders.md
```

Each file follows the same markdown syntax. Routes from all files are merged into one map. If two files define the same `METHOD /path`, the last file read wins.

---

### Full example

### Full example

```markdown
# Auth

## POST /auth/login
> Đăng nhập và nhận JWT token

body:
  email: string, required, isEmail
  password: string, required, minLength(6)

response:
  token: string
  expiresIn: number

## POST /auth/register
> Đăng ký tài khoản mới

body:
  name: string, required, minLength(2), maxLength(50)
  email: string, required, isEmail
  password: string, required, minLength(8)
  role: string, isIn(admin,user,guest)

## GET /auth/me
> Lấy thông tin user hiện tại

headers:
  Authorization: required, Bearer {token}

response:
  id: string
  email: string
  name: string

---

# Users

## GET /users
> Danh sách users (admin only)

headers:
  Authorization: required

query:
  page: number, default(1)
  limit: number, default(20), max(100)
  search: string, tìm theo tên hoặc email
  role: string, isIn(admin,user,guest)
  sortBy: string, isIn(name,email,createdAt)
  sortOrder: string, isIn(asc,desc)

## GET /users/:id
> Lấy thông tin một user

params:
  id: string, required, MongoDB ObjectId

headers:
  Authorization: required

## POST /users
> Tạo user mới

headers:
  Authorization: required

body:
  name: string, required, minLength(2)
  email: string, required, isEmail
  password: string, required, minLength(8)
  role: string, required, isIn(admin,user,guest)
  isActive: boolean

## PUT /users/:id
> Cập nhật user

params:
  id: string, required

headers:
  Authorization: required

body:
  name: string, minLength(2)
  email: string, isEmail
  role: string, isIn(admin,user,guest)
  isActive: boolean

## DELETE /users/:id
> Xoá user (không thể hoàn tác)

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
> Danh sách đánh giá

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
  category: string, required
  stock: number, min(0)
  isActive: boolean
  tags: array
  meta: object

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
> Danh sách đơn hàng

headers:
  Authorization: required

query:
  page: number, default(1)
  limit: number, default(20)
  status: string, isIn(pending,processing,shipped,delivered,cancelled)
  from: string, ISO date string
  to: string, ISO date string

## POST /orders
> Đặt hàng

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
> Cập nhật trạng thái (admin)

params:
  orderId: string, required

headers:
  Authorization: required

body:
  status: string, required, isIn(processing,shipped,delivered,cancelled)
  note: string

## DELETE /orders/:orderId
> Huỷ đơn hàng

params:
  orderId: string, required

headers:
  Authorization: required
```

---

## Markdown syntax reference

### Structure

| Syntax | Meaning |
|--------|---------|
| `# Group Name` | Route group — shown as a collapsible section in the sidebar |
| `## METHOD /path` | Route definition. METHOD = GET, POST, PUT, PATCH, DELETE, OPTIONS, HEAD |
| `> Description text` | Route description. Multiple `>` lines are joined with newline |
| `body:` | Start of body fields section |
| `query:` | Start of query params section |
| `params:` | Start of path params section |
| `headers:` | Start of required headers section |
| `response:` | Start of response fields section |
| `---` | Visual separator (ignored by parser) |

### Field syntax

Each field must be **indented** (at least one space or tab) under its section header:

```
  fieldName: type, rule1, rule2, description text
```

**Type** (first token after `:`) — optional, one of:

| Type | Meaning |
|------|---------|
| `string` | Text value |
| `number` | Numeric value |
| `boolean` | `true` or `false` |
| `array` | JSON array |
| `object` | JSON object |

**Built-in rules** (recognized and highlighted):

| Rule | Example |
|------|---------|
| `required` | Field is required |
| `isEmail` | Must be a valid email |
| `isUrl` | Must be a valid URL |
| `isUUID` | Must be a valid UUID |
| `isInt` | Must be an integer |
| `isFloat` | Must be a float |
| `isDate` | Must be a valid date |
| `isBoolean` | Must be a boolean |
| `isAlpha` | Letters only |
| `isAlphanumeric` | Letters and digits only |
| `isNotEmpty` | Must not be empty |
| `isIn(a,b,c)` | Must be one of the listed values |
| `minLength(n)` | Minimum string length |
| `maxLength(n)` | Maximum string length |
| `min(n)` | Minimum numeric value |
| `max(n)` | Maximum numeric value |
| `default(val)` | Default value |
| `matches(regex)` | Must match regex pattern |

**Description** — any tokens that don't match a type or a rule are treated as free-text description, joined with `, `.

```
  search: string, tìm theo tên hoặc email   ← "tìm theo tên hoặc email" is description
  limit: number, default(20), max(100)       ← all three are rules
  Authorization: required, Bearer {token}    ← "Bearer {token}" is description
```

---

## Module options

```typescript
ApiExplorerModule.register({
  // URL path for the explorer UI
  // Default: 'api-explorer'
  path: 'api-explorer',

  // Title shown in browser tab and UI header
  // Default: 'API Explorer'
  title: 'My API — Explorer',

  // Path to a single markdown docs file
  // Relative paths are resolved from process.cwd()
  // Default: null
  docsFile: './api-explorer.md',

  // Path to a folder of markdown docs files (scanned recursively)
  // All .md files found are merged together
  // If both docsFile and docsFolder are set, docsFolder takes priority
  // Default: null
  docsFolder: './docs',

  // Explicitly enable or disable
  // The explorer is ALWAYS disabled when NODE_ENV === 'production'
  // Default: true
  enabled: true,
})
```

---

## Security

The explorer is **automatically disabled** when `NODE_ENV === 'production'`. No routes are registered and no UI is served.

For extra protection in staging environments, use the `enabled` option:

```typescript
ApiExplorerModule.register({
  enabled: process.env.ENABLE_API_EXPLORER === 'true',
})
```

---

## Routes exposed by the module

| Route | Description |
|-------|-------------|
| `GET /{path}` | Serves the explorer UI (HTML) |
| `GET /{path}/routes` | Returns route list as JSON |

The JSON response from `/routes` looks like:

```json
[
  {
    "method": "POST",
    "path": "/auth/login",
    "params": [],
    "group": "Auth",
    "description": "Đăng nhập và nhận JWT token",
    "body": [
      { "name": "email",    "type": "string", "required": true,  "rules": ["isEmail"],      "description": "" },
      { "name": "password", "type": "string", "required": true,  "rules": ["minLength(6)"], "description": "" }
    ],
    "query": [],
    "headers": [],
    "response": [
      { "name": "token", "type": "string", "required": false, "rules": [], "description": "" }
    ]
  }
]
```

---

## TypeScript types

```typescript
import {
  ApiExplorerModule,
  ApiExplorerOptions,
  ApiExplorerService,
  RouteInfo,
  DocField,
  parseDocsFile,
  parseDocsFolder,
} from '@vnphu/nestjs-api-explorer';

// DocField — one field in body/query/params/headers/response
interface DocField {
  name: string;
  type: string;        // 'string' | 'number' | 'boolean' | 'array' | 'object' | ''
  required: boolean;
  rules: string[];
  description: string;
}

// RouteInfo — one route returned by /routes endpoint
interface RouteInfo {
  method: string;
  path: string;
  params: string[];     // path param names, e.g. ['id', 'orderId']
  group: string;
  description: string;
  body: DocField[];
  query: DocField[];
  headers: DocField[];
  response: DocField[];
}
```

---

## License

MIT
