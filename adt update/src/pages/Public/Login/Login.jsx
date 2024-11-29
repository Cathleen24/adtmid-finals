import React, { useState, useRef } from 'react';
import './Login.css'; 
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

  
  const handleLogin = async () => {
    
    if (!email || !password) {
      setError('Please fill in both fields');
      return;
    }

    setStatus('loading');
    setError(''); 

    const data = { email, password };

    try {
      
      const response = await axios.post('/admin/login', data, {
        headers: { 'Content-Type': 'application/json' }, 
      });

      
      if (response.data.access_token) {
        localStorage.setItem('accessToken', response.data.access_token);
        navigate('/main/movies'); 
      } else {
        setError('Invalid credentials, please try again.');
      }
      setStatus('idle');
    } catch (err) {
      
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
            disabled={status === 'loading'} 
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
