import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import ErrorAlert from "../layout/ErrorAlert";
import { listReservations, updateReservationStatus } from "../utils/api";

function Search() {
  const history = useHistory();

  const [search, setSearch] = useState([]);
  const [lastSearch, setLastSearch] = useState();
  const [error, setError] = useState(null);

  const [number, setNumber] = useState({
    mobile_number: "",
  });

  function submitHandler(event) {
    event.preventDefault();
    const abortController = new AbortController();
    setError(null);
    listReservations(
      { mobile_number: number.mobile_number },
      abortController.signal
    )
      .then(setSearch)
      .then(setLastSearch(number.mobile_number))
      .catch(setError);
    return () => abortController.abort();
  }

  function changeHandler({ target: { name, value } }) {
    setNumber((previousNumber) => ({
      ...previousNumber,
      [name]: value,
    }));
  }

  function cancelReservationButtonHandler(reservation_id) {
    if (
      window.confirm(
        "Do you want to cancel this reservation? This cannot be undone."
      )
    ) {
      const abortController = new AbortController();
      updateReservationStatus(
        reservation_id,
        "cancelled",
        abortController.signal
      )
        .then(
          listReservations(
            { mobile_number: lastSearch },
            abortController.signal
          )
        )
        .catch(setError);
    } else {
    }
  }

  const reservationRows = search.map((reservation) => (
    <tr key={reservation.reservation_id}>
      <th scope="row">{reservation.reservation_id}</th>
      <td>{reservation.first_name}</td>
      <td>{reservation.last_name}</td>
      <td>{reservation.mobile_number}</td>
      <td>{reservation.reservation_date}</td>
      <td>{reservation.reservation_time}</td>
      <td>{reservation.people}</td>
      <td>{reservation.created_at}</td>
      <td>{reservation.status}</td>{" "}
      {reservation.status === "booked" ? (
        <>
          <td>
            {" "}
            <button
              onClick={() =>
                history.push(`/reservations/${reservation.reservation_id}/seat`)
              }
              className="btn btn-secondary"
            >
              Seat
            </button>
          </td>
          <td>
            {" "}
            <button
              onClick={() =>
                history.push(`/reservations/${reservation.reservation_id}/edit`)
              }
              className="btn btn-secondary"
            >
              Edit
            </button>
          </td>
        </>
      ) : (
        <>
          <td></td>
          <td></td>
        </>
      )}
      {reservation.status !== "finished" &&
      reservation.status !== "cancelled" ? (
        <td>
          {" "}
          <button
            onClick={() =>
              cancelReservationButtonHandler(reservation.reservation_id)
            }
            className="btn btn-secondary"
          >
            Cancel
          </button>
        </td>
      ) : (
        <>
          <td></td>
        </>
      )}
    </tr>
  ));

  return (
    <main>
      <h1 className="mb-3">Search</h1>
      <ErrorAlert error={error} />
      <form onSubmit={submitHandler} className="mb-4">
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
              value={number.mobile_number}
              onChange={changeHandler}
              required={true}
            />
          </div>
        </div>
        <div>
          <button type="submit" className="btn btn-primary">
            Find
          </button>
        </div>
        {search.length === 0 ? (
          <p>No reservations found</p>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col">First Name</th>
                <th scope="col">Last Name</th>
                <th scope="col">Mobile Number</th>
                <th scope="col">Date</th>
                <th scope="col">Time</th>
                <th scope="col">People</th>
                <th scope="col">Created</th>
                <th scope="col">Status</th>
                <th scope="col">Reserve Table</th>
                <th scope="col">Change Reservation</th>
                <th scope="col">Cancel Reservation</th>
              </tr>
            </thead>
            <tbody>{reservationRows}</tbody>
          </table>
        )}
      </form>
    </main>
  );
}

export default Search;
