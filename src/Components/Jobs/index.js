import {Component} from 'react'
import './index.css'
import Cookies from 'js-cookie'
import JobsList from '../JobsList'
import Loader from 'react-loader-spinner'
import {IoMdSearch} from 'react-icons/io'
import Header from '../Header'
const employmentTypesList = [
  {
    label: 'Full Time',
    employmentTypeId: 'FULLTIME',
  },
  {
    label: 'Part Time',
    employmentTypeId: 'PARTTIME',
  },
  {
    label: 'Freelance',
    employmentTypeId: 'FREELANCE',
  },
  {
    label: 'Internship',
    employmentTypeId: 'INTERNSHIP',
  },
]

const salaryRangesList = [
  {
    salaryRangeId: '1000000',
    label: '10 LPA and above',
  },
  {
    salaryRangeId: '2000000',
    label: '20 LPA and above',
  },
  {
    salaryRangeId: '3000000',
    label: '30 LPA and above',
  },
  {
    salaryRangeId: '4000000',
    label: '40 LPA and above',
  },
  {
    salaryRangeId: '1000001',
    label: 'All',
  },
]
const apiStatusConstants = {
  initial: 'INITIAL',
  inProgress: 'IN_PROGRESS',
  success: 'SUCCESS',
  failure: 'FAILURE',
}

class Jobs extends Component {
  state = {
    profileDetails: [],
    searchInput: '',
    searchInput1: '',
    checkboxInput: [],
    radioInput: '',
    apiStatus: apiStatusConstants.initial,
  }
  setInputValue = event => {
    this.setState({searchInput: event.target.value})
    if (event.target.value === '') {
      this.setState({searchInput1: ''})
    }
  }

  searchClick = () => {
    const {searchInput} = this.state
    this.setState({searchInput1: searchInput})
  }
  checkboxClick = (id, checked) => {
    if (checked) {
      this.setState(prevState => ({
        checkboxInput: [...prevState.checkboxInput, id],
      }))
    } else {
      this.setState(prevState => ({
        checkboxInput: prevState.checkboxInput.filter(eachId => eachId !== id),
      }))
    }
  }
  radioClick = id => {
    this.setState({radioInput: id})
  }
  componentDidMount() {
    this.getProfile()
  }
  getProfile = async () => {
    this.setState({
      apiStatus: apiStatusConstants.inProgress,
    })
    const jwt = Cookies.get('jwt_token')
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    }
    const response = await fetch('https://apis.ccbp.in/profile', options)
    const data = await response.json()
    if (response.ok) {
      this.setState({
        profileDetails: data['profile_details'],
        apiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }
  renderList = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderJobs()
      case apiStatusConstants.inProgress:
        return this.renderLoader()
      case apiStatusConstants.failure:
        return this.renderFailure()
      default:
        return null
    }
  }
  retry = () => this.getProfile()
  renderFailure = () => (
    <button className="retry-btn" onClick={this.retry}>
      Retry
    </button>
  )
  renderLoader = () => (
    <div className="retry-loader" data-testid="loader">
      <Loader type="ThreeDots" color="white" />
    </div>
  )
  renderJobs = () => {
    const {profileDetails} = this.state
    const {name, profile_image_url, short_bio} = profileDetails
    return (
      <div className="profile-bg">
        <img src={profile_image_url} className="profile-image" alt="profile" />
        <h1 className="profile-head">{name}</h1>
        <p className="profile-para">{short_bio}</p>
      </div>
    )
  }
  render() {
    const {searchInput, searchInput1, checkboxInput, radioInput} = this.state
    return (
      <div>
        <Header />
        <div className="jobs-bg display-align">
          <div className="left-part-margin">
            <div>{this.renderList()}</div>
            <hr className="line-width" />
            <div>
              <h1 className="employe-head">Type of Employment</h1>
              <ul>
                {employmentTypesList.map(each => (
                  <li
                    className="display-align employe-align employe-list"
                    key={each.employmentTypeId}
                  >
                    <input
                      type="checkbox"
                      onChange={event =>
                        this.checkboxClick(
                          each.employmentTypeId,
                          event.target.checked,
                        )
                      }
                      id={each.employmentTypeId}
                    />
                    <label htmlFor={each.employmentTypeId}>{each.label}</label>
                  </li>
                ))}
              </ul>
            </div>
            <hr className="line-width" />
            <div className="salary-section">
              <h1 className="employe-head">Salary Range</h1>
              <ul className="employe-list">
                {salaryRangesList.map(each => (
                  <li
                    className="display-align employe-align employe-list"
                    key={each.salaryRangeId}
                  >
                    <input
                      type="radio"
                      name="salary"
                      id={each.salaryRangeId}
                      onClick={() => this.radioClick(each.salaryRangeId)}
                    />
                    <label for={each.salaryRangeId}>{each.label}</label>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div>
            <div className="display-align">
              <input
                type="search"
                placeholder="search"
                className="search-input-adjust"
                value={searchInput}
                onChange={this.setInputValue}
              />
              <button
                type="button"
                onClick={this.searchClick}
                data-testid="searchButton"
                className="search-icon"
              >
                <IoMdSearch />
              </button>
            </div>
            <JobsList
              roleInput={searchInput1}
              employmentType={checkboxInput}
              salaryRange={radioInput}
            />
          </div>
        </div>
      </div>
    )
  }
}
export default Jobs
