# REST API Specification 🔌

This document provides the formal contract for all REST API endpoints implemented in the **MERN Mini E-Commerce Demo Project**.

All requests sending payloads must include the header `Content-Type: application/json`.
Endpoints protected by authentication require the header `Authorization: Bearer <jwt_token>`.

---

## 1. API Endpoints Matrix

| Domain | Method | Endpoint | Access Level | Description |
| :--- | :--- | :--- | :--- | :--- |
| **Auth** | `POST` | `/api/auth/register` | Public | Register customer account |
| **Auth** | `POST` | `/api/auth/login` | Public | Login customer or admin |
| **Categories** | `GET` | `/api/categories` | Public | Fetch all categories |
| **Categories** | `POST` | `/api/categories` | Admin | Create a new category |
| **Categories** | `PUT` | `/api/categories/:id` | Admin | Update existing category |
| **Categories** | `DELETE`| `/api/categories/:id` | Admin | Remove category |
| **Products** | `GET` | `/api/products` | Public | List products (with category filter & search) |
| **Products** | `GET` | `/api/products/:id` | Public | Get single product details |
| **Products** | `POST` | `/api/products` | Admin | Create a new product |
| **Products** | `PUT` | `/api/products/:id` | Admin | Update product details or stock |
| **Products** | `DELETE`| `/api/products/:id` | Admin | Remove product |
| **Orders** | `POST` | `/api/orders` | Customer | Place new COD order |
| **Orders** | `GET` | `/api/orders/my-orders` | Customer | Get authenticated user's order history |
| **Orders** | `GET` | `/api/admin/orders` | Admin | Get all platform orders |
| **Orders** | `PATCH`| `/api/admin/orders/:id/status`| Admin | Update order status |

---

## 2. Authentication Endpoints

### 2.1 Register Customer
- **Endpoint**: `POST /api/auth/register`
- **Access**: Public
- **Description**: Registers a new customer account. Validates that passwords match and email is not already taken.

#### Request Body
```json
{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "password": "password123",
  "confirmPassword": "password123"
}
```

#### Success Response (`201 Created`)
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "_id": "651a2b3c4d5e6f7a8b9c0d1e",
    "name": "Jane Doe",
    "email": "jane@example.com",
    "isAdmin": false,
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

#### Error Responses
- `400 Bad Request`: Validation failure (passwords do not match, email invalid, password under 6 characters).
- `400 Bad Request`: `User already exists with this email`.

---

### 2.2 User / Admin Login
- **Endpoint**: `POST /api/auth/login`
- **Access**: Public
- **Description**: Authenticates either a customer or an administrator, returning user details and a signed JWT.

#### Request Body
```json
{
  "email": "jane@example.com",
  "password": "password123"
}
```

#### Success Response (`200 OK`)
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "_id": "651a2b3c4d5e6f7a8b9c0d1e",
    "name": "Jane Doe",
    "email": "jane@example.com",
    "isAdmin": false,
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

#### Error Responses
- `401 Unauthorized`: Invalid email or password.

---

## 3. Category Endpoints

### 3.1 Get All Categories
- **Endpoint**: `GET /api/categories`
- **Access**: Public

#### Success Response (`200 OK`)
```json
{
  "success": true,
  "data": [
    {
      "_id": "651c11111111111111111111",
      "name": "Electronics",
      "description": "Smartphones, laptops, and smart gadgets",
      "createdAt": "2026-09-15T10:00:00.000Z"
    },
    {
      "_id": "651c22222222222222222222",
      "name": "Fashion",
      "description": "Apparel, clothing, and lifestyle items",
      "createdAt": "2026-09-15T10:05:00.000Z"
    }
  ]
}
```

---

### 3.2 Create Category
- **Endpoint**: `POST /api/categories`
- **Access**: Admin (Requires `Authorization: Bearer <token>`)

#### Request Body
```json
{
  "name": "Shoes",
  "description": "Sneakers, running shoes, and formal footwear"
}
```

