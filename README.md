# Move37 Real-Time Polling Backend
# Project Overview

This is a backend service for a real-time polling application.
Users can create polls, vote on options, and see live results using WebSockets.

The backend provides RESTful APIs for users, polls, and votes, and real-time updates for poll results.

---
# Tech Stack
- Node.js + Express.js-backend framework
- PostgreSQL – Relational database
- Prisma ORM – Database modeling & queries
- Socket.IO – Real-time communication
- bcryptjs – Password hashing


## Prisma Schema Overview

### Models
- **User**: id, name, email, passwordHash
- **Poll**: id, question, isPublished, createdAt, updatedAt, creatorId
- **PollOption**: id, text, pollId
- **Vote**: id, userId, pollOptionId

### Relationships
- **One-to-Many**: User → Poll, Poll → PollOption
- **Many-to-Many**: User ↔ PollOption via Vote


## Setup Instructions

### 1. Clone the repository
- Link: [https://github.com/coderchaubey/Real-time-polling-backend.git]
- cd Real-time-polling-backend

### 2. Install dependencies
- npm install

### 3. Setup environment variables
- Create a **.env** file and paste the following with your own USER, PASSWORD and DB as needed:
- DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/DB"

### 4. Generate Prisma client & migrate
- npx prisma generate
- npx prisma migrate dev --name init

### 5. Start the server
- node src/server.js
- Server running on: [http://localhost:3000](http://localhost:3000)

### API Endpoints

## Users

### For creating new users
<details>
<summary><code>POST</code> <code>/users/createuser</code> - Create a new user</summary>

**Request Body:**
{
"name": "Alice",
"email": "alice@example.com",
"password": "securepassword"
}
</details>

### For getting users
<details>
<summary><code>GET</code> <code>/users</code> - Get all users</summary>

**Response:**
[
    {
        "id": 1,
        "name": "Alice",
        "email": "alice@example.com"
    },
    {
        "id": 2,
        "name": "John",
        "email": "john@example.com"
    },
    {
        "id": 3,
        "name": "xyz",
        "email": "xyz@example.com"
    }
]

</details>

---

## Polls

### Create Poll
<details>
<summary><code>POST</code> <code>/polls/createpoll</code> - Create a new poll with options</summary>

**Request Body:**
{
"userId": 1,
"question": "What is your favorite programming language?",
"options": ["JavaScript", "Python", "Java"]
}

</details>

### Getting All Polls
<details>
<summary><code>GET</code> <code>/polls</code> - Get all polls</summary>

**Response:**
[
    {
        "id": 1,
        "question": "What is your favorite programming language?",
        "isPublished": true,
        "createdAt": "2025-09-13T12:55:04.984Z",
        "updatedAt": "2025-09-13T12:55:04.984Z",
        "creatorId": 1,
        "options": [
            {
                "id": 1,
                "text": "Java",
                "pollId": 1
            },
            {
                "id": 2,
                "text": "Python",
                "pollId": 1
            },
            {
                "id": 3,
                "text": "JavaScript",
                "pollId": 1
            }
        ],
        "creator": {
            "id": 1,
            "name": "Alice"
        }
    }
]
</details>

### Get Single Poll + Results
<details>
<summary><code>GET</code> <code>/polls/:id</code> - Get a single poll with results</summary>

**Parameters:**
- `id` (path) - Poll ID

**Response:**
{
    "pollId": 3,
    "question": "What comes after sunday?",
    "results": [
        {
            "optionId": 7,
            "option": "Work",
            "votes": 2
        },
        {
            "optionId": 8,
            "option": "Monday",
            "votes": 1
        },
        {
            "optionId": 9,
            "option": "leave",
            "votes": 1
        }
    ]
}

</details>

---

## Votes

### Cast Vote
<details>
<summary><code>POST</code> <code>/votes/castvote</code> - Cast a vote and update live</summary>

**Request Body:**
{
"userId": 2,
"pollOptionId": 1
}

</details>

---
## Notes
- Passwords are hashed using bcryptjs
- The project uses minimal frontend for testing live updates
- All endpoints and sockets are fully functional
- Error handling is implemented for invalid requests

## Frontend Testing:
- client.html file is created under /public directory
- Make sure the server is running
- Link: [http://localhost:3000/client.html](http://localhost:3000/client.html)
- Provide pollId in the input box
- Click on `Join Poll` button (Now the updates will be shown for that particular selected poll to all the joined clients)
- [Cast a vote using Postman](#cast-vote)
![Frontend Simple UI](./images/Frontend_Live_Update.png)