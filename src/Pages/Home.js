import {Component} from "react";
import axios from "axios";
import "./Home.css"

class Home extends Component {
  state = {
    generic_ballot: [],
    r_support: null,
    d_support: null,
    trump_approval: [],
    trump_fav: null,
    trump_dis: null
  }

  componentDidMount() {
    this.getPollingData();
  }

  // Compute the average polling numbers weighted based on sample size
  computeAverage = (polls, selection) => {
    let totalWeight = 0;
    let aSum = 0;
    let bSum = 0;

    // Loops through each poll stored in the state array
    polls.forEach(poll => {
      const n = Number(poll.sample_size) || 0;
      let aObj = 0;
      let bObj = 0;
      if (selection === 'Generic Ballot') {
        aObj = poll.answers.find(a => a.choice === 'Dem');
        bObj = poll.answers.find(a => a.choice === 'Rep');
      } else if (selection === 'Trump Approval') {
        aObj = poll.answers.find(a => a.choice === 'Approve');
        bObj = poll.answers.find(a => a.choice === 'Disapprove');
      }
      const a = aObj.pct;
      const b = bObj.pct;
      aSum += a * n;
      bSum += b * n;
      totalWeight += n;
    });

    const avgA = aSum / totalWeight;
    const avgB = bSum / totalWeight;

    return {
      a: avgA,
      b: avgB
    };
  }

  // CORS proxy is setup for development purposes. Fetches polling data via the VoteHub polling API.
  getPollingData = () => {
    axios.get('/polls?poll_type=generic-ballot').then(response => {
      const polls = response.data;

      const { a, b } = this.computeAverage(polls, "Generic Ballot");

      this.setState({
        generic_ballot: polls,
        d_support: a,
        r_support: b
      })
    }).catch(error => {
      console.log('Error fetching generic ballot:', error);
    });
    axios.get('polls?poll_type=approval&subject=donald-trump').then(response => {
      const polls = response.data;

      const { a, b } = this.computeAverage(polls, "Trump Approval");

      this.setState({
        trump_approval: polls,
        trump_fav: a,
        trump_dis: b
      })
    }).catch(error => {
      console.error('Error fetching Trump approval:', error);
    });
  }

  render() {
    const { d_support, r_support, trump_fav, trump_dis } = this.state;

    return (
      <div className="home">
        <h2>Generic Ballot</h2>

        <div className="generic_ballot">
          <p>Democrats: {d_support != null ? `${d_support.toFixed(2)}%` : 'N/A'}</p>
          <p>Republicans: {r_support != null ? `${r_support.toFixed(2)}%` : 'N/A'}</p>
        </div>

        <h2>Trump Approval</h2>

        <div className="trump_approval">
          <p>Approve: {trump_fav != null ? `${trump_fav.toFixed(2)}%` : 'N/A'}</p>
          <p>Disapprove: {trump_dis != null ? `${trump_dis.toFixed(2)}%` : 'N/A'}</p>
        </div>
      </div>
    );
  }
}

export default Home;