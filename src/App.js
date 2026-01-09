import './App.css';
import { HashRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./Pages/Home";
import Predictions from "./Pages/Predictions";
import State from "./Pages/State";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="/predictions" element={<Predictions/>} />
        <Route path="/state/:state" element={<State/>} />
      </Routes>
    </Router>
  );
}

export default App;
