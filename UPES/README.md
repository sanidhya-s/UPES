# Campus Chat – UPES Communication Application

A Slack-like communication application for campus: students can register with name and email, create channels, join channels, and chat with each other.

## Tech Stack

- **Backend:** Spring Boot 3.2, Spring Security (JWT), Spring Data JPA, MySQL
- **Frontend:** Angular 17
- **Database:** MySQL

## Prerequisites

- **Java 17**
- **Node.js 18+** and npm
- **MySQL 8** (running locally with a user that can create databases)

## Database Setup

1. Install and start MySQL.
2. Create a database (optional – the app can create it automatically):
   ```sql
   CREATE DATABASE IF NOT EXISTS campus_chat;
   ```
3. In `backend/src/main/resources/application.properties`, set your MySQL username and password:
   ```properties
   spring.datasource.username=root
   spring.datasource.password=YOUR_PASSWORD
   ```

## Running the Application

### 1. Backend (Spring Boot)

```bash
cd backend
./mvnw spring-boot:run
```

Or with Maven installed:

```bash
cd backend
mvn spring-boot:run
```

The API will be available at **http://localhost:8080**.

### 2. Frontend (Angular)

```bash
cd frontend
npm install
npm start
```

The app will be available at **http://localhost:4200**.

### 3. Use the App

1. Open **http://localhost:4200** in a browser.
2. Click **Register** and create an account (name, email, password).
3. After login, create a channel or join an existing one from “All channels”.
4. Open a channel to view and send messages. Messages refresh every few seconds.

## API Overview

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST   | `/api/auth/register` | Register (name, email, password) |
| POST   | `/api/auth/login`    | Login (email, password) |
| GET    | `/api/channels/my`   | List channels the user has joined |
| GET    | `/api/channels`      | List all channels |
| POST   | `/api/channels`      | Create a channel (name, description) |
| GET    | `/api/channels/{id}` | Get channel details (must be a member) |
| POST   | `/api/channels/{id}/join`  | Join a channel |
| POST   | `/api/channels/{id}/leave` | Leave a channel |
| GET    | `/api/channels/{id}/messages` | Get messages (must be a member) |
| POST   | `/api/channels/{id}/messages` | Send a message (body: `{ "content": "..." }`) |

Protected endpoints require the header: `Authorization: Bearer <token>` (returned on login/register).

## Project Structure

```
UPES/
├── backend/                 # Spring Boot
│   ├── src/main/java/com/upes/campuschat/
│   │   ├── entity/          # User, Channel, ChannelMember, Message
│   │   ├── repository/      # JPA repositories
│   │   ├── dto/             # Request/response DTOs
│   │   ├── service/         # Auth, Channel, Message services
│   │   ├── controller/      # REST controllers
│   │   └── security/       # JWT, Security config
│   └── src/main/resources/
│       └── application.properties
├── frontend/                # Angular 17
│   └── src/app/
│       ├── pages/           # login, register, channels, chat
│       ├── services/        # auth, channel, message
│       ├── guards/          # auth guard
│       └── interceptors/    # JWT interceptor
└── README.md
```

## Configuration

- **Backend:** `backend/src/main/resources/application.properties`  
  - MySQL URL, username, password  
  - `jwt.secret` and `jwt.expiration-ms`  
  - `cors.allowed-origins` (default `http://localhost:4200`)

- **Frontend:** `frontend/src/environments/environment.ts`  
  - `apiUrl`: backend base URL (default `http://localhost:8080/api`)

## Notes

- Passwords are stored hashed (BCrypt).
- JWT tokens are valid for 24 hours by default.
- For production, set a strong `jwt.secret` and use HTTPS.
