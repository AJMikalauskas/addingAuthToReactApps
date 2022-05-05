import { useState, useRef, useContext } from "react";
import { useHistory } from "react-router-dom";
import AuthContext from "../../store/auth-context";

import classes from "./AuthForm.module.css";

const AuthForm = () => {
  // Redirect user 
  const history = useHistory();


  // Context for the token storing
    const authCtx = useContext(AuthContext);

  const emailInputRef = useRef();
  const passwordInputRef = useRef();

  //2-Way Binding, onCHangwe Handler Functions and State, normallly for validation on keystroke
    //const [email, setEmail] = useState("");
    //const [password, setPassword] = useState("");
  
  // 2-Way Binding via Refs, simpler and better for overall submit
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const switchAuthModeHandler = () => {
    setIsLogin((prevState) => !prevState);
  };

  // Submits the form data to specific API link in backend
    // For both signing up and logging in, remember to put event.preventDefault() on form submit
  const submitHandler = async (event) => {
    event.preventDefault();

    // Refs are simpler than event.target.value which have an onChange() function
      // Refs require way less code. Only downside is they track the whole submitted value not
        // the single value, don't use ref if validating Password/E-mail on every character.
          //optional: add validation
    const enteredEmail = emailInputRef.current.value;
    const enteredPassword = passwordInputRef.current.value;

    setIsLoading(true);
        // Same code except for url, in original if set url to login URL
          // In else conditional set url to sign up URL
            // run fetch request with let url as the original param passed in. SImplifies and stops copying of code
    let url;
    if (isLogin) {
      // Login Page Submit to Backend
        // Similar to below, except follow docs for right tab labeled "sign in with email/password"
          // replace [API_KEY], description below.
      url = "https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyD4E89CmQMKc1dRUHAiE5NGx6d9dxpzAig";

    } else {
      // Create Account Sign up Submit to Backend API link
      // send POST request by looking at docs and fetch API, search up "google firebase auth REST api"
      // need to replace [API_KEY] with one from project in firebase -> seetings icon -> project settings ->
      // Web API KEY
      // Same code, so just do fetch outside if and else statements with only change being in a url let variable
      url = "https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyD4E89CmQMKc1dRUHAiE5NGx6d9dxpzAig";
    }
      try {
        const response = await fetch(
          url,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            // returnSecureToken is expected to always be true shown by the docs,
            // as seen the object also expects an email and password passed in
            body: JSON.stringify({
              email: enteredEmail,
              password: enteredPassword,
              returnSecureToken: true,
            }),
          }
        );
        const data = await response.json();
        console.log(data);
        // This is necessary so that the data const below isn't shown even if an error occurs and so that the catch
        // statement can be hit. Since the code only shows up if error I could do === 400, but it doesn't
        // matter that much.
        console.log(data.error.code);
        if (data.error.code !== 200 && data.error.code !== undefined) {
          throw new Error(data.error.message);
        }
          // Would probably need this if handled by a .then promise as he does so.
        // if(data.ok)
        // {
        //   return data;
        // }

        //console.log(data); -> can also return the error such as an email exists or other errors
        // returns email, idToken, expiresIn, localId, refreshToken, etc..

        // Passed Error Check, Store Token in Context
          // need to pass in expirationTime, can change the way its handled by just using expirationTime
            // or change format of expirationTime using expiresIn property from data
              // converts expiresIn from seconds to miliseconds by times by 1000
                // get currentTime and add expiresIn time (all in miliseconds), constructs new Date from this

        // One of many ways to do this
        const expirationTime = new Date(new Date().getTime() + (+data.expiresIn * 1000));
            // Pass in as string and convert to date object in auth-context.js 
        authCtx.login(data.idToken, expirationTime.toISOString());
        // redirect the user from the current login 
        history.replace("/");
      } catch (error) {
        // Show to error modal user feedback
        //This is unnecessary -> console.log(error);
        if (error.message.length > 0) {
          console.log(error.message);
          alert(error.message);
        } else {
          alert("Authentication Failed!");
        }
      }
        // His semi-promise code
      // }
      // .then(res => {
      //   if (res.ok)
      //   {
      //     // do something with a successful response
      //     console.log(res.json());
      //   }
      //   else{
      //     return res.json().then(data => {
      //       // show error modal due to failure of this
      //       console.log(data);
      //     })
      //   }
      // });
      //setIsLoading(false);
    setIsLoading(false);
  };

  return (
    <section className={classes.auth}>
      <h1>{isLogin ? "Login" : "Sign Up"}</h1>
      <form onSubmit={submitHandler}>
        <div className={classes.control}>
          <label htmlFor="email">Your Email</label>
          <input type="email" id="email" required ref={emailInputRef} />
        </div>
        <div className={classes.control}>
          <label htmlFor="password">Your Password</label>
          <input
            type="password"
            id="password"
            required
            ref={passwordInputRef}
          />
        </div>
        <div className={classes.actions}>
          {/* Add minor loading for user to see, not final product */}
          {!isLoading && (
            <button>{isLogin ? "Login" : "Create Account"}</button>
          )}
          {isLoading && <p>Sending Request...</p>}
          <button
            type="button"
            className={classes.toggle}
            onClick={switchAuthModeHandler}
          >
            {isLogin ? "Create new account" : "Login with existing account"}
          </button>
        </div>
      </form>
    </section>
  );
};

export default AuthForm;
