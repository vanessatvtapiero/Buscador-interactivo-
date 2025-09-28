import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import AdminView from "./components/AdminView";
import UserView from "./components/UserView";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/admin" element={<AdminView />} />
        <Route path="/usuarios" element={<UserView />} />
      </Routes>
    </Router>
  );
}

export default App;
