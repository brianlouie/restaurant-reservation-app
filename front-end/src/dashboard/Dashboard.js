import React, { useEffect, useState } from "react";
import { listReservations } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";
import { useHistory } from "react-router-dom";
import { today } from "../utils/date-time";

/**
 * Defines the dashboard page.
 * @param date
 *  the date for which the user wants to view reservations.
 * @returns {JSX.Element}
 */
function Dashboard({ date }) {
  const [reservations, setReservations] = useState([]);
  const [reservationsError, setReservationsError] = useState(null);
  let searchParams = new URLSearchParams(document.location.search);
  const history = useHistory();

  useEffect(loadDashboard, [date]);

  function loadDashboard() {
    searchParams = new URLSearchParams(document.location.search)
    const abortController = new AbortController();
    setReservationsError(null);
    if(searchParams.get('date')) {
      date = searchParams.get('date')
    }
    listReservations({ date }, abortController.signal)
      .then(setReservations)
      .catch(setReservationsError);
    return () => abortController.abort();
  }

  function incrementDate(dateInput,increment) {
    var dateFormatTotime = new Date(dateInput + " 00:00");
    var increasedDate = new Date(dateFormatTotime.getTime() +(increment *86400000));
    return increasedDate;
}

function formatDate(date) {
  var d = new Date(date),
      month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year = d.getFullYear();

  if (month.length < 2) 
      month = '0' + month;
  if (day.length < 2) 
      day = '0' + day;

  return [year, month, day].join('-');
}

  function previousHandler() {
    let dateValue = searchParams.get('date')
    if (!dateValue) dateValue = today();
    const previousDate = incrementDate(dateValue, -1)
    history.push(`/dashboard?date=${formatDate(previousDate)}`)
    loadDashboard();
  }

  function nextHandler() {
    let dateValue = searchParams.get('date')
    if (!dateValue) dateValue = today();
    const nextDate = incrementDate(dateValue, 1)
    history.push(`/dashboard?date=${formatDate(nextDate)}`)
    loadDashboard();
  }

  function todayHandler() {
    history.push(`/dashboard`)
    date = today();
    loadDashboard();
  }

  return (
    <main>
      <h1>Dashboard</h1>
      <div className="d-md-flex mb-3">
        <h4 className="mb-0">Reservations for date {searchParams.get('date') ? searchParams.get('date') : today()}</h4>
      </div>
      <ErrorAlert error={reservationsError} />
      {JSON.stringify(reservations)}
      <div>
      <button
              type="button"
              className="btn btn-secondary mr-2"
              onClick={previousHandler}
            >
              Previous
            </button>
            <button
              type="button"
              className="btn btn-secondary mr-2"
              onClick={todayHandler}
            >
              Today
            </button>
            <button
              type="button"
              className="btn btn-secondary mr-2"
              onClick={nextHandler}
            >
              Next
            </button>
      </div>
    </main>
  );
}

export default Dashboard;
