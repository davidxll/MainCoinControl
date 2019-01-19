import React from 'react';
import AuthService from '../services/auth.service'

const LoadingComponent = () => {
  return (
    <button type="submit" disabled>
      <span><i className="ion-load-b"></i> Wait :)</span>
    </button>
  )
}
class Login extends React.Component {
  constructor(props) {
    super(props);
    this.onLoginSubmit = this.onLoginSubmit.bind(this);
    this.onSignUpSubmit = this.onSignUpSubmit.bind(this);
    this.switchForm = this.switchForm.bind(this);
    this.auth = new AuthService();
    this.state = {
      isLoginMode: true,
      showLoading: false,
    }
  }

  switchForm(evt) {
    evt.preventDefault();
    const currentMode = this.state.isLoginMode
    this.setState({isLoginMode: !currentMode})
  }

  turnLoading(newVal) {
    this.setState({showLoading: newVal})
  }

  onLoginSubmit(evt) {
    evt.preventDefault();
    this.turnLoading(true);
    const email = evt.target.email && evt.target.email.value;
    const password = evt.target.password && evt.target.password.value;
    this.auth.login({email, password}).then(res => {
      console.log("successfully log in: ", res)
      this.turnLoading(false);
      this.props.history.push("/dashboard")
    }).catch(e => {
      this.turnLoading(false);
      if(e.response.data.code === "auth/user-not-found") {
        alert("wrong email")
      }
      if(e.response.data.code === "auth/wrong-password") {
        alert("wrong password")
      }
      console.log('error loging in ', e)
      alert(e.response.data.message);
    })
  }
  
  onSignUpSubmit(evt) {
    evt.preventDefault();
    this.turnLoading(true);
    const email = evt.target.email && evt.target.email.value;
    const password = evt.target.password && evt.target.password.value;
    this.auth.signUp({email, password}).then(res => {
      console.log("successfully sign up: ", res)
      this.turnLoading(false);
      this.props.history.push("/dashboard")
    }).catch(e => {
      this.turnLoading(false);
      console.log('error create', e)
      alert(e.response.data.message);
    })
  }

  render() {
    return (
      <div className="login-page">
        <div className="form">
        { this.state.isLoginMode ?
          (<form className="login-form" onSubmit={this.onLoginSubmit}>
            <input type="email" placeholder="email" name="email" required />
            <input type="password" placeholder="password" name="password" required />
            <input type="submit" style={{position: 'absolute', left: -9999, width: 1, height: 1}} tabIndex="-1" />
            { this.state.showLoading ?
            <LoadingComponent />
            :
            <button type="submit">login</button>
            }
            <p className="message">Not registered? <a onClick={this.switchForm}>Create an account</a></p>
          </form>)
          :
          (<form className="register-form" onSubmit={this.onSignUpSubmit}>
            <input type="email" placeholder="email" name="email" required />
            <input type="password" placeholder="password" name="password" required />
            <input type="submit" style={{position: 'absolute', left: -9999, width: 1, height: 1}} tabIndex="-1" />
            { this.state.showLoading ?
            <LoadingComponent />
            :
            <button type="submit">create</button>
            }
            <p className="message">Already registered? <a onClick={this.switchForm}>Sign In</a></p>
          </form>)
        }
        </div>
      </div>
    )
  }
}

export default Login;
