# Crypto Price Alert Service 🚀

A robust cryptocurrency price monitoring service built with NestJS that allows users to set and receive alerts for crypto price movements.

## Features 🌟

- User authentication with JWT
- Real-time price monitoring using CoinGecko API
- Custom price alerts creation and management
- Rate limiting and security measures
- Comprehensive error handling and logging
- Redis-based job queue for price checks
- Prometheus metrics for monitoring
- Swagger API documentation

## Tech Stack 💻

- **Framework**: NestJS with TypeScript
- **Database**: PostgreSQL with Prisma ORM
- **Queue**: Bull/Redis for background jobs
- **Authentication**: JWT
- **API Documentation**: Swagger/OpenAPI
- **Monitoring**: Prometheus metrics
- **Testing**: Jest
- **Security**: Helmet, CORS, Rate Limiting
- **Logging**: Winston

## Architecture 🏗️

The application follows a modular architecture with the following key components:

1. **Auth Module**: Handles user registration and authentication
2. **Alerts Module**: Manages price alerts CRUD operations
3. **Jobs Module**: Processes background price checks using Bull queue
4. **Common Services**: Error handling, logging, and middleware

### Key Design Decisions:

- Used Redis for job queue to handle price checks asynchronously
- Implemented correlation IDs for request tracking
- Added rate limiting to prevent API abuse
- Used Prisma for type-safe database operations
- Implemented comprehensive error handling and logging

## API Documentation 📚

API endpoints are documented using Swagger and available at `/api` when running the application.

### Main Endpoints:

- `POST /auth/register` - User registration
- `POST /auth/login` - User authentication
- `POST /alerts` - Create price alert
- `GET /alerts` - Get user's alerts
- `DELETE /alerts/:id` - Delete specific alert

## Security Measures 🔒

- JWT authentication
- Request rate limiting
- Helmet security headers
- CORS protection
- Input validation
- Error sanitization
- Secure password hashing

## Monitoring and Logging 📊

- Winston logger for structured logging
- Correlation IDs for request tracking
- Prometheus metrics at `/metrics`

## CI/CD Pipeline 🔄

GitHub Actions workflow includes:

- Code linting
- Unit and E2E tests
- Docker image building
- Automated deployments

## Performance Optimizations ⚡

- Database query optimization
- Background job processing
- Rate limiting for API protection

## Error Handling 🚫

Comprehensive error handling includes:

- Global exception filter
- Custom error types
- Structured error responses
- Detailed logging

## Future Improvements 🔮

- WebSocket support for real-time price updates
- Email notifications for triggered alerts
- Additional cryptocurrency exchange APIs
- Enhanced monitoring and alerting
- User preferences and settings

## Setup Instructions 🚀

### Prerequisites:

- Node.js 18+
- PostgreSQL
- Redis

# Docker Setup Guide 🐳

## Prerequisites

- Docker
- Docker Compose
- Git

## Steps

1. Clone the repository:

```bash
git clone git@github.com:thebozturk/crypto-alert-service.git
```

2. Navigate to the project directory:

```bash
cd crypto-price-alert-service
```

3. Start the application:

```bash
docker-compose up -v
```

4. Access the application at `http://localhost:3000`

5. Access the Swagger API documentation at `http://localhost:3000/api`

6. To stop the application, run:

```bash
docker-compose down -v
```

# Manual Setup Guide 🛠

1. Clone the repository:

```bash
git clone git@github.com:thebozturk/crypto-alert-service.git
```

2. Navigate to the project directory:

```bash
cd crypto-price-alert-service
```

3. Start the application:

```bash
npm run start:dev
```

# Example Logs 📝

<img width="999" alt="Image" src="https://i.imghippo.com/files/ecC7926Lg.png" />
