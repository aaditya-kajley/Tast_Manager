import {
  BrowserRouter as Router,
  Link,
  Route,
  Routes,
} from "react-router-dom";
import './App.css';
import Signin from "./components/Signin";
import Admin from "./components/Admin";
import Employee from "./components/Employee"

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path = "/" element = { <Signin/>}/> 
          <Route path = "/admin" element = { <Admin/>}/>
          <Route path = "/employee" element = { <Employee/>}/>
        </Routes>
      </Router>
    </div>
  );
}
export default App;
