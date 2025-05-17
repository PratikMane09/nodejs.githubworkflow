# Node.js MongoDB Task API

A simple Node.js application with MongoDB integration and GitHub Actions workflow for deployment.

## Features

- RESTful API for task management
- MongoDB integration with Mongoose
- ES Module syntax
- GitHub Actions workflow for automated deployment
- Secure handling of environment variables

## Project Structure

```
nodejs-mongo-api/
├── .github/workflows/  - GitHub Actions workflow configurations
├── src/
│   ├── config/         - Database and other configurations
│   ├── controllers/    - API controllers
│   ├── models/         - MongoDB schemas and models
│   ├── routes/         - API routes
│   └── app.js          - Main application entry point
├── .env.example        - Example environment variables
├── .gitignore          - Git ignore file
├── package.json        - Project dependencies
└── README.md           - Project documentation
```

## Setup & Installation

1. Clone the repository
2. Install dependencies: `npm install`
3. Create a `.env` file based on `.env.example`
4. Start the development server: `npm run dev`

## Deployment

This project uses GitHub Actions for automatic deployment. The workflow is configured to:

1. Install dependencies
2. Build the project
3. Deploy to your server via SSH
4. Use GitHub secrets for secure credentials

## GitHub Actions Configuration

To set up the GitHub Actions deployment, add the following secrets to your repository:

- `SSH_HOST`: Your server IP 
- `SSH_PORT`: SSH port
- `SSH_USER`: SSH username 
- `SSH_PRIVATE_KEY`: SSH private key
- `MONGODB_URI`: Your MongoDB connection string
- `PORT`:The port your application will run on (e.g., 5000)

## API Endpoints

- `GET /api/tasks` - Get all tasks
- `POST /api/tasks` - Create a new task
- `GET /api/tasks/:id` - Get a specific task
- `PUT /api/tasks/:id` - Update a task
- `DELETE /api/tasks/:id` - Delete a task
