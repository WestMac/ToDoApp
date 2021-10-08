# ToDoApp
Web todo APP, CRUD, Auth, CI/CD, Tests

Runtime Environment: &nbsp;**Node.js**\
Main Framework: &nbsp;**Express.js**\
Templating Engine: &nbsp;**eJS**\
ORM: &nbsp;**Sequelize**\
Tests: &nbsp;**JEST && SuperTest**\
Database: &nbsp;**PostgreSQL**\
Auth: &nbsp;**JWT**\
CI/CD: &nbsp;**Github Actions**

## Instalation

Clone the repo and install dependecies

```
git clone https://github.com/WestMac/ToDoApp.git
cd ToDoApp && npm install
```

Go to toDoApp -> config -> config.json and provide your database info. For default it is 
PostgreSQL on port 5432 with username postgres and pass root

## Running 

On first run you need to create database and then you can run project.
It will be hosted on port 3000 by default

```
cd yourLocation/ToDoApp
npx sequelize-cli db:create
npx sequelize-cli db:migrate
node server.js
```

## Test

To run tests just type in project directory

```
npm test
```
