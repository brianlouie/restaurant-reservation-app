import React, {useState, useEffect} from "react";

import { Redirect, Route, Switch } from "react-router-dom";
import Dashboard from "../dashboard/Dashboard";
import NotFound from "./NotFound";
import { today } from "../utils/date-time";
import NewReservation from "../new-reservation/NewReservation";
import useQuery from "../utils/useQuery"
import NewTable from "../new-table/NewTable";
import SeatReservation from "../seat-reservation/SeatReservation";
import Search from "../search.js/Search";
import EditReservation from "../edit-reservation/EditReservation";
import { listTables } from "../utils/api";



/**
 * Defines all the routes for the application.
 *
 * You will need to make changes to this file.
 *
 * @returns {JSX.Element}
 */
function Routes() {
  const query = useQuery();
  const [tables, setTables] = useState([]);
  const [tablesError, setTablesError] = useState(null);

  useEffect(loadTables, []);

  function loadTables() {
    const abortController = new AbortController();
    setTablesError(null);
    listTables(abortController.signal)
      .then(setTables)
      .catch(setTablesError);
    return () => abortController.abort();
  }

  return (
    <Switch>
      <Route exact={true} path="/">
        <Redirect to={"/dashboard"} />
      </Route>
      <Route exact={true} path="/reservations">
        <Redirect to={"/dashboard"} />
      </Route>
      <Route exact={true} path="/reservations/new">
        <NewReservation />
      </Route>
      <Route exact={true} path="/reservations/:reservation_id/seat">
        <SeatReservation tables={tables} setTables={setTables} setTablesError={setTablesError}/>
      </Route>
      <Route path="/dashboard">
        <Dashboard date={query.get("date") || today()} tables={tables} setTables={setTables} tablesError={tablesError} setTablesError={setTablesError} loadTables={loadTables}/>
      </Route>
      <Route path="/tables/new">
        <NewTable setTables={setTables} setTablesError={setTablesError} tablesError={tablesError}/>
      </Route>
      <Route exact={true} path="/search">
          <Search />
        </Route>
        <Route exact={true} path="/reservations/:reservation_id/edit">
          <EditReservation />
        </Route>
      <Route>
        <NotFound />
      </Route>
    </Switch>
  );
}

export default Routes;
