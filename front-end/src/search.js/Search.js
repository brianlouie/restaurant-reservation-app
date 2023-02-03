import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import ErrorAlert from "../layout/ErrorAlert";
import { listReservations } from "../utils/api";

function Search() {
  const history = useHistory();

  const [search, setSearch] = useState([]);
  const [error, setError] = useState(null);

  const [number, setNumber] = useState({
    mobile_number: "",
  });

  function submitHandler(event) {
    event.preventDefault();
    const abortController = new AbortController();
    listReservations({ mobile_number: number.mobile_number }, abortController.signal)
    .then(setSearch)
    .catch(setError);
    return () => abortController.abort();
  }

  function changeHandler({ target: { name, value } }) {
    setNumber((previousNumber) => ({
      ...previousNumber,
      [name]: value,
    }));
  }

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
        {JSON.stringify(search)}
      </form>
    </main>
  );
}

export default Search;
