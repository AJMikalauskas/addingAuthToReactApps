import { useContext } from "react";
import { Redirect } from "react-router-dom";
import { Switch, Route } from "react-router-dom";

import Layout from "./components/Layout/Layout";
import UserProfile from "./components/Profile/UserProfile";
import AuthPage from "./pages/AuthPage";
import HomePage from "./pages/HomePage";
import AuthContext from "./store/auth-context";

function App() {
  const authCtx = useContext(AuthContext);
  return (
    <Layout>
      <Switch>
        <Route path="/" exact>
          <HomePage />
        </Route>
        {!authCtx.isLoggedIn && (
          <Route path="/auth">
            <AuthPage />
          </Route>
        )}
        {/* Can do it this way or the other way below which is better
        because the below will allow /profile to be typed in but redirect to login if not loggedin auth user 
        {authCtx.isLoggedIn && (
          <Route path="/profile">
            <UserProfile />
          </Route>
        )} */}

        {/* Will redirect to login/new user page or form if they try to go to profile page without authentication */}
        <Route path="/profile">
          {authCtx.isLoggedIn && <UserProfile/>}
          {!authCtx.isLoggedIn && <Redirect to="/auth" />}
        </Route>

        {/*  This below code is for the bogus routes to redirect to the home page and probably logout the user in
        the process */}
        <Route path="*">
          <Redirect to="/"/>
        </Route>
      </Switch>
    </Layout>
  );
}

export default App;
