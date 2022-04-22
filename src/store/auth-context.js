import React, { useState, useEffect, useCallback } from "react";

// This is to store and setTimeout and to clearTimeout
// so if token expires, setTimeout will run or else it will be clearTmeout if user manually logs out
let logoutTimer;
// These are just presets for the context properties
// Can changes the token, isLoggedIn, and the functions in which login and logout are and have or take in
const AuthContext = React.createContext({
  token: "",
  isLoggedIn: false,
  login: (token) => {},
  logout: () => {},
});

// Helper function for calculating remaining time
const calculateRemainingTime = (expirationTime) => {
  // return remaining duration in miliseconds.
  // This const below gets the currentTime once it's called, .getTime() gets time in miliseconds
  const currentTime = new Date().getTime();
  // expecting expirationTime to be a string???, convert to miliseconds by .getTime()
  const adjExpirationTime = new Date(expirationTime).getTime();

  // calculate remaining by two times above, future time minus current time
  // handle if negative remainingTime and expiration has passed
  const remainingDuration = adjExpirationTime - currentTime;

  return remainingDuration;
};

const retrieveStoredToken = () => {
    // 3. check for remaining time by getting both of these from localStorage
        // and use helper function from aboe and storedExpirationTime, below is more info:
  const storedToken = localStorage.getItem("token");
  // Set below in login Handler
  const storedExpirationTime = localStorage.getItem("expirationTime");

  const remainingTime = calculateRemainingTime(storedExpirationTime);

  // If the remainingTime is less than 60,000 miliseconds or 1 minute,
    // Remove Token and ExpirationTime and then return null???
        // return null so that we know if it passes or not, if pass, the token is valid,
            // this is truthy by not being null, used in if(tokenData)
  if (remainingTime <= 36000) {
    localStorage.removeItem("token");
    localStorage.removeItem("expirationTime");
    return null;
  }

  // return token and expirationTime in an object if pass and token is valid still
    // return expirationTime so an appropriate new time can be set
  return {
    token: storedToken,
    duration: remainingTime,
  };
};
export const AuthContextProvider = (props) => {
  // 4. use helper function of retrieveStoredToken Fn store in const, compare as truthy falsy value below
    // to see if initialToken should be set to it's infomration or else token is expired, null return value
        // and initialToken stays undefined
  const tokenData = retrieveStoredToken();

  // getToken from localStorage on start of the page -> show loggedIn or auth form based on if it exists
  // Possible to set in state below because localStorage is a sync API
  // change to tokenData.token because it represents the localStorage 'token'
  // only available if not return null from above
  // use if statement for initialToken, if tokenData is truthy not null, set initialToken to tokenData.token
  let initialToken;
  if (tokenData) {
    initialToken = tokenData.token;
  }
  // keep track of token state by this, if token exists, user is loggedin, or else no user logged in yet.
  const [token, setToken] = useState(initialToken);
  // Converts token to truthy or falsy value by (!!)
  const userIsLoggedIn = !!token;

  // reset token to null or empty string if logout
  const logoutHandler = useCallback(() => {
    setToken("");
    // 6. remove both token and expirationTime when logging out, not just the token
    localStorage.removeItem("token");
    localStorage.removeItem("expirationTime");

    //1. This let logoutTimer is to stop or clear the timer if the user logs out manually not by expiration of token
    if (logoutTimer) {
      clearTimeout(logoutTimer);
    }
  }, []);

  // Using localStorage to keep track of token for isLoggedIn boolean.
  // This is so that on reload of page or not a path typed into Route URL, will redirect to loggedIn
  // or AuthForm Page
  // pass in token and change state of token to the passed in token
  // expect expirationTime as param too so you auto logout once the token expires
  //
  const loginHandler = (token, expirationTime) => {
    setToken(token);
    // 2. Set both the token and expirationTime in localstorage when user logs in 
        // This is instant login once the user signs up even. Under armour has this instant login,
            // while Gymshark makes you login after cretaing an account
                // Can be done gymshark way by running if with the url checking if it's the signup or login URL
                    // if login url, authCtx.login or and redirect to profile page
                    // if sign up url, don't login but go to auth form page by history.replace()
    localStorage.setItem("token", token);
    localStorage.setItem("expirationTime", expirationTime);

    // How often to call? currentTime would have to be set every 5 minutes maybe?
    const remainingTime = calculateRemainingTime(expirationTime);

    // place this loginHandler after logoutHandler because of call in setTimeout below
    // after remainingTime is negative or remainingTime expires
    // run logout once remainingTime expires
    // test by changing seconds passed in/remainingTime to 3000 miliseconds or 3 seconds after login, logout -> passes
    logoutTimer = setTimeout(logoutHandler, remainingTime);
    // pass in
  };

  // 5. if tokenData change or called again on a reload, will set the duration in the tokenData to to the new duration
    //new setTimeout duration everytime retrieveStoredToken is called
        // also pass in logoutHandler but remember to use useCallback since it's a function
            // reference type, no infinite loop  by using useCalback()
  useEffect(() => {
      if(tokenData) {
          // This is a good check and will show the remaining Time, in miliseconds, will go down 
            // on every reload because tokenData changes everytime, duration becomes shorter and shorter
          console.log(tokenData.duration);
          logoutTimer = setTimeout(logoutHandler, tokenData.duration);
      }
  }, [tokenData, logoutHandler]);
    // 7. Add Logout Handler to dependencies, since it's a function as dependency, remember to use useCallback()
        // where the logoutHandler is created above, no dependency in useCallback()

  // create object variable here and pass into value as dynamic
  const contextValue = {
    token: token,
    isLoggedIn: userIsLoggedIn,
    login: loginHandler,
    logout: logoutHandler,
  };
  return (
    <AuthContext.Provider value={contextValue}>
      {props.children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
