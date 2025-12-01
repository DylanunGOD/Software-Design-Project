import React, { useState } from 'react';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Divider from '../ui/Divider';
import Icon from '../ui/Icon';
import SocialLoginButton from './SocialLoginButton';
import { validateEmail, validatePassword } from '../../utils/helpers';

const RegisterScreen = ({ onRegister, onSwitchToLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
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
    if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Las contraseñas no coinciden';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    // Simular registro
    setTimeout(() => {
      onRegister({ email });
      setLoading(false);
    }, 1000);
  };

  const handleSocialRegister = (provider) => {
    console.log(`Registro con ${provider}`);
    onRegister({ email: `user@${provider}.com` });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary to-success flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8">
        {/* Logo/Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 mx-auto mb-4 text-primary">
            <Icon name="bike" size={80} />
          </div>
          <h1 className="text-3xl font-bold text-secondary mb-2">Crear Cuenta</h1>
          <p className="text-neutralDark">Únete a EcoRueda</p>
        </div>

        {/* Social Register */}
        <div className="space-y-3 mb-6">
          <SocialLoginButton
            provider="google"
            text="Registrarse con Google"
            onClick={() => handleSocialRegister('google')}
          />
          <SocialLoginButton
            provider="apple"
            text="Registrarse con Apple"
            onClick={() => handleSocialRegister('apple')}
          />
        </div>

        <Divider text="o" />

        {/* Email Register */}
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

          <Input
            type="password"
            placeholder="Confirmar Contraseña"
            value={confirmPassword}
            onChange={(e) => {
              setConfirmPassword(e.target.value);
              setErrors({ ...errors, confirmPassword: '' });
            }}
            error={errors.confirmPassword}
          />

          <Button
            type="submit"
            variant="primary"
            className="w-full"
            disabled={loading}
          >
            {loading ? 'Creando cuenta...' : 'Crear Cuenta'}
          </Button>
        </form>

        {/* Login Link */}
        <div className="mt-6 text-center">
          <p className="text-neutralDark">
            ¿Ya tienes cuenta?{' '}
            <button
              onClick={onSwitchToLogin}
              className="text-primary font-medium hover:underline"
            >
              Inicia sesión
            </button>
          </p>
        </div>

        {/* Terms */}
        <div className="mt-4 text-center">
          <p className="text-neutralDark text-xs">
            Al registrarte, aceptas nuestros{' '}
            <button className="text-primary hover:underline">
              Términos y Condiciones
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterScreen;
