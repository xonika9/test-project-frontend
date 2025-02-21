# User Profile API Documentation

This document describes the API endpoints for managing user profiles.

## Table of Contents
1. [Get User Profile](#1-get-user-profile)
2. [Update User Profile](#2-update-user-profile)

---

## 1. Get User Profile

**Endpoint:** `GET /api/users/profile`

**Description:** Retrieve profile data of the authenticated user.

### Request
```http
GET /api/users/profile HTTP/1.1
Authorization: Bearer &lt;JWT_TOKEN&gt;
```

### Response (200 OK)
```json
{
  "id": 123,
  "name": "Имя Фамилия",
  "email": "user@example.com",
  "createdAt": "2024-01-01T12:00:00.000Z",
  "updatedAt": "2024-01-05T15:30:00.000Z",
  "firstName": "Имя",
  "lastName": "Фамилия",
  "username": "user_login",
  "bio": "Краткое описание пользователя",
  "avatarUrl": "URL_аватарки",
  "phoneNumber": "+79991234567",
  "location": "Город, Страна",
  "language": "ru",
  "timezone": "Europe/Moscow",
  "themePreference": "dark",
  "lastLoginAt": "2024-01-10T10:00:00.000Z",
  "isActive": true,
  "role": "user"
}
```

### Error Responses
- **401 Unauthorized:** Invalid or missing JWT token
- **404 Not Found:** User not found
- **500 Internal Server Error:** Server error

---

## 2. Update User Profile

**Endpoint:** `PUT /api/users/profile`

**Description:** Update profile data of the authenticated user.

### Request
```http
PUT /api/users/profile HTTP/1.1
Authorization: Bearer &lt;JWT_TOKEN&gt;
Content-Type: application/json

{
  "firstName": "Новое Имя",
  "lastName": "Новая Фамилия",
  "username": "new_username",
  "bio": "Обновленная биография",
  "avatarUrl": "URL_новой_аватарки",
  "phoneNumber": "+79999876543",
  "location": "Новый Город, Новая Страна",
  "language": "en",
  "timezone": "America/New_York",
  "themePreference": "light"
}
```

### Response (200 OK)
Returns updated profile data in same format as GET endpoint.

### Error Responses
- **400 Bad Request:** Invalid data format or username taken
- **401 Unauthorized:** Invalid or missing JWT token
- **500 Internal Server Error:** Server error

---

### Notes
1. All fields in PUT request are optional
2. Data validation is performed on the backend
3. Refer to Swagger docs at `/api-docs` for more details