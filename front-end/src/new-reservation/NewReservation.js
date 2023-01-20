import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import ErrorAlert from "../layout/ErrorAlert";
import { createReservation } from "../utils/api";

function NewReservation(){
    const history = useHistory();

    const [reservation, setReservation] = useState({
      first_name: "",
      last_name: "",
      mobile_number: "",
      reservation_date: "",
      reservation_time: "",
      people: "",
    });
  
    const [error, setError] = useState(null);
  
    function cancelHandler() {
      history.goBack();
    }
  
    function submitHandler(event) {
      event.preventDefault();
      createReservation(reservation)
        .then(() => {
          history.push(`/dashboard?date=${reservation.reservation_date}`);
        })
        .catch(setError);
    }
  
    function changeHandler({ target: { name, value } }) {
      setReservation((previousReservation) => ({
        ...previousReservation,
        [name]: name === "people" ? Number(value) : value,
      }));
    }

    return (
      <main>
        <h1 className="mb-3">Create Reservation</h1>
        <ErrorAlert error={error} />
        <form onSubmit={submitHandler} className="mb-4">
          <div className="row mb-3">
            <div className="col-6 form-group">
              <label className="form-label" htmlFor="first_name">
                First Name
              </label>
              <input
                className="form-control"
                id="first_name"
                name="first_name"
                type="text"
                value={reservation.first_name}
                onChange={changeHandler}
                required={true}
              />
            </div>
            <div className="col-6">
              <label className="form-label" htmlFor="last_name">
                Last Name
              </label>
              <input
                className="form-control"
                id="last_name"
                name="last_name"
                type="text"
                value={reservation.last_name}
                onChange={changeHandler}
                required={true}
              />
            </div>
          </div>
          <div className="row mb-3">
            <div className="col-6 form-group">
              <label className="form-label" htmlFor="mobile_number">
                Mobile Number
              </label>
              <input
                className="form-control"
                id="mobile_number"
                name="mobile_number"
                type="text"
                value={reservation.mobile_number}
                onChange={changeHandler}
                required={true}
              />
            </div>
            <div className="col-6">
              <label className="form-label" htmlFor="reservation_date">
                Date of Reservation
              </label>
              <input
                className="form-control"
                id="reservation_date"
                name="reservation_date"
                type="date"
                placeholder="YYYY-MM-DD"
                pattern="\d{4}-\d{2}-\d{2}"
                max="180"
                min="-180"
                value={reservation.reservation_date}
                onChange={changeHandler}
                required={true}
              />
            </div>
          </div>
          <div className="row mb-3">
            <div className="col-6 form-group">
              <label className="form-label" htmlFor="reservation_time">
                Time of Reservation
              </label>
              <input
                className="form-control"
                id="reservation_time"
                name="reservation_time"
                type="time"
                placeholder="HH:MM"
                pattern="[0-9]{2}:[0-9]{2}"
                value={reservation.reservation_time}
                onChange={changeHandler}
                required={true}
              />
            </div>
            <div className="col-6">
              <label className="form-label" htmlFor="people">
                Number of people in the party
              </label>
              <input
                className="form-control"
                id="people"
                name="people"
                type="number"
                min="1"
                value={reservation.people}
                onChange={changeHandler}
                required={true}
              />
              {/* <small className="form-text text-muted">
                Enter a value between 1 and 6.
              </small> */}
            </div>
          </div>
          <div>
            <button
              type="button"
              className="btn btn-secondary mr-2"
              onClick={cancelHandler}
            >
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Submit
            </button>
          </div>
        </form>
      </main>
    );
}

export default NewReservation;