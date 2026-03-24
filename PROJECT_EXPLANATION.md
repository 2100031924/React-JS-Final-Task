# ProductHub - E-Commerce Dashboard

## Project Overview

A full-stack e-commerce product management application with authentication, role-based access control, and modern UI.

---

## Technology Stack

### Backend
- **Java 17** with Spring Boot 3.x
- **Spring Security** for authentication & authorization
- **Spring Data JPA** with H2 database
- **JWT** for stateless authentication
- **OAuth 2.0** for SSO (Google, Facebook)

### Frontend
- **React 18** with Vite
- **React Router** for navigation
- **Axios** for API calls
- **Custom CSS** with animations

---

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        FRONTEND (React)                      │
│  ┌─────────┐  ┌──────────┐  ┌──────────┐  ┌─────────────┐   │
│  │  Login  │  │Register  │  │Dashboard │  │   Profile    │   │
│  └────┬────┘  └────┬─────┘  └────┬─────┘  └──────┬──────┘   │
│       │           │             │               │          │
│       └───────────┴─────────────┴───────────────┘          │
│                           │                                  │
│                    AuthContext                               │
│                    (State Management)                        │
└──────────────────────────┬──────────────────────────────────┘
                           │ HTTP + JWT
┌──────────────────────────┴──────────────────────────────────┐
│                      BACKEND (Spring Boot)                   │
│  ┌──────────────────────────────────────────────────────┐  │
│  │                 SECURITY LAYER                         │  │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐ │  │
│  │  │ JWT Filter  │  │OAuth2 Login │  │  CORS       │ │  │
│  │  └─────────────┘  └─────────────┘  └─────────────┘ │  │
│  └──────────────────────────────────────────────────────┘  │
│                           │                                  │
│  ┌────────────────────────┴────────────────────────────┐   │
│  │                    CONTROLLERS                       │   │
│  │  ┌──────────────┐ ┌─────────────┐ ┌─────────────┐  │   │
│  │  │AuthController│ │ProductController│ProfileController││   │
│  │  └──────┬───────┘ └──────┬──────┘ └──────┬──────┘  │   │
│  └─────────┼─────────────────┼──────────────┼─────────┘   │
│            │                 │              │              │
│  ┌─────────┴─────────────────┴──────────────┴─────────┐   │
│  │                      SERVICES                        │   │
│  │  ┌─────────────┐ ┌─────────────┐ ┌──────────────┐  │   │
│  │  │ AuthService │ │ProductService│ │ UserService  │  │   │
│  │  └─────────────┘ └─────────────┘ └──────────────┘  │   │
│  └─────────────────────────┬───────────────────────────┘   │
│                             │                               │
│  ┌──────────────────────────┴───────────────────────────┐  │
│  │                    REPOSITORY                         │  │
│  │  ┌──────────────┐ ┌──────────────┐                  │  │
│  │  │ UserRepository│ │ProductRepository│                │  │
│  │  └──────────────┘ └──────────────┘                  │  │
│  └───────────────────────────────────────────────────────┘  │
│                             │                               │
│  ┌──────────────────────────┴───────────────────────────┐  │
│  │               DATABASE (H2 In-Memory)                  │  │
│  │        Users Table    │    Products Table              │  │
│  └───────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

---

## Key Features

### 1. Authentication System
- **Local Login**: Username/Password with JWT tokens
- **Registration**: New user signup
- **SSO Integration**: OAuth 2.0 (Google, Facebook) - requires credentials
- **JWT Token**: Stateless authentication with 24hr expiry

### 2. Role-Based Access Control (RBAC)
| Feature | User | Admin |
|---------|------|-------|
| View Products | ✓ | ✓ |
| Add Product | ✗ | ✓ |
| Edit Product | ✗ | ✓ |
| Delete Product | ✗ | ✓ |
| Update Profile | ✓ | ✓ |

Implemented using:
- Backend: `@PreAuthorize("hasRole('ADMIN')")` annotations
- Frontend: Conditional rendering based on `user.role`

### 3. User Profile Management
- View profile information
- Update personal details (name, phone, address)
- Change password
- Account settings

### 4. Product Management
- List all products
- Search products by name/category
- Add new product (Admin only)
- Edit product (Admin only)
- Delete product (Admin only)

---

## API Endpoints

### Authentication
```
POST /api/auth/register   - Register new user
POST /api/auth/login      - Login with credentials
GET  /api/auth/user       - Get current user info
```

### Products
```
GET    /api/products          - Get all products
GET    /api/products/{id}     - Get product by ID
POST   /api/products          - Create product (Admin)
PUT    /api/products/{id}     - Update product (Admin)
DELETE /api/products/{id}     - Delete product (Admin)
GET    /api/products/search   - Search products
```

### Profile
```
GET    /api/profile          - Get user profile
PUT    /api/profile          - Update profile
PUT    /api/profile/password - Change password
```

---

## Database Schema

### Users Table
| Column | Type | Description |
|--------|------|-------------|
| id | Long | Primary key |
| username | String | Unique username |
| password | String | BCrypt hashed password |
| email | String | Unique email |
| fullName | String | User's full name |
| phone | String | Phone number |
| address | String | Address |
| role | Enum | USER or ADMIN |
| provider | String | local/google/facebook |
| createdAt | DateTime | Creation timestamp |

### Products Table
| Column | Type | Description |
|--------|------|-------------|
| id | Long | Primary key |
| name | String | Product name |
| description | String | Product description |
| price | BigDecimal | Product price |
| imageUrl | String | Product image URL |
| category | String | Product category |
| stock | Integer | Available stock |
| active | Boolean | Is product active |
| createdAt | DateTime | Creation timestamp |

---

## Pre-seeded Data

### Users
| Username | Password | Role |
|----------|----------|------|
| admin | admin123 | ADMIN |
| user | user123 | USER |

### Products (6 sample products)
- MacBook Pro
- iPhone 15 Pro
- Sony WH-1000XM5
- Nike Air Max
- Levi's Jeans
- Samsung TV

---

## Security Implementation

### JWT Flow
```
1. User logs in with credentials
2. Server validates and generates JWT token
3. Token contains: {sub: username, role: ADMIN/USER, exp: timestamp}
4. Frontend stores token in localStorage
5. Every request includes: Authorization: Bearer <token>
6. Backend validates token on each request
7. Token expires after 24 hours
```

### CORS Configuration
- Allowed origins: `http://localhost:5173`, `http://localhost:3000`
- Allowed methods: GET, POST, PUT, DELETE, OPTIONS
- Allowed headers: Authorization, Content-Type
- Credentials: allowed

---

## Running the Application

### Backend
```bash
cd backend
mvn spring-boot:run
# Runs on http://localhost:8080
```

### Frontend
```bash
cd frontend
npm run dev
# Runs on http://localhost:5173
```

---

## Interview Points to Highlight

1. **Full-stack Development** - Both frontend and backend
2. **Security** - JWT authentication, password hashing (BCrypt)
3. **Authorization** - Role-based access control with Spring Security
4. **REST API** - Proper RESTful endpoints
5. **Database** - JPA with H2, proper entity relationships
6. **Modern UI** - React with animations and responsive design
7. **OAuth 2.0** - SSO integration ready
8. **Code Organization** - Clean separation of concerns (Controller, Service, Repository)
9. **Error Handling** - Global exception handler
10. **CORS** - Proper cross-origin configuration
