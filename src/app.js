import React from 'react';
import {Link} from 'react-router';

// This app.js allows the user to either:
// 1) submit a Github username in a textarea, get a list of his/her repos from the GitHub API,
// click a repo and get a list of issues. 2) submit both username and repo name in two textareas
// and get the list of issues.

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {}
    this.submitNameAndRepo = this.submitNameAndRepo.bind(this);
    this.fetchRepoIssues = this.fetchRepoIssues.bind(this)
    this.handleKeyPress = this.handleKeyPress.bind(this)
  }
  //Function allows search to run on enter
  handleKeyPress(e) {
    if (event.key == 'Enter') {
      this.submitNameAndRepo(e)
    }
  }
 //Function runs on 'search'
  submitNameAndRepo(e) {
    this.setState({noIssues: false, error: false});

  //Removing previous issues found

    if (this.state.issues) {
      this.setState({issues: undefined})

  //If both user and repo entered

    } else if (this.state.text && this.state.repo_name) {
      const text = this.state.text;
      const repoName = this.state.repo_name;
      const url = "https://api.github.com/repos/" + text + "/" + repoName + "/issues?per_page=20";
      fetch(url).then(response => response.json()).then(data => {
        if (data.length !== 0) {
          this.setState({issues: data})
        } else {
          this.setState({noIssues: true})
        }
      }).catch((err) => {
        this.setState({error: true})
      })

  //If only user entered, fetch list of reps

    } else if (this.state.text && !this.state.repo_name) {
      const text = this.state.text;
      const url = "https://api.github.com/users/" + text + "/repos";
      fetch(url).then(response => response.json()).then(data => this.setState({repos: data})).catch((err) => {
        this.setState({error: true})
      })

  // If repo entered but no username

    } else if (this.state.repo_name && !this.state.text) {
      this.setState({noText: true})
    }
    this.setState({repo_name: false})
  }

  //Runs when user clicks on a repo name (if only GH user was found originally)

  fetchRepoIssues(repo) {
    this.setState({
      repo_name: repo
    }, () => {
      this.submitNameAndRepo();
    })
  }

  render() {

      //Mapping issue array if issues found

    let issueList;
    let issues = this.state.issues;
    console.log(this.state.issues);
    if (issues && issues.length !== 0 && this.state.error !== true) {
      issueList = issues.map(issue => <div id='single-issue-container'>
        <Link className='issue-id' to={`/issue/${issue.url}`}>
          <span className='desc-title'>Issue ID: &nbsp;</span>
          {issue.id}</Link>
        <div className='issue-text'>
          <span className='desc-title'>Title:&nbsp;
          </span>{issue.title}</div>
        <div className='issue-text'>
          <span className='desc-title'>Created at: &nbsp;</span>
          {issue.created_at}</div>
      </div>)

    }

     //Mapping repo array if repos were found. Click on repo runs fetchRepoIssues

    let repoList;
    let repos = this.state.repos;
    if (repos) {
      repoList = repos.map(repo => <button className='repo-btn' style={{
          cursor: 'pointer'
        }} onClick={() => this.fetchRepoIssues(repo.name)}>
        {repo.name}
      </button>)
    }

    return (<div id='main'>
      <div id='search-field-container'>
        <h2 className='app-title'>Welcome to issueSearch</h2>
        <div className='search-header search'>Please enter username and repo to retrieve issues</div>
        <textarea className='textarea-search search' onKeyPress={this.handleKeyPress} placeholder='Search by username' onChange={(e) => this.setState({text: e.target.value})}></textarea>
        <textarea className='textarea-search search' onKeyPress={this.handleKeyPress} placeholder='Enter repo' onChange={(e) => this.setState({repo_name: e.target.value})}></textarea>
        <button className='default-btn search' onClick={this.submitNameAndRepo}>Search</button>
      </div>
      {
        this.state.repos && <div id='repos-section'>
            <div>Please choose from this user's repositories</div>
            <div id='repos-container'>{repoList}</div>
          </div>
      }
      {
        this.state.issues && <div id='issues-section-container'>{issueList}</div>
      }
      {
        this.state.noIssues && <div className='error'>
            No issues found</div>
      }
      {
        this.state.noText && <div className='error'>Please enter at least username to search</div>
      }      {
        this.state.error === true && <div className='error'>There seems to be an error, please make sure all fields were entered correctly</div>
      }
      </div>)
  }
}
