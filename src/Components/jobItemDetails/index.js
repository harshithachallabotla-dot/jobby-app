import {Component} from 'react'
import './index.css'
import Header from '../Header'
import {v4 as uuidv4} from 'uuid'
import {IoLocationSharp} from 'react-icons/io5'
import {GoMail} from 'react-icons/go'
import Loader from 'react-loader-spinner'
import {FaStar} from 'react-icons/fa'
import {FiExternalLink} from 'react-icons/fi'
import Cookies from 'js-cookie'
const apiStatusConstants = {
  initial: 'INITIAL',
  inProgress: 'IN_PROGRESS',
  success: 'SUCCESS',
  failure: 'FAILURE',
}
class jobItemDetails extends Component {
  state = {
    jobDetails: [],
    similarJobs: [],
    skill: [],
    life: [],
    apiStatus: apiStatusConstants.initial,
  }
  componentDidMount() {
    this.getItems()
  }
  getItems = async props => {
    this.setState({apiStatus: apiStatusConstants.inProgress})
    const jwt = Cookies.get('jwt_token')
    const {match} = this.props
    const {params} = match
    const {id} = params
    const url = `https://apis.ccbp.in/jobs/${id}`
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    }
    const res = await fetch(url, options)
    const data = await res.json()
    console.log(data)
    if (res.ok) {
      this.setState({
        jobDetails: data['job_details'],
        similarJobs: data['similar_jobs'],
        skill: data['job_details']['skills'],
        life: data['job_details']['life_at_company'],
        apiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }
  eachretry = () => this.getItems()
  Failure = () => (
    <div className="fail-con">
      <img
        src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
        alt="failure view"
      />
      <h1>Oops! Something Went Wrong</h1>
      <p className="life-para">
        We cannot seem to find the page you are looking for
      </p>
      <button className="retry-btn" onClick={this.eachretry}>
        Retry
      </button>
    </div>
  )
  Loader = () => (
    <div className="retry-loader retry-load-bg" data-testid="loader">
      <Loader type="ThreeDots" color="white" />
    </div>
  )
  renderEachDetailList = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderEachDetail()
      case apiStatusConstants.inProgress:
        return this.Loader()
      case apiStatusConstants.failure:
        return this.Failure()
      default:
        return null
    }
  }
  renderEachDetail = () => {
    const {jobDetails, similarJobs, skill, life} = this.state
    console.log(similarJobs)
    console.log(jobDetails)
    const {
      company_logo_url,
      company_website_url,
      location,
      id,
      title,
      employment_type,
      package_per_annum,
      job_description,
      rating,
    } = jobDetails
    return (
      <div>
        <div className="job-details-bg" tabIndex="0">
          <div className="align">
            <img
              src={company_logo_url}
              className="company-logo"
              alt="job details company logo"
            />
            <div className="title-rating-align">
              <h1 className="title-head">{title}</h1>
              <div className="align">
                <FaStar className="star-icon" />
                <p>{rating}</p>
              </div>
            </div>
          </div>
          <div className="container">
            <div className="align">
              <div className="align">
                <IoLocationSharp className="icon-align" />
                <p className="location-align">{location}</p>
              </div>
              <div className="align">
                <GoMail className="icon-align" />
                <p>{employment_type}</p>
              </div>
            </div>
            <p>{package_per_annum}</p>
          </div>
          <hr />
          <div className="container">
            <h1 className="des-head">Description</h1>
            <a href={company_website_url} className="visit-el align">
              <p>Visit</p>
              <FiExternalLink className="visit-para" />
            </a>
          </div>
          <p className="desc-para des-para">{job_description}</p>
          <h1 className="skills-head">Skills</h1>
          <ul className="skills-align skills-con1">
            {skill.map(each => (
              <li className="align skills-con" key={uuidv4()}>
                <img
                  src={each.image_url}
                  className="skills-image"
                  alt={each.name}
                />
                <p className="life-para">{each.name}</p>
              </li>
            ))}
          </ul>
          <h1 className="skills-head">Life at Company</h1>
          <div className="align life-con">
            <p className="life-para">{life.description}</p>
            <img
              src={life.image_url}
              className="life-image"
              alt="life at company"
            />
          </div>
        </div>
        <h1 className="skills-head col1">Similar Jobs</h1>
        <ul className="align similar-con">
          {similarJobs.map(each => (
            <li className="similar-bg" tabIndex="0" key={each.id}>
              <div className="align">
                <img
                  src={each.company_logo_url}
                  className="company-logo"
                  alt="similar job company logo"
                />
                <div className="title-rating-align">
                  <h1 className="similar-head">{each.title}</h1>
                  <div className="align">
                    <FaStar className="star-icon" />
                    <p>{each.rating}</p>
                  </div>
                </div>
              </div>
              <h1 className="skills-desc">Description</h1>
              <p className="life-para">{each.job_description}</p>
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
            </li>
          ))}
        </ul>
      </div>
    )
  }
  render() {
    return (
      <div>
        <Header />
        <div className="details-bg">{this.renderEachDetailList()}</div>
      </div>
    )
  }
}
export default jobItemDetails
