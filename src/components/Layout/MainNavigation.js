import Fragment, { useContext } from "react";
import { Link } from "react-router-dom";
import AuthContext from "../../store/auth-context";

import classes from "./MainNavigation.module.css";

const MainNavigation = () => {
  const authCtx = useContext(AuthContext);
  return (
    <header className={classes.header}>
      <Link to="/">
        <div className={classes.logo}>React Auth</div>
      </Link>
      <nav>
        <ul>
          {authCtx.isLoggedIn && (
            <li>
              <Link to="/profile">Profile</Link>
            </li>
          )}

{/* Need to fix so that when you click the logout button you are redirected from the new password page or user home page
to the login page -> done so by route guards or showing routes dynamically based on JSX conditionals ->
in App.js */}
          {authCtx.isLoggedIn && (
            <li>
              <button onClick={() => {authCtx.logout()}}>Logout</button>
            </li>
          )}

          {!authCtx.isLoggedIn && (
            <li>
              <Link to="/auth">Login</Link>
            </li>
          )}
        </ul>
      </nav>
    </header>
  );
};

export default MainNavigation;
