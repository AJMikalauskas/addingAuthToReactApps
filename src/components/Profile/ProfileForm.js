import { useRef, useContext} from 'react';
import { useHistory } from 'react-router-dom';
import AuthContext from '../../store/auth-context';
import classes from './ProfileForm.module.css';

const ProfileForm = () => {
  const history = useHistory();
  const newPasswordInputRef = useRef();
  const authCtx = useContext(AuthContext);

  const submitHandler = async(event) =>
  {
    event.preventDefault();

    const enteredNewPassword = newPasswordInputRef.current.value;
    // can add validation, but call new password API link from google firebase tab 
      // search "google firebase auth REST API"

      // APIs can have different ways to send in the token 
        // other ways include being passed as a query param, passed as a header with "Bearer tokenName"
      try{
    const response = await fetch("https://identitytoolkit.googleapis.com/v1/accounts:update?key=AIzaSyD4E89CmQMKc1dRUHAiE5NGx6d9dxpzAig",
      {
        method: 'POST',
        headers:
        {
          'Content-Type' : 'application/json'
        },
        body: JSON.stringify({
          idToken: authCtx.token,
          password: enteredNewPassword,
          // This doesn't always have to be true anymore, he sets to false but if true; it would return a new ID/refreshtoken?
          returnSecureToken: false
        })
      });
      const data = await response.json();
      console.log(data);

      if (data.code !== 200 && data.code !== undefined) {
        throw new Error(data.error.message);
      }
      // could also show a success message 
      history.replace("/");
      }catch(error)
      {
        //assume success
        if (error.message.length > 0) {
          console.log(error.message);
          alert(error.message);
        } else {
          alert("Change Password Failed!");
        }
      }


  }
  return (
    <form className={classes.form} onSubmit={submitHandler}>
      <div className={classes.control}>
        <label htmlFor='new-password'>New Password</label>
        <input type='password' id='new-password' minLength="7" ref={newPasswordInputRef} />
      </div>
      <div className={classes.action}>
        <button>Change Password</button>
      </div>
    </form>
  );
}

export default ProfileForm;
