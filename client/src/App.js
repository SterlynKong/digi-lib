// Import React
import React from "react";

// Import BrowserRouter methods from react-router-dom
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

// Create Apollo Provider
import { ApolloProvider } from "@apollo/react-hooks";
import ApolloClient from "apollo-boost";

import SearchBooks from "./pages/SearchBooks";
import SavedBooks from "./pages/SavedBooks";
import Navbar from "./components/Navbar";

// Declare new instance of apollo client
const client = new ApolloClient({
  // request token from localStorage on client
  request: (operation) => {
    const token = localStorage.getItem("id_token");

    // set context based on if the token is avaialbe in localStorage - yes: authorized, no: empty
    operation.setContext({
      headers: {
        authorization: token ? `Bearer ${token}` : "",
      },
    });
  },
  uri: "/graphql",
});

function App() {
  return (
    <ApolloProvider client={client}>
      <Router>
        <>
          <Navbar />
          <Switch>
            <Route exact path="/" component={SearchBooks} />
            <Route exact path="/saved" component={SavedBooks} />
            <Route render={() => <h1 className="display-2">Wrong page!</h1>} />
          </Switch>
        </>
      </Router>
    </ApolloProvider>
  );
}

export default App;
