import {Component} from 'react'
import './index.css'
import {Link} from 'react-router-dom'
import {IoLocationSharp} from 'react-icons/io5'
import Loader from 'react-loader-spinner'
import {GoMail} from 'react-icons/go'
import {FaStar} from 'react-icons/fa'
import Cookies from 'js-cookie'
const apiStatusConstants = {
  initial: 'INITIAL',
  inProgress: 'IN_PROGRESS',
  success: 'SUCCESS',
  failure: 'FAILURE',
}
class JobsList extends Component {
  state = {list: [], apiStatus: apiStatusConstants.initial}
  componentDidMount = () => {
    this.getList()
  }
  componentDidUpdate(prevProps) {
    const {roleInput, employmentType, salaryRange} = this.props

    if (
      prevProps.roleInput !== roleInput ||
      prevProps.employmentType !== employmentType ||
      prevProps.salaryRange !== salaryRange
    ) {
      this.getList()
    }
  }
  getList = async () => {
    this.setState({
      apiStatus: apiStatusConstants.inProgress,
    })
    const jwt = Cookies.get('jwt_token')
    const {roleInput, employmentType, salaryRange} = this.props
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    }
    const url = `https://apis.ccbp.in/jobs?search=${roleInput}&employment_type=${employmentType}&minimum_package=${salaryRange}`
    const response = await fetch(url, options)
    const data = await response.json()
    console.log(data)
    if (response.ok) {
      this.setState({
        list: data['jobs'],
        apiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }
  retrybtn = () => this.getList()
  renderFail = () => {
    return (
      <div className="fail-con">
        <img
          src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
          alt="failure view"
        />
        <h1>Oops! Something Went Wrong</h1>
        <p className="life-para">
          We cannot seem to find the page you are looking for
        </p>
        <button className="retry-btn" onClick={this.retrybtn}>
          Retry
        </button>
      </div>
    )
  }
  renderLoad = () => (
    <div className="retry1-btn" data-testid="loader">
      <Loader type="ThreeDots" color="white" />
    </div>
  )
  renderDetailsList = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderDetails()
      case apiStatusConstants.inProgress:
        return this.renderLoad()
      case apiStatusConstants.failure:
        return this.renderFail()
      default:
        return null
    }
  }
  renderDetails = () => {
    const {list} = this.state
    if (list.length === 0) {
      return (
        <div className="noJob-con">
          <img
            src="https://assets.ccbp.in/frontend/react-js/no-jobs-img.png"
            alt="no jobs"
            className="no-job-image"
          />
          <h1 className="no-colour">No Jobs Found</h1>
          <p className="no-colour no-para">
            We could not find any jobs. Try other filters.
          </p>
        </div>
      )
    }
    return (
      <ul>
        {list.map(each => (
          <Link to={`/jobs/${each.id}`}>
            <li className="singleItemcard" tabIndex="0">
              <div className="align">
                <img
                  src={each.company_logo_url}
                  className="company-logo"
                  alt="company logo"
                />
                <div className="title-rating-align">
                  <h1 className="title-head">{each.title}</h1>
                  <div className="align">
                    <FaStar className="star-icon" />
                    <p>{each.rating}</p>
                  </div>
                </div>
              </div>
              <div className="container">
                <div className="align">
                  <div className="align">
                    <IoLocationSharp className="icon-align" />
                    <p className="location-align">{each.location}</p>
                  </div>
                  <div className="align">
                    <GoMail className="icon-align" />
                    <p>{each.employment_type}</p>
                  </div>
                </div>
                <p>{each.package_per_annum}</p>
              </div>
              <hr />
              <h1 className="desc-head">Description</h1>
              <p className="desc-para">{each.job_description}</p>
            </li>
          </Link>
        ))}
      </ul>
    )
  }
  render() {
    return <div>{this.renderDetailsList()}</div>
  }
}
export default JobsList
