import React from 'react';

const About = () => {
  const containerStyle = {
    maxWidth: '900px',
    margin: '0 auto',
    padding: '40px',
    background: '#18181b',
    borderRadius: '16px',
    border: '1px solid rgba(255, 255, 255, 0.05)',
    boxShadow: '0 10px 40px rgba(0,0,0,0.5)',
    textAlign: 'center'
  };

  const socialBtnStyle = {
    display: 'inline-block',
    margin: '10px',
    padding: '10px 20px',
    background: '#27272a',
    color: '#fff',
    borderRadius: '8px',
    textDecoration: 'none',
    transition: 'all 0.3s ease',
    border: '1px solid rgba(255, 255, 255, 0.1)'
  };

  return (
    <div style={containerStyle}>
      <img
        src="/pavan-thorat.jpg"
        alt="Pavan Thorat"
        style={{ width: '180px', height: '180px', borderRadius: '50%', objectFit: 'cover', border: '4px solid #f97316', marginBottom: '20px', boxShadow: '0 4px 20px rgba(249, 115, 22, 0.4)' }}
      />
      <h2 style={{ fontSize: '2.5rem', marginBottom: '10px', color: '#fff' }}>About the Developer</h2>
      <h3 style={{ fontSize: '1.5rem', color: '#f97316', marginBottom: '15px' }}>Pavan Thorat</h3>

      <p style={{ color: '#a1a1aa', fontSize: '1.1rem', lineHeight: '1.8', maxWidth: '650px', margin: '0 auto 30px auto' }}>
        I am a developer focused on building responsive, user-friendly web applications. ShopNest is a full-stack MERN e-commerce project that demonstrates JWT-based authentication, product and inventory management, cart functionality, order workflows, and role-based admin features.
      </p>

      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '10px', marginTop: '20px' }}>
        <a href="https://www.linkedin.com/in/pavan-thorat-38bb20302" target="_blank" rel="noreferrer" style={{ ...socialBtnStyle, background: 'rgba(59, 130, 246, 0.2)', borderColor: '#3b82f6', color: '#93c5fd' }}>LinkedIn</a>
        <a href="https://leetcode.com/u/pavanthorat_1221/" target="_blank" rel="noreferrer" style={{ ...socialBtnStyle, background: 'rgba(234, 179, 8, 0.15)', borderColor: '#eab308', color: '#fde047' }}>LeetCode</a>
        <a href="https://github.com/pavanthorat1221" target="_blank" rel="noreferrer" style={socialBtnStyle}>GitHub</a>
      </div>
    </div>
  );
};

export default About;
