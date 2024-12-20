# PostAway

**PostAway** is a social media platform built with **Node.js** and **Express**, designed for users to post, like, comment, and interact with posts. This project demonstrates how to create a scalable social media application with features for managing posts, likes, comments, and users while implementing authentication, error handling, and extended functionalities.

## Features

- **User Authentication**: Secure user login and registration using JWT.
- **Post Management**: Users can create, edit, delete, and view posts.
  - **Draft and Archive Posts**: Save posts as drafts or publish/archive them for different visibility options.
- **Filter and Sort Posts**:
  - **Filtering**: Users can filter posts based on captions to quickly find relevant content.
  - **Sorting**: Sort posts by engagement or post date for better organization and visibility.
- **Commenting System**: Add, edit, and delete comments on posts.
- **Liking System**: Like and unlike posts.
- **Bookmarking**: Bookmark and unbookmark posts for easy access later.
- **Pagination**: Implement pagination for posts and comments to enhance user experience and performance.
- **Error Handling**: Custom error classes and middleware for clean error messages.
- **Logging**: Middleware for logging important request data.
- **In-Memory Data Structures**: For posts, comments, and likes.
- **Modular Code Architecture**: Clean separation of concerns for scalability.
- **Swagger Documentation**: Comprehensive API documentation using Swagger 2.0.
- **Postman Collection**: Ready-to-use Postman collection for testing API endpoints.

## Technologies and Libraries

- **Node.js**: Server-side runtime.
- **Express.js**: Web framework for building the API.
- **JWT (Json Web Tokens)**: Secure authentication across routes.
- **ES6 Modules**: Maintain modular and organized code.
- **Winston**: Logging framework for capturing logs.
- **Multer**: Middleware for handling file uploads for post media.
- **Custom Error Handling**: Manage errors gracefully using a centralized error handler.
- **In-memory Data**: Manage posts, likes, and comments without an external database.

# Project Structure

The project follows an MVC (Model-View-Controller) architecture for clean separation of concerns, ensuring scalability and maintainability. Below is an overview of the project's structure:

## Directory Overview

- **`src/error-handler`**  
  Contains the logic for handling multiple user-defined errors. This modular approach allows for organized and centralized error management throughout the application.

- **`src/features`**  
  Encapsulates the core functionality of the application, managing posts, likes, comments, users, and bookmarks. This directory is divided into three main subdirectories:

  - **`src/features/controller`**  
    Responsible for handling routing logic and interactions with the respective models. Controllers manage the flow of data between models and views, ensuring a clear separation of concerns.

  - **`src/features/model`**  
    Contains the logic for data models related to posts, likes, comments, users, and bookmarks. This helps in maintaining a clear structure of data entities and their relationships.

  - **`src/features/router`**  
    Defines API routes for posts, comments, likes, users, and bookmarks. Keeping routing logic organized allows for easier modifications and scaling of API endpoints.

- **`src/middlewares`**  
  Includes custom middleware for error handling and logging. Middleware functions are crucial for processing requests and responses in a modular way.

- **`src/utils`**  
  Utility functions, such as validators, are organized in this directory. These functions promote code reusability and simplify the main application logic.

## Summary

This structured approach enhances code readability and maintainability, making it easier to collaborate and scale the project in the future. Each directory serves a specific purpose, allowing developers to locate and modify functionality efficiently.

## API Endpoints

1. **User Routes**: For registration, login, and authentication.
2. **Post Routes**: Create, update, delete, view, bookmark, draft and archive posts.
3. **Like Routes**: Like/unlike posts.
4. **Comment Routes**: Add, update, delete, and retrieve comments.

## Dependencies

Key dependencies include:

- **express**: For creating the server and managing routing.
- **jsonwebtoken**: For creating and verifying JWT tokens.
- **winston**: For logging system events and errors.
- **multer**: For handling file uploads.
- **nodemon** (Dev Dependency): For auto-restarting the server during development.

## How to Run the Project

1. Clone the repository:
   ```bash
   git clone https://github.com/sho4516/Postaway.git
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the server:
   ```bash
   npm start
   ```
4. Access Swagger documentation at [http://localhost:3500/api-docs/#/](http://localhost:3500/api-docs/#/) after starting the server.

## Future Enhancements

- Persistent database integration (e.g., MongoDB).
- Full test coverage with tools like Mocha or Jest.
