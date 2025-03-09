
import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const ForgotPassword = ({ onClose, backendUrl }) => {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [message, setMessage] = useState('');
  const [stage, setStage] = useState('email'); // 'email' | 'otp' | 'reset'
  const [loading, setLoading] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');


  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post(`${backendUrl}/api/user/forgot-password/request-otp`, { email });

      if (response.data.success) {
        setMessage('OTP sent to your email.');
        toast.success('OTP sent to your email.');
        setStage('otp'); // Move to OTP input stage
      } else {
        setMessage(response.data.message || 'Failed to send OTP.');
        toast.error(response.data.message || 'Failed to send OTP.');
      }
    } catch (error) {
      console.error('Error requesting OTP:', error);
      setMessage('An error occurred while processing your request.');
      toast.error('An error occurred while processing your request.');
    } finally {
      setLoading(false);
    }
  };


  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post(`${backendUrl}/api/user/forgot-password/verify-otp`, { email, otp });

      if (response.data.success) {
        setMessage('OTP verified.  Please set your new password.');
        toast.success('OTP verified.  Please set your new password.');
        setStage('reset');  //Move to reset password stage
      } else {
        setMessage(response.data.message || 'Invalid OTP.');
        toast.error(response.data.message || 'Invalid OTP.');
      }
    } catch (error) {
      console.error('Error verifying OTP:', error);
      setMessage('An error occurred while verifying OTP.');
      toast.error('An error occurred while verifying OTP.');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPasswordSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (newPassword !== confirmNewPassword) {
      setMessage('Passwords do not match.');
      toast.error('Passwords do not match.');
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post(`${backendUrl}/api/user/forgot-password/reset-password`, { email, otp, newPassword });

      if (response.data.success) {
        setMessage('Password reset successfully.');
        toast.success('Password reset successfully.');
        onClose(); // Close the modal
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
    <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-xl max-w-md w-full">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Forgot Password</h2>
        {message && <p className="mb-4 text-green-500">{message}</p>}

        {stage === 'email' && (
          <form onSubmit={handleEmailSubmit}>
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
                  'Send OTP'
                )}
              </button>
            </div>
          </form>
        )}

        {stage === 'otp' && (
          <form onSubmit={handleOtpSubmit}>
            <div className="mb-4">
              <label htmlFor="otp" className="block text-gray-700 text-sm font-bold mb-2">
                OTP (6-digit code):
              </label>
              <input
                type="text"
                id="otp"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
                maxLength="6"
                minLength="6"
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
                  'Verify OTP'
                )}
              </button>
            </div>
          </form>
        )}

        {stage === 'reset' && (
        <form onSubmit={handleResetPasswordSubmit}>
            <div className="mb-4">
                <label htmlFor="new-password" className="block text-gray-700 text-sm font-bold mb-2">
                    New Password:
                </label>
                <input
                    type="password"
                    id="new-password"
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                />
            </div>
            <div className="mb-4">
                <label htmlFor="confirm-new-password" className="block text-gray-700 text-sm font-bold mb-2">
                    Confirm New Password:
                </label>
                <input
                    type="password"
                    id="confirm-new-password"
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    value={confirmNewPassword}
                    onChange={(e) => setConfirmNewPassword(e.target.value)}
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
                    className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ${loading ? 'opacity-50 cursor-wait' : ''}`}
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
            </div>
        </form>
    )}
      </div>
    </div>
  );
};

export default ForgotPassword;
