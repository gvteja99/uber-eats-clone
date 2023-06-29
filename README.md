# Uber Eats Prototype

This project is a comprehensive food delivery application that mimics the functionality of UberEats. The project is built using a microservices architecture and uses a variety of technologies.

## Tech Stack

**Frontend**: The frontend of the application is built using React. It provides a user-friendly interface for customers to manage profiles, search for restaurants, filter food preferences, and place orders. Restaurants can edit their menus, view orders, and update delivery status.

**Backend**: The backend of the application is divided into two parts: a server built with Express.js and Node.js, and two databases - MySQL and MongoDB. The Express.js server handles various functionalities such as user authentication, restaurant management, and order management. The MySQL and MongoDB servers are used for data persistence.

**Kafka**: Kafka is used as a message broker to handle real-time data feeds and to scale the application horizontally to handle additional load.

**GraphQL**: GraphQL is used for efficient data querying and manipulation in the third phase of the project.

## Getting Started

To get started with the project:

**Frontend**
1. Clone the repository's front end folder "frontend" into any machine having Node.js installed on it.
2. Open the terminal in the folder "frontend".
3. Execute "npm install" to install all the dependencies.
4. Execute "npm start" to run the front end server.

**Backend**
1. Clone the repository's Backend folder "backend-mongoDB" or "backend-mysql" into any machine having Node.js installed on it.
2. Open the terminal in the folder "backend-mongoDB" or "backend-mysql".
3. Execute "npm install" to install all the dependencies.
4. For MySQL, create a database "ubereats_db" in MySQL database server and execute the SQL dump to generate the schema.
5. Update pool.js file in backend folder with database name and connection details.
6. Update the config.json file in backend folder with frontend server's IP address and port.
7. Execute "node index" or "npm start" to run the backend server.

**Kafka Backend**
1. Clone the repository's Kafka Backend folder "kafka-backend" into any machine having Node.js installed on it.
2. Open the terminal in the folder "kafka-backend".
3. Execute "npm install" to install all the dependencies.
4. Execute "node server" or "npm start" to run the Kafka backend server.

Open the browser and navigate to Front end server's IP address with Port number (Eg: 127.0.0.1:3000) to find the landing page.

## Features

- Customer Profile Management
- Restaurant Search and Food Preference Filtering
- Order Placement
- Restaurant Menu Management
- Order Management
- Delivery Status Updates

Please refer to the individual directories for more specific details about each part of the application.
