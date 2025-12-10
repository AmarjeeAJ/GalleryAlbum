import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import Editor from './pages/Editor';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/editor/:id" element={<Editor />} />
          <Route path="/" element={
            <div className="min-h-screen bg-gray-100 p-8">
              <h1 className="text-4xl font-bold text-gray-800">PicEra Album Design System</h1>
              <p className="mt-4 text-lg">Welcome to the next generation album design platform.</p>
              <div className="mt-6 flex gap-4">
                <Link to="/login" className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700">Login</Link>
                <Link to="/register" className="px-4 py-2 bg-white text-indigo-600 border border-indigo-600 rounded hover:bg-gray-50">Register</Link>
              </div>
            </div>
          } />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
