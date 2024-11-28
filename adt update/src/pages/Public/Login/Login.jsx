import React, { useState, useRef } from 'react';
import './Login.css'; // Ensure the styling is in the same directory as the component
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [status, setStatus] = useState('idle');
  const [isFieldsDirty, setIsFieldsDirty] = useState(false);
  const emailRef = useRef();
  const passwordRef = useRef();
  const navigate = useNavigate();

  const handleOnChange = (e, type) => {
    setIsFieldsDirty(true);
    if (type === 'email') {
      setEmail(e.target.value);
    } else if (type === 'password') {
      setPassword(e.target.value);
    }
  };

  // Improved login function with error handling and form validation
  const handleLogin = async () => {
    // Validation: Ensure email and password are not empty
    if (!email || !password) {
      setError('Please fill in both fields');
      return;
    }

    setStatus('loading');
    setError(''); // Reset previous errors

    const data = { email, password };

    try {
      // Replace with your actual API URL for login
      const response = await axios.post('/admin/login', data, {
        headers: { 'Content-Type': 'application/json' }, // Set Content-Type
      });

      // Assuming the response contains a token or a similar object
      if (response.data.access_token) {
        localStorage.setItem('accessToken', response.data.access_token);
        navigate('/main/movies'); // Redirect after successful login
      } else {
        setError('Invalid credentials, please try again.');
      }
      setStatus('idle');
    } catch (err) {
      // Check if the error is from the server and handle it
      setError(err.response ? err.response.data.message : 'Something went wrong. Please try again later.');
      setStatus('idle');
    }
  };

  return (
    <div className='Login'>
      <div className='form-container'>
        <h3>Login</h3>
        {error && <span className='error'>{error}</span>}

        {/* Email Input Field */}
        <div className='form-group'>
          <label htmlFor='email'>Email:</label>
          <input
            type='text'
            id='email'
            name='email'
            ref={emailRef}
            onChange={(e) => handleOnChange(e, 'email')}
            value={email}
            autoFocus
          />
          {isFieldsDirty && !email && <span className='error'>This field is required</span>}
        </div>

        {/* Password Input Field */}
        <div className='form-group'>
          <label htmlFor='password'>Password:</label>
          <input
            type='password'
            id='password'
            name='password'
            ref={passwordRef}
            onChange={(e) => handleOnChange(e, 'password')}
            value={password}
          />
          {isFieldsDirty && !password && <span className='error'>This field is required</span>}
        </div>

        {/* Submit Button */}
        <div className='submit-container'>
          <button
            type='button'
            disabled={status === 'loading'} // Disable when loading
            onClick={handleLogin}
          >
            {status === 'loading' ? 'Loading...' : 'Login'}
          </button>
        </div>

        {/* Register Link */}
        <div className='register-container'>
          <p>
            Don't have an account? <a href='/register'>Register</a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
