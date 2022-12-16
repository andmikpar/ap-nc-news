# Northcoders News API

This project is a an API built using Express, node and PSQL. It hosts news articles, which clients can search by topics, or authors, they can be ordered by ID number or date, and can be sorted in ascending order or the default descending.

You can find the hosted version of the API by following this link ---> https://nc-news-k43r.onrender.com

## Setup

To get this project setup on your local machine, first navigate to the working directory in your terminal and then clone this repo down. Once you have done this you will need to run npm install in your terminal to get all the dependencies setup.

For this project you will need to have a minimum of

- Node.js version 1.0.0 or above

- Postgres version 8.7.3 or above

### Databases

The next step is to get the databases ready. First, in order to create the databases you will need to enter npm run setup-dbs in your terminal. Then enter npm run seed and this will populate the data into the two databases.

### Environment Variables

In order to actually run the project locally, you will need to create two .env files, one named .env.test which contains PGDATABASE=nc_news_test, and the other named .env.development, containing PGDATABASE=nc_news.

Don't forget to check these .env files are included in the .gitignore file.

## Testing

The test suite is set up to reseed the database before each test, and end the connection with the database when all tests have completed.

## Endpoints

You can make a request to the endpoint of /api and it will return information about all available endpoints currently available on the API.