#### Success Response (`201 Created`)
```json
{
  "success": true,
  "message": "Category created successfully",
  "data": {
    "_id": "651c33333333333333333333",
    "name": "Shoes",
    "description": "Sneakers, running shoes, and formal footwear",
    "createdAt": "2026-10-02T12:00:00.000Z"
  }
}
```

---

### 3.3 Update Category
- **Endpoint**: `PUT /api/categories/:id`
- **Access**: Admin

#### Request Body
```json
{
  "name": "Footwear & Shoes",
  "description": "Updated category description"
}
```

#### Success Response (`200 OK`)
```json
{
  "success": true,
  "message": "Category updated successfully",
  "data": {
    "_id": "651c33333333333333333333",
    "name": "Footwear & Shoes",
    "description": "Updated category description"
  }
}
```

---

### 3.4 Delete Category
- **Endpoint**: `DELETE /api/categories/:id`
- **Access**: Admin

#### Success Response (`200 OK`)
```json
{
  "success": true,
  "message": "Category deleted successfully"
}
```

---

## 4. Product Endpoints

### 4.1 List Products (Search & Filter)
- **Endpoint**: `GET /api/products`
- **Access**: Public
- **Query Parameters**:
  - `category` *(optional)*: Filter by Category ID or name slug. Example: `?category=651c11111111111111111111`
  - `search` *(optional)*: Keyword matching against product name or description. Example: `?search=phone`

#### Example Request
```http
GET /api/products?category=651c11111111111111111111&search=phone HTTP/1.1
Host: localhost:5000
```

#### Success Response (`200 OK`)
```json
{
  "success": true,
  "count": 1,
  "data": [
    {
      "_id": "651d11111111111111111111",
      "name": "Wireless Smartphone Pro",
      "description": "High performance 5G smartphone with 128GB storage.",
      "price": 699.99,
      "image": "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9",
      "category": {
        "_id": "651c11111111111111111111",
        "name": "Electronics"
      },
      "stock": 25,
      "createdAt": "2026-09-16T08:30:00.000Z"
    }
  ]
}
```

---

### 4.2 Get Single Product
- **Endpoint**: `GET /api/products/:id`
- **Access**: Public

#### Success Response (`200 OK`)
```json
{
  "success": true,
  "data": {
    "_id": "651d11111111111111111111",
    "name": "Wireless Smartphone Pro",
    "description": "High performance 5G smartphone with 128GB storage.",
    "price": 699.99,
    "image": "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9",
    "category": {
      "_id": "651c11111111111111111111",
      "name": "Electronics"
    },
    "stock": 25
  }
}
```

---

### 4.3 Create Product
- **Endpoint**: `POST /api/products`
- **Access**: Admin (Requires `Authorization: Bearer <token>`)

#### Request Body
```json
{
  "name": "Classic Leather Sneaker",
  "description": "Breathable white leather sneakers with rubber sole.",
  "price": 89.99,
  "image": "https://images.unsplash.com/photo-1542291026-7eec264c27ff",
  "category": "651c33333333333333333333",
  "stock": 40
}
```

#### Success Response (`201 Created`)
```json
{
  "success": true,
  "message": "Product created successfully",
  "data": {
    "_id": "651d22222222222222222222",
    "name": "Classic Leather Sneaker",
    "description": "Breathable white leather sneakers with rubber sole.",
    "price": 89.99,
    "image": "https://images.unsplash.com/photo-1542291026-7eec264c27ff",
    "category": "651c33333333333333333333",
    "stock": 40
  }
}
```

---

### 4.4 Update Product
- **Endpoint**: `PUT /api/products/:id`
- **Access**: Admin

#### Request Body
```json
{
  "name": "Classic Leather Sneaker v2",
  "price": 94.99,
  "stock": 35
}
```

#### Success Response (`200 OK`)
```json
{
  "success": true,
  "message": "Product updated successfully",
  "data": {
    "_id": "651d22222222222222222222",
    "name": "Classic Leather Sneaker v2",
    "price": 94.99,
    "stock": 35
  }
}
```

---

### 4.5 Delete Product
- **Endpoint**: `DELETE /api/products/:id`
- **Access**: Admin

