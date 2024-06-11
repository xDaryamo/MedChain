import React, { useState } from 'react';
import axios from 'axios';

const Authentication = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('');
  const [organization, setOrganization] = useState('');
  const [token, setToken] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async () => {
    try {
      const response = await axios.post('/auth/login', {
        username,
        password,
      });

      const { role, organization, token } = response.data;

      setRole(role);
      setOrganization(organization);
      setToken(token);
      setError('');

      console.log(`Login data: ${username} ${password} ${role} ${organization}`);
    } catch (error) {
      setError('Login failed: ' + error.message);
      console.error('Login failed:', error);
    }
  };

  const handleLogout = () => {
    setRole('');
    setOrganization('');
    setToken('');
    setUsername('');
    setPassword('');
    setError('');
  };

  return (
    <div>
      <h2>Authentication</h2>
      {token ? (
        <div>
          <p>Welcome, {username}!</p>
          <p>Role: {role}</p>
          <p>Organization: {organization}</p>
          <button onClick={handleLogout}>Logout</button>
        </div>
      ) : (
        <div>
          <label>
            Username:
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </label>
          <label>
            Password:
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </label>
          <button onClick={handleLogin}>Login</button>
          {error && <p style={{ color: 'red' }}>{error}</p>}
        </div>
      )}
    </div>
  );
};

export default Authentication;
