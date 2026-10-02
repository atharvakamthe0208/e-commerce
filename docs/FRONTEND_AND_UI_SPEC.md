# Frontend & UI/UX Blueprint 🎨

This document defines the interface design specifications, Tailwind CSS design system, responsive component hierarchy, and user interaction states for the **MERN Mini E-Commerce Demo Project**.

---

## 1. Design System & Theme Foundation

The UI design is crafted with **Tailwind CSS**, favoring clean typography, high readability, subtle neutral borders, soft drop-shadows, and distinct interactive feedback states.

### 1.1 Color Palette
- **Primary / Brand**: Slate & Indigo accents (`indigo-600` primary CTA, `indigo-700` hover, `indigo-50` active tint).
- **Backgrounds**: Pure white (`bg-white`) for cards and elevated panels; warm slate gray (`bg-slate-50` or `bg-gray-100`) for canvas backdrops.
- **Typography & Text**: Deep charcoal (`text-slate-900`) for headers; muted gray (`text-slate-600`) for descriptions and metadata.
- **Borders & Dividers**: Subtle gray (`border-slate-200`).
- **Status Accents**:
  - `Pending`: Amber badge (`bg-amber-100 text-amber-800 border-amber-200`)
  - `Confirmed`: Blue badge (`bg-blue-100 text-blue-800 border-blue-200`)
  - `Shipped`: Purple badge (`bg-purple-100 text-purple-800 border-purple-200`)
  - `Delivered`: Emerald green badge (`bg-emerald-100 text-emerald-800 border-emerald-200`)
  - `Cancelled`: Rose red badge (`bg-rose-100 text-rose-800 border-rose-200`)

---

## 2. Page Specifications & Layouts

```text
┌─────────────────────────────────────────────────────────────┐
│                       Top Navigation Bar                    │
│ [Brand Logo]      [Products]     [Search]     [Cart (3)] [User] │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│                      Page Main Content                      │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│                          Footer                             │
└─────────────────────────────────────────────────────────────┘
```

### 2.1 Public Pages

#### 1. Home Page (`/`)
- **Hero Section**: Modern, clean headline with a "Shop Now" call to action button and feature highlights (Free standard delivery on COD, easy returns, verified merchandise).
- **Featured Categories**: Quick-navigation cards linking directly to filtered product views.
- **Top Deals / New Arrivals Grid**: Displaying the first 4–8 latest catalog items.

#### 2. Products Page (`/products`)
- **Category Filter Bar**: Horizontal scrollable or wrapped pills:
  ```text
  [ All ]  [ Electronics ]  [ Fashion ]  [ Shoes ]
  ```
- **Search Bar**: Real-time text search input with search icon and clear button.
- **Responsive Product Grid**:
  - Mobile (`< 640px`): 1 column
  - Tablet (`640px - 1024px`): 2 or 3 columns
  - Desktop (`> 1024px`): 4 columns
- **Empty State**: Shown when search query or category filter returns zero results, with a "Reset Filters" action button.

#### 3. Product Details Page (`/products/:id`)
- **Layout**: 2-column split (desktop) or stacked (mobile).
- **Left Column**: Clean, aspect-ratio-locked product image presentation.
- **Right Column**:
  - Category pill badge
  - Product Title (`h1`)
  - Price display (`text-2xl font-bold text-slate-900`)
  - Description paragraph
  - Stock badge:
    - In Stock (`text-emerald-600` with available quantity count)
    - Out of Stock (`text-rose-600` badge, disables "Add to Cart" button)
  - Quantity selector (capped at available inventory)
  - Primary "Add to Cart" button

#### 4. Shopping Cart Page (`/cart`)
- **Left Pane (Item List)**:
  - Product thumbnail, name, unit price
  - Quantity adjuster: `[-]` Quantity `[+]` (inc/dec disabled when hitting 1 or max stock limit)
  - Remove item button with trash icon
- **Right Pane (Order Summary)**:
  - Subtotal computation
  - Shipping fee (Free / COD badge)
  - Total price
  - "Proceed to Checkout" primary CTA button
- **Empty State**: Friendly cart graphic, "Your cart is empty", button linking to `/products`.

#### 5. Checkout Page (`/checkout`)
- **Guarded**: Requires user to be logged in. If guest, redirects to `/login?redirect=/checkout`.
- **Form Fields**:
  - Full Name (`name="name"`)
  - Phone Number (`name="phone"`)
  - Street Address (`name="address"`)
  - City (`name="city"`)
  - Postal Pincode (`name="pincode"`)
