import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./home/index";
import CardDetails from "./carddetails/carddetails";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/cards/:cardId" element={<CardDetails />} />
      </Routes>
    </Router>
  );
}

export default App;
