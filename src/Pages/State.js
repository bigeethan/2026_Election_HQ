import {Component} from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import "./State.css"

class State extends Component {
  render() {
    const state = this.props?.state || "state";

    return (
      <div className="state">
        <nav className="top-nav">
          <h2>2026 Election HQ</h2>
          <div className="nav-buttons">
            <button className="home-button" onClick={() => { this.props.navigate("/"); }}>Home</button>
            <button className="predictions-button" onClick={() => { this.props.navigate("/predictions"); }}>Predictions</button>
          </div>
        </nav>

        <h1>{state}</h1>

        <div className="content-wrapper">
        </div>
      </div>
    );
  }
}

function StateWrapper(props) {
  const navigate = useNavigate();
  const params = useParams();
  return <State {...props} navigate={navigate} state={params.state} />;
}

export default StateWrapper;