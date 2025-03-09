import React, { useContext, useEffect, useState } from 'react';
import { AppContext } from '../context/AppContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [state, setState] = useState('Sign Up');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { backendUrl, token, setToken } = useContext(AppContext);

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    setLoading(true);

    try {
      let data;
      if (state === 'Sign Up') {
        const response = await axios.post(backendUrl + '/api/user/register', { name, email, password });
        data = response.data;
      } else {
        const response = await axios.post(backendUrl + '/api/user/login', { email, password });
        data = response.data;
      }

      if (data.success) {
        localStorage.setItem('token', data.token);
        setToken(data.token);
        toast.success(state === 'Sign Up' ? 'Registration successful!' : 'Login successful!');
        navigate('/');
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      navigate('/');
    }
  }, [token, navigate]);

  const handleForgotPasswordClick = () => {
    setShowForgotPassword(true);
  };

  const handleForgotPasswordClose = () => {
    setShowForgotPassword(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="p-8 rounded-lg shadow-xl bg-white w-full max-w-md">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4 text-center">
          {state === 'Sign Up' ? 'Create Account' : 'Login'}
        </h2>
        <p className="text-gray-600 text-sm text-center mb-6">
          Please {state === 'Sign Up' ? 'sign up' : 'log in'} to book an appointment
        </p>
        <form onSubmit={onSubmitHandler} className="space-y-4">
          {state === 'Sign Up' && (
            <div>
              <label htmlFor="name" className="block text-gray-700 text-sm font-bold mb-2">
                Full Name
              </label>
              <input
                type="text"
                id="name"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
          )}
          <div>
            <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">
              Email
            </label>
            <input
              type="email"
              id="email"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-gray-700 text-sm font-bold mb-2">
              Password
            </label>
            <input
              type="password"
              id="password"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full ${
              loading ? 'opacity-50 cursor-wait' : ''
            }`}
            disabled={loading}
          >
            {loading ? (
              <svg className="animate-spin h-5 w-5 text-white mx-auto" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
            ) : (
              state === 'Sign Up' ? 'Create Account' : 'Login'
            )}
          </button>
        </form>
        <div className="mt-4 text-center">
          {state === 'Sign Up' ? (
            <p className="text-gray-600 text-sm">
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => setState('Login')}
                className="text-blue-500 hover:text-blue-700 focus:outline-none focus:shadow-outline"
              >
                Login here
              </button>
            </p>
          ) : (
            <>
              <p className="text-gray-600 text-sm">
                Don't have an account?{' '}
                <button
                  type="button"
                  onClick={() => setState('Sign Up')}
                  className="text-blue-500 hover:text-blue-700 focus:outline-none focus:shadow-outline"
                >
                  Sign up
                </button>
              </p>
              <button
                type="button"
                onClick={handleForgotPasswordClick}
                className="text-blue-500 hover:text-blue-700 focus:outline-none focus:shadow-outline mt-2 block w-full"
              >
                Forgot Password?
              </button>
            </>
          )}
        </div>
      </div>
      {showForgotPassword && (
        <ForgotPassword onClose={handleForgotPasswordClose} backendUrl={backendUrl} />
      )}
    </div>
  );
};

const ForgotPassword = ({ onClose, backendUrl }) => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post(`${backendUrl}/api/user/forgot-password`, { email });

      if (response.data.success) {
        setMessage('Password reset link sent to your email.');
        toast.success('Password reset link sent to your email.');
      } else {
        setMessage(response.data.message || 'Failed to send reset link.');
        toast.error(response.data.message || 'Failed to send reset link.');
      }
    } catch (error) {
      console.error('Forgot password error:', error);
      setMessage('An error occurred while processing your request.');
      toast.error('An error occurred while processing your request.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-xl max-w-md w-full">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Forgot Password</h2>
        {message && <p className="mb-4 text-green-500">{message}</p>}
        {!message && (
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="email-forgot" className="block text-gray-700 text-sm font-bold mb-2">
                Email:
              </label>
              <input
                type="email"
                id="email-forgot"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="flex justify-end">
              <button
                type="button"
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mr-2"
                onClick={onClose}
              >
                Cancel
              </button>
              <button
                type="submit"
                className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ${
                  loading ? 'opacity-50 cursor-wait' : ''
                }`}
                disabled={loading}
              >
                {loading ? (
                  <svg className="animate-spin h-5 w-5 text-white mx-auto" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                ) : (
                  'Send Reset Link'
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default Login;