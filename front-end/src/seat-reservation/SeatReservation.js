import React, { useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import ErrorAlert from "../layout/ErrorAlert";
import { seatReservation, listTables } from "../utils/api";


function SeatReservation({tables, setTables, setTablesError}){
    const history = useHistory();
    const { reservation_id } = useParams();

    const [seat, setSeat] = useState({
        table_number: "",
      });
    const [error, setError] = useState(null);  

    const freeTables = tables.filter((table) => {
       if(!table.reservation_id) return table
    })

    function loadTables() {
        const abortController = new AbortController();
        setTablesError(null);
        listTables(abortController.signal)
          .then(setTables)
          .catch(setTablesError);
        return () => abortController.abort();
      }
    
    function changeHandler({ target: { name, value } }) {
        setSeat((previousSeat) => ({
          ...previousSeat,
          [name]: value
        }));
      }
    
      function cancelHandler() {
        history.goBack();
      }

      function submitHandler(event) {
        event.preventDefault();
          seatReservation(Number(reservation_id), seat.table_number)
          .then(() => {
            history.push(`/dashboard`);
          })
          .then(loadTables)
          .catch(setError);
        
      }
    
    return (
    <main>
        <form onSubmit={submitHandler} className="mb-4">
        <div className="mb-3">
          <label className="form-label" htmlFor="seatReservation">
            Seat Reservation
          </label>
          <select
            className="form-control"
            id="table_number"
            name="table_number"
            value={seat.table_number}
            onChange={changeHandler}
            required={true}
          >
            <option value="">Select a table</option>
            {freeTables.map((table) => (
                <option value={table.table_id}>{table.table_name} - {table.capacity}</option>
            ))}
          </select>
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
        <ErrorAlert error={error} />
        </form>
    </main>
    )
}

export default SeatReservation;