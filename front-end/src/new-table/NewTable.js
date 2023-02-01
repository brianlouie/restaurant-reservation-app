import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import ErrorAlert from "../layout/ErrorAlert";
import { createTable, listTables } from "../utils/api";

function NewTable({setTables, setTablesError}) {
    const history = useHistory();
    
    const [table, setTable] = useState({
        table_name: "",
        capacity: "",
      });
    
      const [error, setError] = useState(null);

      function loadTables() {
        const abortController = new AbortController();
        setTablesError(null);
        listTables(abortController.signal)
          .then(setTables)
          .catch(setTablesError);
        return () => abortController.abort();
      }
    
      function cancelHandler() {
        history.goBack();
      }

      function changeHandler({ target: { name, value } }) {
        setTable((previousTable) => ({
          ...previousTable,
          [name]: name === "capacity" ? Number(value) : value,
        }));
      }
      
      function isValid(){
        const name = table.table_name
        const capacity = table.capacity
        if(name.length < 2){
            setError("name has to be 2 characters or more")
            return false
        } else if (capacity < 1){
            setError("capacity must be 1 or higher")
            return false
        }
        return true
      }

      function submitHandler(event) {
        event.preventDefault();
        isValid();
        if(isValid()){
          createTable(table)
          .then(() => {
            history.push(`/dashboard`);
          })
          .then(loadTables)
          .catch(setError);
        }
      }


      return (
        <main>
          <h1 className="mb-3">Create Table</h1>
          <ErrorAlert error={error} />
          <form onSubmit={submitHandler} className="mb-4">
            <div className="row mb-3">
              <div className="col-6 form-group">
                <label className="form-label" htmlFor="table_name">
                  Table Name
                </label>
                <input
                  className="form-control"
                  id="table_name"
                  name="table_name"
                  type="text"
                  value={table.table_name}
                  onChange={changeHandler}
                  required={true}
                />
              </div>
              <div className="col-6">
                <label className="form-label" htmlFor="capacity">
                  Capacity
                </label>
                <input
                  className="form-control"
                  id="capacity"
                  name="capacity"
                  type="number"
                  min="1"
                  value={table.capacity}
                  onChange={changeHandler}
                  required={true}
                />
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

export default NewTable;