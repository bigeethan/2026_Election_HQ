import {Component} from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

class Predictions extends Component {
  render() {
    return (
      <div className="state">
        <nav className="top-nav">
          <h2>2026 Election HQ</h2>
          <div className="nav-buttons">
            <button className="home-button" onClick={() => { this.props.navigate("/"); }}>Home</button>
            <button className="predictions-button">Predictions</button>
          </div>
        </nav>
      </div>
    );
  }
}

function PredictionsWrapper(props) {
  const navigate = useNavigate();
  return <Predictions {...props} navigate={navigate} />;
}

export default PredictionsWrapper;