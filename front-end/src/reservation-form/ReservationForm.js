import React, { useState, useEffect } from "react";
import { useHistory, useParams } from "react-router-dom";
import ErrorAlert from "../layout/ErrorAlert";
import { updateReservation, listReservations, createReservation } from "../utils/api";

function ReservationForm(){
    const history = useHistory();
    const { reservation_id } = useParams();


    const [reservation, setReservation] = useState({
      first_name: "",
      last_name: "",
      mobile_number: "",
      reservation_date: "",
      reservation_time: "",
      people: "",
    });
  
    const [error, setError] = useState(null);
  
    useEffect(loadReservation, [reservation_id]);

    function loadReservation() {
        if(!reservation_id) return
      const abortController = new AbortController();
      setError(null);
      listReservations({ reservation_id: reservation_id }, abortController.signal)
        .then(setReservation)
        .catch(setError);
      return () => abortController.abort();
    }

    function cancelHandler() {
      history.goBack();
    }
  
    function isValidDate(){
      const combined = reservation.reservation_date + " " + reservation.reservation_time
      const checkDate = new Date(combined)
      const today = new Date();
      if(checkDate.getDay() === 2 && checkDate < today){
        setError("date cannot be a Tuesday and it cannot be in the past")
        return false
      } else if (checkDate.getDay() === 2){
        setError("date cannot be a Tuesday")
        return false
      } else if (checkDate < today){
        setError("date cannot be in the past")
        return false
      } else if (!isValidTime()){
        setError("time needs to be between 10:30 AM and 9:30 PM")
        return false
      }
      return true
    }

    function isValidTime(){
      const time = reservation.reservation_time
      const hour = Number(time.split(':')[0])
      const minutes = Number(time.split(':')[1])

      if(hour < 10 || hour > 21) return false
      if(hour === 10 && minutes < 30) return false
      if(hour === 21 && minutes > 30) return false

      return true
    }

    function submitHandler(event) {
      event.preventDefault();
      const abortController = new AbortController();
      isValidDate()
      //no reservation_id means the user is on the New Reservation page
      if(!reservation_id){
        if(isValidDate()){
        createReservation(reservation, abortController.signal)
          .then(() => {
            history.push(`/dashboard?date=${reservation.reservation_date}`);
          })
          .catch(setError);
        }
        return () => abortController.abort();
      } else {
      if(isValidDate()){
      updateReservation(reservation, reservation_id, abortController.signal)
        .then(() => {
            history.push(`/dashboard?date=${reservation.reservation_date}`);
        })
        .catch(setError);
      }
      return () => abortController.abort();
    }
    }
  
    function changeHandler({ target: { name, value } }) {
      setReservation((previousReservation) => ({
        ...previousReservation,
        [name]: name === "people" ? Number(value) : value,
      }));
    }

    return (
        <>
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
        </>
    )
}

export default ReservationForm;