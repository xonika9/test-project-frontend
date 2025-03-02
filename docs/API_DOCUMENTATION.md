# Документация API

## Содержание

1. [Аутентификация](#аутентификация)
    - [Регистрация](#регистрация)
    - [Вход в систему](#вход-в-систему)
    - [Обновление токена](#обновление-токена)
2. [Профиль пользователя](#профиль-пользователя)
    - [Получение профиля](#получение-профиля)
    - [Обновление профиля](#обновление-профиля)

---

## Аутентификация

### Регистрация

**Эндпоинт:** `POST /api/auth/register`

**Описание:** Создание нового пользователя в системе.

**Заголовки:**

- `Content-Type: application/json`

**Тело запроса:**

```json
{
    "email": "user@example.com",
    "password": "securePassword123!",
    "firstName": "Иван",
    "lastName": "Иванов"
}
```

**Пример успешного ответа (201 Created):**

```json
{
    "id": 123,
    "email": "user@example.com",
    "firstName": "Иван",
    "lastName": "Иванов"
}
```

**Возможные ошибки:**

- `400 Bad Request` - Невалидные данные или email уже занят
- `500 Internal Server Error` - Ошибка сервера

---

### Вход в систему

**Эндпоинт:** `POST /api/auth/login`

**Описание:** Аутентификация пользователя и получение JWT токена.

**Заголовки:**

- `Content-Type: application/json`

**Тело запроса:**

```json
{
    "email": "user@example.com",
    "password": "securePassword123!"
}
```

**Пример успешного ответа (200 OK):**

```json
{
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expiresIn": 3600
}
```

**Возможные ошибки:**

- `400 Bad Request` - Невалидные данные
- `401 Unauthorized` - Неверные учетные данные
- `500 Internal Server Error` - Ошибка сервера

---

### Обновление токена

**Эндпоинт:** `POST /api/auth/refresh-token`

**Описание:** Получение нового access токена по refresh токену.

**Заголовки:**

- `Content-Type: application/json`

**Тело запроса:**

```json
{
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Пример успешного ответа (200 OK):**

```json
{
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expiresIn": 3600
}
```

**Возможные ошибки:**

- `400 Bad Request` - Невалидный refresh токен
- `401 Unauthorized` - Истек срок действия refresh токена
- `500 Internal Server Error` - Ошибка сервера

---

## Профиль пользователя

---

## Профиль пользователя

### Получение профиля

**Эндпоинт:** `GET /api/users/profile`

**Описание:** Получение данных профиля текущего аутентифицированного пользователя.

**Заголовки:**

- `Authorization: Bearer <JWT_TOKEN>`

**Пример успешного ответа (200 OK):**

```json
{
    "id": 123,
    "name": "Иван Иванов",
    "email": "user@example.com",
    "createdAt": "2024-01-01T12:00:00.000Z",
    "updatedAt": "2024-01-05T15:30:00.000Z",
    "firstName": "Иван",
    "lastName": "Иванов",
    "username": "ivan_ivanov",
    "bio": "Описание профиля",
    "avatarUrl": "https://example.com/avatar.jpg",
    "phoneNumber": "+79991234567",
    "location": "Москва, Россия",
    "language": "ru",
    "timezone": "Europe/Moscow",
    "themePreference": "dark",
    "lastLoginAt": "2024-01-10T10:00:00.000Z",
    "isActive": true,
    "role": "user"
}
```

**Возможные ошибки:**

- `401 Unauthorized` - Недействительный или отсутствующий токен
- `404 Not Found` - Пользователь не найден
- `500 Internal Server Error` - Ошибка сервера

---

### Обновление профиля

**Эндпоинт:** `PUT /api/users/profile`

**Описание:** Обновление данных профиля текущего аутентифицированного пользователя.

**Заголовки:**

- `Authorization: Bearer <JWT_TOKEN>`
- `Content-Type: application/json`

**Тело запроса:**

```json
{
    "firstName": "Новое Имя",
    "lastName": "Новая Фамилия",
    "username": "new_username",
    "bio": "Новое описание",
    "avatarUrl": "https://example.com/new_avatar.jpg",
    "phoneNumber": "+79999876543",
    "location": "Санкт-Петербург, Россия",
    "language": "en",
    "timezone": "America/New_York",
    "themePreference": "light"
}
```

**Пример успешного ответа (200 OK):**
Возвращает обновленные данные профиля в том же формате, что и GET /api/users/profile

**Возможные ошибки:**

- `400 Bad Request` - Невалидные данные
- `401 Unauthorized` - Недействительный или отсутствующий токен
- `500 Internal Server Error` - Ошибка сервера

---

## Примечания

1. Все поля в запросе на обновление профиля являются опциональными
2. Для работы с API требуется действительный JWT токен
3. Подробная документация доступна через Swagger UI по адресу `/api-docs`