- **Payment Method**: Static radio selection: `Cash on Delivery (COD)` (clearly labeled as the sole demo payment option).
- **Submit Action**: "Place Order" button with inline loading spinner when request is processing.

#### 6. Customer Authentication (`/login` & `/register`)
- **Card Design**: Centered glassmorphic or card box on a soft neutral background.
- **Register Form**: Name, Email, Password, Confirm Password. Client-side comparison validation before submit.
- **Login Form**: Email, Password. Auto-detects admin vs customer credentials on login success.

#### 7. My Orders Page (`/my-orders`)
- **Listing**: Accordion or card list of all past customer orders.
- **Card Header**: Order ID (`#651e...`), Date placed, Total Price, Status Badge.
- **Card Body**: List of items purchased (image, title, quantity, price), Delivery address snapshot.

---

### 2.2 Admin Dashboard (`/admin/*`)

The admin panel utilizes a dedicated layout containing a responsive sidebar and a top bar.

```text
┌──────────────┬──────────────────────────────────────────────┐
│ Admin Panel  │ Header: Admin User | View Site | Logout      │
├──────────────┼──────────────────────────────────────────────┤
│ 📦 Products  │                                              │
│ 🏷️ Categories│             Dynamic Admin View               │
│ 📋 Orders    │        (Tables, Modals & Actions)            │
│              │                                              │
└──────────────┴──────────────────────────────────────────────┘
```

#### 1. Admin Products (`/admin/products`)
- **Header**: Title + "Add Product" button that opens `ProductModal`.
- **Data Table**:
  - Columns: Image, Name, Category, Price, Stock, Actions (Edit, Delete).
  - Low stock warning: Stock < 5 highlighted in amber/red.
- **Product Modal**: Add or Edit product form (Name, Description, Price, Category dropdown, Image URL, Stock).
- **Delete Action**: Triggers `ConfirmModal` before calling API.

#### 2. Admin Categories (`/admin/categories`)
- **Header**: Title + "Add Category" button.
- **Data Table**:
  - Columns: Name, Description, Created At, Actions (Edit, Delete).
- **Category Modal**: Add or Edit category form (Name, Description).

#### 3. Admin Orders (`/admin/orders`)
- **Data Table**:
  - Columns: Order ID, Customer Name, Email, Total Amount, Date, Status, Actions.
- **Status Modifier**: Interactive status dropdown allowing immediate update (`Pending`, `Confirmed`, `Shipped`, `Delivered`, `Cancelled`).
- **Order Details Modal**: Inspect full shipping address and complete breakdown of purchased items.

---

## 3. Reusable UI Components

| Component | Path | Responsibility |
| :--- | :--- | :--- |
| `Navbar` | `components/common/Navbar.jsx` | Brand, catalog navigation, live cart count badge, user profile/logout dropdown. |
| `Footer` | `components/common/Footer.jsx` | Copyright, tech stack credits, quick navigation links. |
| `ProductCard` | `components/product/ProductCard.jsx` | Image hover zoom, category chip, price, and instant "Add to Cart" button. |
| `ConfirmModal`| `components/common/ConfirmModal.jsx` | Warning modal for irreversible delete actions with Cancel and Confirm buttons. |
| `StatusBadge` | `components/admin/StatusBadge.jsx` | Clean color-coded badge based on order status string. |
| `Loader` | `components/common/Loader.jsx` | Animated spinner and skeleton placeholders for smooth UX. |
| `EmptyState` | `components/common/EmptyState.jsx` | Displays custom icon, title, description, and action button when lists are empty. |

---

## 4. State Management Specifications

### 4.1 `AuthContext`
- **State**:
  - `user`: `{ _id, name, email, isAdmin } | null`
  - `token`: `string | null`
  - `loading`: `boolean` (initial check of `localStorage`)
- **Actions**:
  - `login(email, password)`: Performs API call, saves token and user in `localStorage`.
  - `register(userData)`: Registers account and initiates login.
  - `logout()`: Clears `localStorage` and resets state to `null`.

### 4.2 `CartContext`
- **State**:
  - `cartItems`: Array of `{ product: { _id, name, price, image, stock }, quantity }`
- **Persistence**: Synced with `localStorage.getItem('cart')`.
- **Actions**:
  - `addToCart(product, quantity = 1)`: Appends item or increments existing, checking that `quantity <= product.stock`.
  - `updateQuantity(productId, newQty)`: Updates quantity within bounds `[1, product.stock]`.
  - `removeFromCart(productId)`: Filters out the item.
  - `clearCart()`: Empties array (called automatically upon order confirmation).
  - Computed getters: `totalItemsCount`, `subtotalPrice`.
