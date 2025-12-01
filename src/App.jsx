import React, { useState } from 'react';
import LoginScreen from './components/auth/LoginScreen';
import RegisterScreen from './components/auth/RegisterScreen';
import MapScreen from './components/map/MapScreen';
import ProfileScreen from './components/profile/ProfileScreen';
import PaymentScreen from './components/profile/PaymentScreen';
import './styles/index.css';

function App() {
  const [currentScreen, setCurrentScreen] = useState('login'); // login, register, map, profile, payment
  const [user, setUser] = useState(null);

  const handleLogin = (userData) => {
    setUser(userData);
    setCurrentScreen('map');
  };

  const handleRegister = (userData) => {
    setUser(userData);
    setCurrentScreen('map');
  };

  const handleLogout = () => {
    setUser(null);
    setCurrentScreen('login');
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case 'login':
        return (
          <LoginScreen
            onLogin={handleLogin}
            onSwitchToRegister={() => setCurrentScreen('register')}
          />
        );

      case 'register':
        return (
          <RegisterScreen
            onRegister={handleRegister}
            onSwitchToLogin={() => setCurrentScreen('login')}
          />
        );

      case 'map':
        return (
          <MapScreen
            onProfileClick={() => setCurrentScreen('profile')}
          />
        );

      case 'profile':
        return (
          <ProfileScreen
            onClose={() => setCurrentScreen('map')}
            onNavigateToPayment={() => setCurrentScreen('payment')}
          />
        );

      case 'payment':
        return (
          <PaymentScreen
            onBack={() => setCurrentScreen('profile')}
            onSave={(cardData) => {
              console.log('Tarjeta guardada:', cardData);
              alert('¡Tarjeta agregada exitosamente!');
              setCurrentScreen('profile');
            }}
          />
        );

      default:
        return <LoginScreen onLogin={handleLogin} />;
    }
  };

  return (
    <div className="app">
      {renderScreen()}
    </div>
  );
}

export default App;
