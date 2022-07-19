# CRM back
Backend for the CRM project.
Based on NodeJs and Express in Typescript.

Offers REST services for the resources product, client and spanco.

## Run locally
- start db service :
docker-compose up maria-db

*maria-db for compatibility of the database on o2switch.*
  
- start node
npm run start-dev
  
The server creates a user admin@dtcf.com with password changeit

## Github Actions
Automatic deployement on o2Switch on push on master branch.