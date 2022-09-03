import './App.css';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate
} from "react-router-dom";
import Login from "./components/Login";
import Layout from './components/Layout';

function App() {
  return (
    <Router>
        <Routes>
          <Route path="/login" element={<Login/>} />
          <Route path="/forms" element={<Layout/>} />
          <Route path="/*" element={<Navigate replace to="/login" />} />
        </Routes>
    </Router>
  );
}

export default App;
