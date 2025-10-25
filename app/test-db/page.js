'use client';
import { useEffect, useState } from 'react';

export default function TestDB() {
  const [status, setStatus] = useState('Testing connection...');

  useEffect(() => {
    fetch('/api/users')
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setStatus('✅ Connected successfully!');
        } else {
          setStatus('❌ Connection failed: ' + data.error);
        }
      })
      .catch(err => setStatus('❌ Error: ' + err.message));
  }, []);

  return (
    <div style={{ padding: '20px' }}>
      <h1>Database Connection Test</h1>
      <p>{status}</p>
    </div>
  );
}