
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

const ResetPasswordPage = () => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const { token } = useParams(); // Get the token from the URL
  const navigate = useNavigate();

  // Placeholder Backend URL (replace with your actual backend URL)
  const backendUrl = 'YOUR_BACKEND_URL';

  useEffect(() => {
    // Placeholder: Validate the token on component mount (optional)
    const validateToken = async () => {
      try {
        // Placeholder API endpoint (replace with the real one)
        const response = await axios.post(`${backendUrl}/api/reset-password/validate-token`, { token });

        if (response.data.success) {
          // Token is valid
          setMessage(''); // Clear any previous message
        } else {
          // Token is invalid or expired
          setMessage(response.data.message || 'Invalid or expired token.');
          toast.error(response.data.message || 'Invalid or expired token.');
        }
      } catch (error) {
        console.error('Error validating token:', error);
        setMessage('An error occurred while validating the token.');
        toast.error('An error occurred while validating the token.');
      }
    };

    validateToken();
  }, [token, backendUrl]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(''); // Clear any previous messages

    if (newPassword !== confirmPassword) {
      setMessage('Passwords do not match.');
      toast.error('Passwords do not match.');
      setLoading(false);
      return;
    }

    try {
      // Placeholder API endpoint (replace with the real one)
      const response = await axios.post(`${backendUrl}/api/reset-password`, {
        token,
        newPassword,
      });

      if (response.data.success) {
        setMessage('Password reset successfully. Redirecting to login...');
        toast.success('Password reset successfully. Redirecting to login...');
        setTimeout(() => {
          navigate('/login'); // Redirect to the login page
        }, 2000);
      } else {
        setMessage(response.data.message || 'Failed to reset password.');
        toast.error(response.data.message || 'Failed to reset password.');
      }
    } catch (error) {
      console.error('Error resetting password:', error);
      setMessage('An error occurred while resetting password.');
      toast.error('An error occurred while resetting password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="p-8 rounded-lg shadow-xl bg-white w-full max-w-md">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4 text-center">Reset Password</h2>
        {message && <p className="mb-4 text-center">{message}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="newPassword" className="block text-gray-700 text-sm font-bold mb-2">
              New Password:
            </label>
            <input
              type="password"
              id="newPassword"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="confirmPassword" className="block text-gray-700 text-sm font-bold mb-2">
              Confirm New Password:
            </label>
            <input
              type="password"
              id="confirmPassword"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
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
              'Reset Password'
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPasswordPage;