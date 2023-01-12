# Project - Media API

## Introduction

Most of us consume some kind of entertainment in our daily lives, be it books, TV or something else,
you probably go through tens of different pieces of entertainment each year.
As a part of our backend course at TAMK,
I wanted to make an API dedicated to keeping track of all the media I consume almost daily.
As someone who enjoys manga, movies and tv series a lot,
some day I think I'll go back and look at all the things I have experienced, and I expect
a rush of memories flooding my mind.
_Nerdy, I know._

## Server address and endpoints

You can find the backend server at [Render](https://api-project-qk43.onrender.com/)

### Endpoints

-   GET /api/media
-   POST /api/media
-   PUT /api/media
-   GET /api/media/:id
-   DELETE /api/media/:id
-   GET /api/media/title/:title
-   GET /api/media/type/:type

-   GET /api/types
-   POST /api/types
-   PUT /api/types
-   GET /api/types/:id
-   DELETE /api/types/:id
-   GET /api/types/name/:name

## Instructions for running locally

To run this application you need to have [Node](https://nodejs.org/en/download/) installed.

Once you have cloned the repository on your PC, navigate to it, open your CLI and enter:
`npm install`

Next step is to create a new SQL database. Open your preferred SQL tool and run the following commands in the database of your liking:

```
CREATE TABLE IF NOT EXISTS types (
    id INT AUTO_INCREMENT PRIMARY KEY,
    type VARCHAR(25) NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS media_consumed (
    id INT AUTO_INCREMENT PRIMARY KEY,
    date_started DATE,
    date_finished DATE,
    rating DECIMAL(2,0),
    title VARCHAR(255) NOT NULL UNIQUE,
    type_id INT NOT NULL,
    FOREIGN KEY (type_id) REFERENCES types(id) ON DELETE RESTRICT ON UPDATE CASCADE
);

INSERT INTO types (type) VALUES ('Manga');

INSERT INTO media_consumed (date_started, date_finished, rating, title, type_id)
VALUES ('2022-11-13', '2022-11-20', 10, 'Girls Last Tour', 1);
```

Great! Don't worry if you haven't read Girls Last Tour, you can delete it later. We are using it to test.

Next you need to create a .env file into the root directory of the repository. Enter the following into the .env file:

```
MYSQL_HOST = localhost
MYSQL_PASSWORD = your password
MYSQL_DATABASE = your database name
MYSQL_USERNAME = root
PORT = 5000
```

Awesome! Now, you can check that everything is working properly!

Run the app:
`npm run dev`

Test the app:
`npm run test`

If you followed all the steps, you should pass all the tests.

Good job! You're ready to use the Media API! Try out some of the RESTful requests from localhost.rest

## Project self evaluation

Time for some self evaluation. Overall I think I succeeded at making a decent version of what I wanted to accomplish.

There's a few places that I'd definitely want to return to, if I continue making this project portfolio material. For example the media/title, media/type and types/name endpoints could use some polish or reformatting. Currently they do their jobs but feel clunky, and the error handling isn't perfect. Besides them, I'd like to make the date format that JavaScript returns by default a bit prettier and identical to the one that the SQL database stores.

Other than those sore thumbs, I think I managed to pull together a decent framework for something bigger. I don't want to be too harsh on myself, and I want to give myself a pat on the back for a few of the testing solutions that I came up with.

At first types weren't in their own table, which I foresaw causing unexpected problems for users in the future. I think moving them to their own table was a smart idea and helps with managing the database.

As for documentation. I feel like I could expand on it and I should have done more of it during the actualy development of the application.

If I put together a simple frontend and round those edges a little bit, I could see myself using this as a sort of diary for all the different series I watch and read. And to that end I think I have succeeded at my goal for now.

## Final words

I had a lot of fun and a lot of struggles with this one. Sometimes I'd get stuck on a typo for embarrassingly long and sometimes dealing with the SQL queries was awkward. But, I managed somehow and learned a lot in the process.
Thank you!