#### Success Response (`200 OK`)
```json
{
  "success": true,
  "message": "Product deleted successfully"
}
```

---

## 5. Order Endpoints

### 5.1 Place Order (Checkout)
- **Endpoint**: `POST /api/orders`
- **Access**: Customer (Authenticated)
- **Crucial Rule**: The client only provides product IDs and desired quantities. The server computes all prices from the database directly.

#### Request Body
```json
{
  "items": [
    {
      "product": "651d11111111111111111111",
      "quantity": 2
    },
    {
      "product": "651d22222222222222222222",
      "quantity": 1
    }
  ],
  "shippingAddress": {
    "name": "Jane Doe",
    "phone": "+1-555-0199",
    "address": "456 Elm Street, Apt 3B",
    "city": "Metropolis",
    "pincode": "10001"
  }
}
```

#### Success Response (`201 Created`)
```json
{
  "success": true,
  "message": "Order placed successfully",
  "data": {
    "_id": "651e44444444444444444444",
    "user": "651a2b3c4d5e6f7a8b9c0d1e",
    "products": [
      {
        "product": "651d11111111111111111111",
        "quantity": 2,
        "price": 699.99
      },
      {
        "product": "651d22222222222222222222",
        "quantity": 1,
        "price": 94.99
      }
    ],
    "totalAmount": 1494.97,
    "shippingAddress": {
      "name": "Jane Doe",
      "phone": "+1-555-0199",
      "address": "456 Elm Street, Apt 3B",
      "city": "Metropolis",
      "pincode": "10001"
    },
    "status": "Pending",
    "createdAt": "2026-10-02T12:45:00.000Z"
  }
}
```

#### Error Responses
- `400 Bad Request`: "Product not found or inactive"
- `400 Bad Request`: "Insufficient stock for product 'Wireless Smartphone Pro'. Available: 1"

---

### 5.2 Get Customer Order History
- **Endpoint**: `GET /api/orders/my-orders`
- **Access**: Customer (Authenticated)

#### Success Response (`200 OK`)
```json
{
  "success": true,
  "data": [
    {
      "_id": "651e44444444444444444444",
      "products": [
        {
          "product": {
            "_id": "651d11111111111111111111",
            "name": "Wireless Smartphone Pro",
            "image": "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9"
          },
          "quantity": 2,
          "price": 699.99
        }
      ],
      "totalAmount": 1494.97,
      "status": "Pending",
      "createdAt": "2026-10-02T12:45:00.000Z"
    }
  ]
}
```

---

### 5.3 Get All Orders (Admin Dashboard)
- **Endpoint**: `GET /api/admin/orders`
- **Access**: Admin (Requires `Authorization: Bearer <token>`)

#### Success Response (`200 OK`)
```json
{
  "success": true,
  "count": 12,
  "data": [
    {
      "_id": "651e44444444444444444444",
      "user": {
        "_id": "651a2b3c4d5e6f7a8b9c0d1e",
        "name": "Jane Doe",
        "email": "jane@example.com"
      },
      "totalAmount": 1494.97,
      "status": "Pending",
      "shippingAddress": {
        "city": "Metropolis",
        "pincode": "10001"
      },
      "createdAt": "2026-10-02T12:45:00.000Z"
    }
  ]
}
```

---

### 5.4 Update Order Status (Admin)
- **Endpoint**: `PATCH /api/admin/orders/:id/status`
- **Access**: Admin

#### Request Body
```json
{
  "status": "Confirmed"
}
```
*Allowed status values: `Pending`, `Confirmed`, `Shipped`, `Delivered`, `Cancelled`.*

#### Success Response (`200 OK`)
```json
{
  "success": true,
  "message": "Order status updated to Confirmed",
  "data": {
    "_id": "651e44444444444444444444",
    "status": "Confirmed",
    "updatedAt": "2026-10-02T13:00:00.000Z"
  }
}
```

#### Error Responses
- `400 Bad Request`: "Invalid order status value"
- `404 Not Found`: "Order not found"
