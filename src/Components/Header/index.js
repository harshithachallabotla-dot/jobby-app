import './index.css'
import Cookies from 'js-cookie'
import {withRouter, Link} from 'react-router-dom'
const Header = props => {
  const logout = () => {
    const {history} = props
    Cookies.remove('jwt_token')
    history.replace('/login')
  }
  return (
    <div className="navbar-bg">
      <ul className="container">
        <li>
          <Link to="/">
            <img
              src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
              alt="website logo"
              className="navbar-logo"
            />
          </Link>
        </li>
        <li className="middle-element">
          <Link to="/" className="header-home">
            Home
          </Link>
          <Link to="/jobs" className="header-home">
            Jobs
          </Link>
        </li>
        <li>
          <button className="navbar-btn" type="button" onClick={logout}>
            Logout
          </button>
        </li>
      </ul>
    </div>
  )
}
export default withRouter(Header)
