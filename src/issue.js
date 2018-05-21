import React from 'react';
import {browserHistory} from 'react-router'

export default class Issue extends React.Component {
  constructor(props) {
    super(props);
    this.state = {}
    this.getIssueInfo = this.getIssueInfo.bind(this)
  }
  componentDidMount() {
    const id = this.props.params.splat;
    this.getIssueInfo(id);

  }
  getIssueInfo(id) {
    const url = id;
    fetch(url).then(response => response.json()).then(data => this.setState({issueInfo: data})).catch((err) => {
      this.setState({error: true})
    })
  }

  render() {
    let issueInfoList;
    let issueInfo = this.state.issueInfo;
    if (issueInfo) {
      issueInfo = [issueInfo]
      issueInfoList = issueInfo.map(oneIssue => <div className='issue-info'>
        <div className='issue'><span className='desc-title'>Username:&nbsp;</span>{oneIssue.user.login}</div>
        <div className='issue'><span className='desc-title'>GitHub URL:&nbsp; </span>{oneIssue.user.html_url}</div>
        <img src={oneIssue.user.avatar_url}/>
        <div className='issue'><span className='desc-title'>Issue Title:&nbsp; </span>{oneIssue.title}</div>
        <button className='back-btn' onClick={browserHistory.goBack}><br/>Back</button>
      </div>)
    }
    return (<div id='issue-page-container'>
      {issueInfoList}
    </div>)
  }
}
