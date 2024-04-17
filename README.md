## Client

- Vite
- React
- Mantine
- TypeScript

## Server

- Go
- Chi
- Postgresql

```mermaid
---
title: Flowchart
---
flowchart TD
  CreateBtn[Create Vote Btn] --> IssueKey[Issue a token]
  JoinBtn[Join Vote Btn] --> IssueKey
  IssueKey --If the token is new--> CreateVote["`
  Create Vote
  Options
    1. Only logged in users (works only if the creator is logged in)
    2. Set expiration date (essential)
    3. Set maximum vote count
  `"]
  IssueKey --If the token is not new--> Vote[Join the vote]
  CreateVote --> Expiration[Set expiration date or vote count]
```

```sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE polls (
    id SERIAL PRIMARY KEY,
    title VARCHAR(100) NOT NULL,
    description TEXT,
    creator_id INT REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE options (
    id SERIAL PRIMARY KEY,
    option_text TEXT NOT NULL,
    poll_id INT REFERENCES polls(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE votes (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    option_id INT REFERENCES options(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```
