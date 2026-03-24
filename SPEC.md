# E-Commerce Product Dashboard - Specification

## 1. Project Overview

**Project Name:** ProductHub - E-Commerce Dashboard
**Project Type:** Full-stack Web Application (React + SpringBoot)
**Core Functionality:** A product listing application with user authentication, role-based access control, and SSO integration
**Target Users:** Admin and regular users who can view and manage products

## 2. Technology Stack

### Backend
- Java 17
- Spring Boot 3.x
- Spring Security with OAuth2 (Google, Facebook SSO)
- Spring Data JPA with H2 Database
- JWT for session management

### Frontend
- React 18
- Vite (build tool)
- React Router for navigation
- Axios for API calls
- CSS Modules for styling

## 3. UI/UX Specification

### Color Palette
- Primary: `#2563eb` (Blue)
- Secondary: `#1e293b` (Dark Slate)
- Accent: `#10b981` (Emerald Green)
- Background: `#f8fafc` (Light Gray)
- Card Background: `#ffffff`
- Text Primary: `#1e293b`
- Text Secondary: `#64748b`
- Error: `#ef4444`
- Warning: `#f59e0b`

### Typography
- Font Family: `'Inter', 'Segoe UI', sans-serif`
- Heading 1: 32px, Bold
- Heading 2: 24px, SemiBold
- Heading 3: 18px, Medium
- Body: 16px, Regular
- Small: 14px, Regular

### Layout Structure
- **Header:** Fixed top navigation with logo, nav links, user menu
- **Sidebar:** Dashboard navigation (for admin)
- **Main Content:** Product grid/list view
- **Footer:** Copyright and links

### Responsive Breakpoints
- Mobile: < 768px
- Tablet: 768px - 1024px
- Desktop: > 1024px

### Components

#### Login/Register Page
- Centered card layout
- OAuth2 login buttons (Google, Facebook)
- Email/password form
- Form validation with error messages

#### Dashboard
- Product grid (3 columns desktop, 2 tablet, 1 mobile)
- Product cards with image, name, price, description
- Admin: Add, Edit, Delete buttons
- User: View only

#### User Profile
- Profile information display
- Edit form for personal info
- Password change section
- Account settings

## 4. Functionality Specification

### Authentication
- Local registration with email/password
- OAuth2 SSO login (Google, Facebook)
- JWT token-based session
- Auto-login on browser refresh

### User Roles
| Role  | View Products | Add Product | Edit Product | Delete Product | Manage Users |
|-------|---------------|-------------|--------------|----------------|---------------|
| User  | ✓             | ✗           | ✗            | ✗              | ✗             |
| Admin | ✓             | ✓           | ✓            | ✓              | ✓             |

### Products Management
- List all products with pagination
- Add new product (admin only)
- Edit product (admin only)
- Delete product (admin only)
- Search/filter products

### User Profile
- View profile information
- Update name, email
- Change password
- View account settings

### Pre-seeded Users
- **Admin:** username: `admin`, password: `admin123`, role: `ADMIN`
- **User:** username: `user`, password: `user123`, role: `USER`

### Pre-seeded Products
- 6 sample products with name, description, price, image URL

## 5. API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login with credentials
- `GET /api/auth/user` - Get current user info

### Products
- `GET /api/products` - Get all products
- `GET /api/products/{id}` - Get product by ID
- `POST /api/products` - Create product (Admin)
- `PUT /api/products/{id}` - Update product (Admin)
- `DELETE /api/products/{id}` - Delete product (Admin)

### User Profile
- `GET /api/profile` - Get user profile
- `PUT /api/profile` - Update profile
- `PUT /api/profile/password` - Change password

## 6. Acceptance Criteria

1. ✅ User can register with email/password
2. ✅ User can login with local credentials
3. ✅ User can login via Google OAuth2
4. ✅ User can login via Facebook OAuth2
5. ✅ Admin can view, add, edit, delete products
6. ✅ User can only view products
7. ✅ User can view and update profile
8. ✅ User can change password
9. ✅ Application is responsive on all devices
10. ✅ RBAC is properly enforced on all endpoints
