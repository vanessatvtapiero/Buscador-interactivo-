import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import UserView from './components/UserView';
import Login from './pages/Login';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route 
          path="/usuarios" 
          element={
            <ProtectedRoute>
              <UserView />
            </ProtectedRoute>
          } 
        />
        {/* Otras rutas protegidas */}
      </Routes>
    </Router>
  );
}

export default App;