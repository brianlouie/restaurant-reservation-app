# Periodic Tables

Link to deployed application - https://starter-restaurant-reservation-frontend-nsdz.onrender.com

### Summary
An application designed for restaurant managers that allows you to create a reservation at a restaurant for a specified date and time. You can create tables, which you can seat the reservations at. You can search by mobile number and find a history of all booked, seated, finished, and cancelled reservations.

#### Technology used: React.js, Bootstrap, CSS, Node.js, Express, and PostgreSQL.

### API
| Request  | Path        |     Description             |
| ------------- | ------------- | ------------------- |
| GET | /reservations  |     	list all reservations, sorted by time                |
| POST  | /reservations  |     	create a new reservation                |
| GET | /reservations/:reservation_id	| 	read a reservation with reservation_id |
| PUT | /reservations/:reservation_id   | update a reservation with reservation_id    |
| PUT | /reservations/:reservation_id/status | update the status of a reservation with reservation_id|
| GET | /reservations?mobile_number=XXXXXXXXXX | list reservations for a mobile number |
| GET | /reservations?date=XXXX-XX-XX    | list reservations for a specified date  |
| GET | /tables | 	list all tables ordered by table name|
| POST | /tables | 	create a new table |
| PUT | /tables/:table_id/seat | 	assign reservation to a table, makes table "occupied"|
| DELETE | 	/tables/:table_id/seat |  free up an occupied table, changes status of reservation to "finished" |

## Details

### Dashboard

The dashboard page shows all reservations for a specified date, and shows all tables with their current availability.

![Capture](https://user-images.githubusercontent.com/102555918/217460195-f4cde6c2-7a82-4f32-b0f0-34e68f774bd3.PNG)

### Create Reservation

This page lets you create a reservation with the required fields: first name, last name, mobile number, date of reservation, time of reservation, and number of people in the party.

![create](https://user-images.githubusercontent.com/102555918/217461057-028d8a87-582a-4d44-aeb8-dbdd369f4908.PNG)

### Edit Reservation

The Edit Reservation page lets you edit a reservation with the status of "booked". The form is prefilled with the current information of the reservation you are editing.

![edit reservation](https://user-images.githubusercontent.com/102555918/217463434-e4c2cde5-be2c-4866-9f35-f032a79d4d19.PNG)

### Create Table

The New Table page lets you create a new table in which you assign the name and capacity.

![create table](https://user-images.githubusercontent.com/102555918/217462904-87930247-79ec-4feb-84da-e0020476aa45.PNG)


### Seat Reservation

Clicking on the "Seat" button next to a booked reservation will take you to the Seat Reservation page, which shows a list of currently unoccupied tables where you can seat the reservation, and changes the status of the table to "occupied".

![seat reservation](https://user-images.githubusercontent.com/102555918/217465021-b8250da7-fd49-40e2-9199-f3fb2f443412.PNG)

### Search

The Search page allows you to find all current and past reservations with just a phone number.

![search](https://user-images.githubusercontent.com/102555918/217465566-2b438977-9183-4f40-af16-6d0a11916295.PNG)

## Installation

1. Fork and clone this repository.
1. Run `cp ./back-end/.env.sample ./back-end/.env`.
1. Update the `./back-end/.env` file with the connection URL's to your ElephantSQL database instance.
1. Run `cp ./front-end/.env.sample ./front-end/.env`.
1. You should not need to make changes to the `./front-end/.env` file unless you want to connect to a backend at a location other than `http://localhost:5001`.
1. Run `npm install` to install project dependencies.
1. Run `npm run start:dev` to start your server in development mode.
