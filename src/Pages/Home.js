import {Component} from "react";
import { ComposableMap, Geographies, Geography } from "react-simple-maps";
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
    const geoUrl = "https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json";

    return (
      <div className="home">
        <nav className="top-nav">
          <h2>2026 Election HQ</h2>
          <div className="nav-buttons">
            <button className="home-button">Home</button>
            <button className="predictions-button">Predictions</button>
          </div>
        </nav>

        <div className="content-wrapper">
          <div className="left-column">
            <div className="map-container">
              <ComposableMap projection="geoAlbersUsa">
                <Geographies geography={geoUrl}>
                  {({ geographies }) => (
                    <>
                      {geographies
                        .filter(geo => this.state.hoveredState !== geo.id && this.state.previousHoveredState !== geo.id)
                        .map((geo) => (
                          <Geography
                            key={geo.rsmKey}
                            geography={geo}
                            onMouseEnter={() => {
                              const prev = this.state.hoveredState;
                              if (prev !== geo.id) {
                                this.setState({ 
                                  previousHoveredState: prev,
                                  hoveredState: geo.id
                                });
                              }
                            }}
                            onMouseLeave={() => {
                              this.setState({ hoveredState: null });
                            }}
                            className="state-geography"
                            style={{
                              default: { outline: "none" },
                              hover: { outline: "none" },
                              pressed: { outline: "none" }
                            }}
                          />
                        ))}
                      {this.state.previousHoveredState && geographies
                        .filter(geo => this.state.previousHoveredState === geo.id)
                        .map((geo) => (
                          <Geography
                            key={`${geo.rsmKey}-scaling-down`}
                            geography={geo}
                            onMouseEnter={() => {
                              const prev = this.state.hoveredState;
                              if (prev !== geo.id) {
                                this.setState({ 
                                  previousHoveredState: prev,
                                  hoveredState: geo.id
                                });
                              }
                            }}
                            onMouseLeave={() => {
                              this.setState({ hoveredState: null });
                            }}
                            onAnimationEnd={() => {
                              this.setState({ previousHoveredState: null });
                            }}
                            className="state-geography state-scaling-down"
                            style={{
                              default: { outline: "none" },
                              hover: { outline: "none" },
                              pressed: { outline: "none" }
                            }}
                          />
                        ))}
                      {this.state.hoveredState && geographies
                        .filter(geo => this.state.hoveredState === geo.id)
                        .map((geo) => (
                          <Geography
                            key={`${geo.rsmKey}-hovered`}
                            geography={geo}
                            onMouseEnter={() => {
                              const prev = this.state.hoveredState;
                              if (prev !== geo.id) {
                                this.setState({ 
                                  previousHoveredState: prev,
                                  hoveredState: geo.id
                                });
                              }
                            }}
                            onMouseLeave={() => {
                              this.setState({ hoveredState: null });
                            }}
                            className="state-geography state-hovered"
                            style={{
                              default: { outline: "none" },
                              hover: { outline: "none" },
                              pressed: { outline: "none" }
                            }}
                          />
                        ))}
                    </>
                  )}
                </Geographies>
              </ComposableMap>
            </div>
          </div>

          <div className="right-column">
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
        </div>
      </div>
    );
  }
}

export default Home;