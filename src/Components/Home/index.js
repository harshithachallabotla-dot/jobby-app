import './index.css'
import Cookies from 'js-cookie'
import Header from '../Header'
import {Redirect, Link} from 'react-router-dom'

const Home = props => {
  const jwt = Cookies.get('jwt_token')
  if (jwt === undefined) {
    return <Redirect to="/login" />
  }
  return (
    <div>
      <Header />
      <div className="home-bg">
        <div className="home-page-detail">
          <h1 className="home-bg-head">Find The Job That Fits Your Life</h1>
          <p className="home-para">
            Millions of people are searching for jobs, salary
            information,.company reviews. Find the job that fits your abilities
            and potential.
          </p>
          <Link to="/jobs">
            <button className="home-btn" type="button">
              Find Jobs
            </button>
          </Link>
        </div>
      </div>
    </div>
  )
}
export default Home
