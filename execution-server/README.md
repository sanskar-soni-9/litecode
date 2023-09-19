Execution Server Status: Active

Note: The Execution server is currently hosted on Azure Kubernetes Service. Due to the high cost of running the cluster, the server will be shut down after some days.

# Litecode Project

Welcome to Litecode, a working demo of a coding platform similar to LeetCode. Litecode provides user authentication, code submission, and execution features, with a unique architecture involving Kubernetes and RabbitMQ.

## Project Overview

Litecode consists of three main components:

1. **Client**: The front-end of the application built with Vite, React, SASS, Prism.js, and React Router DOM.

2. **Main Server**: The back-end server implemented with Node.js and Express.js. It handles user authentication, manages submissions and provide API for CRUD operations.

3. **Execution Server**: This server runs within a Kubernetes cluster. It dynamically creates pods to execute user-submitted Python code and returns the results.

## How it Works

Litecode's workflow:

1. User submits code via the Client, triggering a POST request to the Main Server.

2. The Main Server sends the code to a RabbitMQ queue attached with a callback queue for result.

3. The Execution Server, within the Kubernetes cluster, consumes messages from the queue.

4. It creates Kubernetes pods to execute the code and captures the execution results.

5. Results are sent back to the Main Server via a callback queue.

6. The Main Server responds to the user's POST request with the code execution results.

7. The Execution Server deletes the pods created for the execution.

## Technologies Used

- Front-end: Vite, React, SASS
- Back-end (Main Server): Node.js, Express.js
- Database: PostgreSQL
- Execution Server: Kubernetes, Node.js
- RabbitMQ

## Contact

If you have any questions, suggestions or if you have found any bugs, feel free to contact me.
