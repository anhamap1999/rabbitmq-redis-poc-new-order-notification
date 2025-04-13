# rabbitmq-redis-poc-new-order-notification

## PoC: Email Notification System for New Orders

### Objective

Build a modular backend system where placing a new order triggers an email notification, handled asynchronously. The goal is to learn how to integrate RabbitMQ, Redis, and Prisma in a structure that mirrors microservices, without the complexity of a full distributed system.

This project follows a modular monolith approach to simulate microservices while keeping development simple and fast.

### Use Case: Notify User After Placing an Order

- User places a new order (POST /orders)
- The system:
  - Stores the order in the database using Prisma
  - Publishes an event (order.created) to RabbitMQ
- A notification worker consumes this event and:
  - Retrieves user info from Redis cache (or DB if not cached)
  - Sends an email confirmation (mock or real)
  - Optionally stores logs to the DB

### Architecture

```
+-------------+         HTTP       +-------------------+      MQ       +--------------------+
|  Client     |  ----------------> | Order Service     |  ---------->  | Notification Worker|
| (Frontend)  |                    | (Producer)        |               | (Consumer)         |
+-------------+                    +-------------------+               +--------------------+
                                                                         |
                                                           +--------------------------+
                                                           | Redis (User Cache Layer) |
                                                           +--------------------------+
                                                                         |
                                                               +---------------------+
                                                               | PostgreSQL (Prisma) |
                                                               +---------------------+

```

### Tech Stack

| Component         | Technology                               |
| ----------------- | ---------------------------------------- |
| Queue             | RabbitMQ                                 |
| Cache             | Redis                                    |
| ORM / DB          | Prisma + PostgreSQL                      |
| Backend Framework | Node.js (Express or NestJS)              |
| Dev Tooling       | Docker, Nodemailer (mock email), Postman |

### What You'll Learn

- RabbitMQ: Producers, consumers, exchanges, queues, routing keys, DLQ => Async email delivery can fail, retry, or be delayed
- Redis: Caching user emails, preferences to speeds up user lookups
- Prisma: Define models, generate types, CRUD, migrations, DB relationships => Manage order/user data and store logs or retry records
- Clean Architecture: Decouple API logic, services, and messaging
- Asynchronous Design Pattern: Background processing with resilience

### Why Modular Monolith?

- Focus on core logic without full microservice overhead
- Simulate real-world service boundaries
- Easily run modules as separate processes (e.g., worker vs HTTP server)
- Split into microservices later with minimal refactor


### Run project
- Copy the .env.sample file into .env and fill out the values.

- Open a terminal, run Postgres by running:
```
docker compose up
```

- Open another terminal, run the migration for the database to sync schema and generate client by running:
```
yarn migrate-db
```
These logs printed in the terminal mean the migration and seed ran successfully:
```
...
Already in sync, no schema change or pending migration was found.

✔ Generated Prisma Client (v6.6.0) to .\node_modules\.prisma\client in 109ms


Environment variables loaded from .env
Prisma schema loaded from prisma\schema.prisma

✔ Generated Prisma Client (v6.6.0) to .\node_modules\.prisma\client in 78ms

Start by importing your Prisma Client (See: https://pris.ly/d/importing-client)

Tip: Need your database queries to be 1000x faster? Accelerate offers you that and more: https://pris.ly/tip-2-accelerate

Done in 14.46s.
```

- Run the seed script to create users in the database by running:
```
yarn seed-db
```
These logs printed in the terminal mean the migration and seed ran successfully:
```
Environment variables loaded from .env
Running seed command `tsx src/shared/prisma/seed.ts` ...
[Postgres] Seeded user data. Created IDs: 1, 2, 3, 4, 5, 6, 7, 8, 9, 10.

The seed command has been executed.
Done in 4.95s.
```

- Run the local order service by running:
```
yarn start-order-service
```
These logs printed in terminal mean the order service is running successfully:
```
Order service listening on port 4000
[RabbitMQ] Connected and channel created.
```

- Open another terminal, run the local notification service by running:
```
yarn start-notification-service
```
These logs printed in terminal mean the notification service is running successfully:
```
...
[Nest] 28728  - 04/13/2025, 9:31:31 AM     LOG [InstanceLoader] NotificationModule dependencies initialized +1ms
[Nest] 28728  - 04/13/2025, 9:31:32 AM     LOG [NestMicroservice] Nest microservice successfully started +163ms
[Nest] 28728  - 04/13/2025, 9:31:32 AM     LOG [NestMicroservice] Nest microservice successfully started +5ms
[Nest] 28728  - 04/13/2025, 9:31:32 AM     LOG [RoutesResolver] NotificationController {/notification}: +7ms
[Nest] 28728  - 04/13/2025, 9:31:32 AM     LOG [NestApplication] Nest application successfully started +5ms
Notification service is running on port 4001
```

- Open Postman (install at https://www.postman.com/downloads/), add a new HTTP request:
  - URL: http://localhost:4000/order
  - Method: POST
  - Body: 
  ```
    {
      "userId": <The id of one of the users created from the seed script. You can find the id in the logs>,
      "totalAmount": <A random int number>
    }
  ```

  - In the terminal running the order service, these logs should be printed:
  ```
  [RabbitMQ] Published message: {"event":"order.created","body":{"id":<>,"createdAt":"2025-04-13T03:14:14.406Z","updatedAt":"2025-04-13T03:14:14.406Z","userId":<>,"totalAmount":<>}}
  ```
  - After calling the API, in the terminal running the notification service, these logs should be printed:
  ```
  [RabbitMQ] Catch-All received: order.created {
    event: 'order.created',
    body: {
      id: <>,
      createdAt: '2025-04-13T03:14:14.406Z',
      updatedAt: '2025-04-13T03:14:14.406Z',
      userId: <>,
      totalAmount: <>
    }
  }
  [Redis] Get cached value for user:<> => Not found value.
  [Redis] Set cached value for user:<>
  [MockMailerService] Sent mail.
  ```
  or
  ```
  [RabbitMQ] Catch-All received: order.created {
    event: 'order.created',
    body: {
      id: <>,
      createdAt: '2025-04-13T03:14:14.406Z',
      updatedAt: '2025-04-13T03:14:14.406Z',
      userId: <>,
      totalAmount: <>
    }
  }
  [Redis] Get cached value for user:<> => Found value.
  [Redis] Set cached value for user:<>
  [MockMailerService] Sent mail.
  ```