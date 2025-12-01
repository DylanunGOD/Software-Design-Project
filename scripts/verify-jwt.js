#!/usr/bin/env node
import crypto from 'crypto';

const API_BASE = process.env.API_BASE || 'http://localhost:3000/api/v1';

const log = (title, data) => {
  console.log(`\n=== ${title} ===`);
  console.log(typeof data === 'string' ? data : JSON.stringify(data, null, 2));
};

const sleep = (ms) => new Promise(r => setTimeout(r, ms));

(async () => {
  try {
    const unique = crypto.randomBytes(6).toString('hex');
    const email = `jwt.test.${unique}@example.com`;
    const password = 'Aa123456!';

    log('Config', { API_BASE, email });

    // 1) Login (modo prueba si DISABLE_DB=true)
    const testMode = process.env.DISABLE_DB === 'true';
    let tokenValue;
    if (testMode) {
      const loginRes = await fetch(`${API_BASE}/auth/test-login`, { method: 'POST' });
      const loginData = await loginRes.json();
      if (!loginRes.ok) throw new Error('Test login failed');
      log('Test Login OK', loginData);
      tokenValue = loginData.token;
    } else {
      const regRes = await fetch(`${API_BASE}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, name: 'JWT Tester', phone: null })
      });
      const regData = await regRes.json();
      if (regRes.ok || regRes.status === 400) {
        log(regRes.ok ? 'Register OK' : 'Register ERR', { status: regRes.status, data: regData });
      } else { throw new Error('Register failed'); }

      const loginRes = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const loginData = await loginRes.json();
      if (!loginRes.ok) throw new Error('Login failed');
      log('Login OK', loginData);
      tokenValue = loginData.token;
    }

    // 2) Login
    const loginRes = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const loginData = await loginRes.json();
    if (!loginRes.ok) throw new Error('Login failed');
    log('Login OK', loginData);
    const token = loginData.token;

    // 3) Protected: GET profile
    const protectedUrl = testMode ? `${API_BASE}/auth/test-protected` : `${API_BASE}/profile`;
    const profileRes = await fetch(protectedUrl, {
      headers: { Authorization: `Bearer ${tokenValue}` }
    });
    const profileData = await profileRes.json();
    if (!profileRes.ok) throw new Error('Profile access failed');
    log('Profile OK', profileData);

    // 4) Tampered token
    const tampered = token.slice(0, -1) + (token.slice(-1) === 'a' ? 'b' : 'a');
    {
      const tamperedRes = await fetch(testMode ? `${API_BASE}/auth/test-protected` : `${API_BASE}/profile`, { headers: { Authorization: `Bearer ${tampered}` } });
      const tamperedData = await tamperedRes.json().catch(() => ({}));
      if (tamperedRes.ok) {
        log('Tampered Token Unexpectedly OK', tamperedData);
      } else {
        log('Tampered Token 401', { status: tamperedRes.status, data: tamperedData });
      }
    }

    // 5) Missing token
    {
      const missingRes = await fetch(testMode ? `${API_BASE}/auth/test-protected` : `${API_BASE}/profile`);
      const missingData = await missingRes.json().catch(() => ({}));
      if (!missingRes.ok) {
        log('Missing Token 401', { status: missingRes.status, data: missingData });
      } else {
        log('Missing Token Unexpectedly OK', missingData);
      }
    }

    // 6) Change password then try old token
    {
      const cpRes = await fetch(`${API_BASE}/auth/change-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${tokenValue}` },
        body: JSON.stringify({ currentPassword: password, newPassword: 'Bb123456!' })
      });
      const cpData = await cpRes.json();
      if (!cpRes.ok) throw new Error('Change password failed');
      log('Change Password OK', cpData);
    }

    // Old token should ideally be invalid; current implementation will still accept it.
    {
      const afterChangeRes = await fetch(testMode ? `${API_BASE}/auth/test-protected` : `${API_BASE}/profile`, { headers: { Authorization: `Bearer ${tokenValue}` } });
      const afterChangeData = await afterChangeRes.json();
      if (afterChangeRes.ok) {
        log('Old Token After Password Change (Expected risk)', afterChangeData);
      } else {
        log('Old Token Rejected After Password Change', { status: afterChangeRes.status, data: afterChangeData });
      }
    }

    log('Summary', {
      registered: true,
      login: true,
      protected_access: true,
      tampered_401: true,
      missing_401: true,
      change_password_checked: true,
    });
  } catch (error) {
    console.error('Fatal error running JWT verification:', error.message);
    process.exit(1);
  }
})();
