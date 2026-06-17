import {Component} from 'react'
import './index.css'
import {Redirect} from 'react-router-dom'
import Cookies from 'js-cookie'
class LoginForm extends Component {
  state = {username: '', password: '', errorMsg: ''}
  submitSuccess = jwtToken => {
    Cookies.set('jwt_token', jwtToken, {expires: 1})
    const {history} = this.props
    history.replace('/')
  }
  submitFailure = err_msg => {
    this.setState({errorMsg: err_msg})
  }
  login = async () => {
    const {username, password} = this.state
    const userDetails = {username, password}
    const options = {
      method: 'POST',
      body: JSON.stringify(userDetails),
    }
    const res = await fetch('https://apis.ccbp.in/login', options)
    const data = await res.json()
    if (res.ok) {
      this.submitSuccess(data.jwt_token)
    } else {
      this.submitFailure(data.error_msg)
    }
  }
  setUsername = event => {
    this.setState({username: event.target.value})
  }
  setPassword = event => {
    this.setState({password: event.target.value})
  }
  render() {
    const {username, password, errorMsg} = this.state
    const jwt = Cookies.get('jwt_token')
    if (jwt !== undefined) {
      return <Redirect to="/" />
    }
    return (
      <div className="login-bg">
        <div className="login-card">
          <img
            src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
            alt="website logo"
            className="website-logo-image"
          />
          <label htmlFor="user" className="login-label">
            USERNAME
          </label>
          <input
            type="text"
            id="user"
            value={username}
            placeholder="Username"
            onChange={this.setUsername}
            className="login-input-fix"
          />
          <label htmlFor="passwrd" className="login-label">
            PASSWORD
          </label>
          <input
            type="password"
            id="passwrd"
            value={password}
            placeholder="Password"
            onChange={this.setPassword}
            className="login-input-fix"
          />
          <button type="submit" onClick={this.login}>
            Login
          </button>
          {errorMsg !== '' ? <p className="error">*{errorMsg}</p> : ''}
        </div>
      </div>
    )
  }
}
export default LoginForm
