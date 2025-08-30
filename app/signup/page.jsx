'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Button from '../../components/Button';
import Header from '../../components/Header';
import TextInput from '../../components/TextInput';
import CountryDropdown from '../../components/CountryDropdown';
import RoleDropdown from '../../components/RoleDropdown';

export default function SignUp() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    mobile: '',
    country: '',
    dateOfBirth: '',
    role: ''
  });

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        // Store token in localStorage
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        
        // Redirect based on role
        const userRole = data.user.role || formData.role;
        switch(userRole) {
          case 'Student':
            window.location.href = '/student-dashboard';
            break;
          case 'Author':
            window.location.href = '/author-dashboard';
            break;
          case 'Admin':
            window.location.href = '/admin-dashboard';
            break;
          default:
            window.location.href = '/student-dashboard';
        }
      } else {
        setError(data.error || 'Signup failed');
      }
    } catch (error) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signup-container">
      <Header />
      
      <main className="signup-main">
        <div className="signup-card">
          <div className="signup-header">
            <h1 className="signup-title">Create your account</h1>
          </div>

          {error && (
            <div style={{ 
              background: '#fee', 
              color: '#c33', 
              padding: '12px', 
              borderRadius: '8px', 
              marginBottom: '20px',
              textAlign: 'center'
            }}>
              {error}
            </div>
          )}

          <form className="signup-form" onSubmit={handleSubmit}>
            <TextInput 
              label="Full NAME"
              placeholder="Enter your full name"
              type="text"
              required
              value={formData.fullName}
              onChange={(e) => handleInputChange('fullName', e.target.value)}
            />
            
            <TextInput 
              label="Email address"
              placeholder="Enter your email"
              type="email"
              required
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
            />
            
            <TextInput 
              label="Create a password"
              placeholder="Enter your password"
              type="password"
              required
              value={formData.password}
              onChange={(e) => handleInputChange('password', e.target.value)}
            />
            
            <TextInput 
              label="Mobile Number"
              placeholder="Enter your mobile number"
              type="tel"
              required
              value={formData.mobile}
              onChange={(e) => handleInputChange('mobile', e.target.value)}
            />
            
            <CountryDropdown 
              label="Country"
              placeholder="Enter your Country"
              required
              value={formData.country}
              onChange={(value) => handleInputChange('country', value)}
            />
            
            <TextInput 
              label="Date of Birth"
              placeholder="mm/dd/yyyy"
              type="date"
              required
              value={formData.dateOfBirth}
              onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
              showCalendarIcon={true}
            />
            
            <RoleDropdown 
              label="I want to join as"
              placeholder="Select your role"
              required
              value={formData.role}
              onChange={(value) => handleInputChange('role', value)}
            />
            
            <Button 
              variant="primary" 
              className="signup-submit-button"
              type="submit"
              disabled={loading}
            >
              {loading ? 'Creating account...' : 'Create account'}
            </Button>
          </form>

          <div className="signup-footer">
            <p className="existing-account-text">Already have an account?</p>
            <Link href="/login">
              <Button variant="tertiary" className="signin-button">
                Sign in to your account
              </Button>
            </Link>
          </div>
        </div>
      </main>

      <footer className="signup-page-footer">
        <p className="footer-text">© 2024 Quick Course- All Rights Reserved.</p>
      </footer>
    </div>
  );
}
