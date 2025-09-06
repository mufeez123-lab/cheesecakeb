import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Admin from './components/Admin.jsx';
import Menu from './pages/Menu.jsx';

function App() {
  return (
    <Router>
      <Routes>
       <Route path="/" element={<Menu/>}/>
       <Route path="/admin" element={<Admin/>}/>
      </Routes>
    </Router>
  );
}

export default App;
