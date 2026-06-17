import './index.css'
import {Link} from 'react-router-dom'
const NotFound = () => (
  <Link to="/not-found">
    <div className="NotFound-con">
      <img
        src="https://assets.ccbp.in/frontend/react-js/jobby-app-not-found-img.png"
        alt="not found"
      />
      <h1>Page Not Found</h1>
      <p className="life-para">
        We are sorry, the page you requested could not be found
      </p>
    </div>
  </Link>
)
export default NotFound
