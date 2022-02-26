## Microservice Assignment

## About The Project

The project contains three microservices and an api gateway to proxy all the incoming requests and outgoing responses -

- User Service
- User Interaction Service
- Content Service

The database used is mongo db.

### Built With

[Node.js](https://nodejs.org/en/) [Express.js](https://expressjs.com/) [Mongo db](https://www.mongodb.com/) [Docker](https://www.docker.com/)

## Documentation

#### Postman API Documentation:

https://documenter.getpostman.com/view/18897300/UVkpPbfN

#### You can import the Postman collection into your postman :

In Your Postman, go to Import -> Link -> copy & paste the below link:
https://www.postman.com/collections/1760eff4fc45ada7edf6

## Getting started

### Prerequisites

Should have docker installed and running.

### Installation

1. Clone the repo
   ```sh
   git clone https://github.com/mayankkumar28/backendAssignment.git
   ```
2. Run docker compose
   ```sh
   docker-compose up --build
   ```
3. The mongo database can be viewed at ***http://localhost:8081/***
4. The database is empty for the first run, you can ingest data to db from csv files located in test folders.Use the UPLOAD CSV request in the postman collection for data ingestion.
5. To make requests, use the [Postman collection](https://www.postman.com/collections/1760eff4fc45ada7edf6). (Import link in your postman)
6. To Stop docker
   ```sh
   docker-compose down
   ```
   > _Everything has been dockerized and smoothly runs on docker. If you don't want to use Docker, simply perform the `npm install` and `npm start` instructions in each of the three services and api gateway folders. You'll also need to make.env files for each one._

## Working

### Request flowchart

![Flowchart](/docs/flowchart.png)

### Sequence Diagram (Overview)
> Db Accessor (and db itself) is different for all microservices.

![Sequence Diagram](/docs/sequenceDiagram.png)

### Database Schema

![Schema](/docs/schema.png)

> **_NOTE: Admin Users (with isAdmin field =true) can perform any operation on behalf of any user._**

## Limitations

- The api gateway is employing proxy to redirect requests to other microservices, which is suitable given the scale of this project. A more robust gateway and load balancer is required for real-world projects.
- userId is currrently being considered as a unique string that identifies a user (generally email). There can be a check to verify the format of email-ids in future.
- As the system scales, the speed and size of interactions service will be limited by array of likedContents and readContents. To solve this problem, we can change the schema of this service : {userId : String, contentId: String, isRead:Boolean, isLiked : Boolean}.
