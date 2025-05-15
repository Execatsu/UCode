import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import AppRoutes from './routes/AppRoutes';
import './styles/global.css'; // Se você tiver um CSS global

function App() {
  return (
    <AuthProvider>
      <Router>
        {/* Você pode ter um Navbar aqui se for global ou dentro dos Layouts */}
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
}

export default App;