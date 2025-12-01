import React, { useState } from 'react';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Divider from '../ui/Divider';
import Icon from '../ui/Icon';
import SocialLoginButton from './SocialLoginButton';
import { validateEmail, validatePassword } from '../../utils/helpers';

const LoginScreen = ({ onLogin, onSwitchToRegister }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const newErrors = {};
    if (!validateEmail(email)) {
      newErrors.email = 'Email inválido';
    }
    if (!validatePassword(password)) {
      newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    // Simular login
    setTimeout(() => {
      onLogin({ email });
      setLoading(false);
    }, 1000);
  };

  const handleSocialLogin = (provider) => {
    console.log(`Login con ${provider}`);
    // Aquí iría la lógica de login social
    onLogin({ email: `user@${provider}.com` });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary to-success flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8">
        {/* Logo/Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 mx-auto mb-4 text-primary">
            <Icon name="bike" size={80} />
          </div>
          <h1 className="text-3xl font-bold text-secondary mb-2">EcoRueda</h1>
          <p className="text-neutralDark">Movilidad Sostenible</p>
        </div>

        {/* Social Login */}
        <div className="space-y-3 mb-6">
          <SocialLoginButton
            provider="google"
            text="Continuar con Google"
            onClick={() => handleSocialLogin('google')}
          />
          <SocialLoginButton
            provider="apple"
            text="Continuar con Apple"
            onClick={() => handleSocialLogin('apple')}
          />
        </div>

        <Divider text="o" />

        {/* Email Login */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setErrors({ ...errors, email: '' });
            }}
            error={errors.email}
          />
          
          <Input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setErrors({ ...errors, password: '' });
            }}
            error={errors.password}
          />

          <Button
            type="submit"
            variant="primary"
            className="w-full"
            disabled={loading}
          >
            {loading ? 'Ingresando...' : 'Ingresar'}
          </Button>
        </form>

        {/* Register Link */}
        <div className="mt-6 text-center">
          <p className="text-neutralDark">
            ¿No tienes cuenta?{' '}
            <button
              onClick={onSwitchToRegister}
              className="text-primary font-medium hover:underline"
            >
              Regístrate
            </button>
          </p>
        </div>

        {/* Forgot Password */}
        <div className="mt-4 text-center">
          <button className="text-neutralDark text-sm hover:text-secondary">
            ¿Olvidaste tu contraseña?
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginScreen;
