Execution Server Status: Inactive

Note: The Execution server is currently hosted on Azure Kubernetes Service. Due to the high cost of running the cluster, the server will be shut down after some days.

![LiteCode GIF](/litecode.gif)

# Litecode Project

Welcome to Litecode, a working demo of a coding platform LeetCode. LiteCode provides user authentication, code submission, and execution features, with a unique architecture involving Kubernetes and RabbitMQ.

## Project Overview

Litecode consists of three main components:

1. **Client**: The front-end of the application built with Vite, React, SASS, Prism.js, and React Router DOM.

2. **Main Server**: The back-end server implemented with Node.js and Express.js. It handles user authentication, manages submissions and provide API for CRUD operations.

3. **Execution Server**: This server runs within a Kubernetes cluster. It dynamically creates pods to execute user-submitted Python code and returns the results.

## How it Works

Litecode's workflow:

1. User submits code via the Client, triggering a POST request to the Main Server.

2. The Main Server attaches a unique callback queue with the user's code and sends it to a RabbitMQ queue, and starts consuming the callback queue for the result.

3. The Execution Server, within the Kubernetes cluster, consumes messages from the queue.

4. It creates Kubernetes pod wuith python:3 image to execute the code and captures the execution results.

5. Results are sent back to the Main Server via the callback queue and pod gets deleted.

6. The Main Server gets the result of the execution, deletes the callback queue and responds to the user's POST request with the results.

## Technologies Used

- Front-end: Vite, React, SASS
- Back-end (Main Server): Node.js, Express.js
- Database: PostgreSQL
- Execution Server: Kubernetes, Node.js
- RabbitMQ

## Contact

If you have any questions, suggestions or if you have found any bugs, feel free to contact me.
[Discord](https://discordapp.com/users/516889806677213185)
