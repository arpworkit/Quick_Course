'use client';

import { useState, useEffect, useRef } from 'react';

const roles = ['Author', 'Student', 'Admin'];

export default function RoleDropdown({
  label,
  placeholder,
  className = '',
  required = false,
  value,
  onChange,
  ...props
}) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const handleToggle = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsOpen(!isOpen);
  };

  const handleSelect = (role) => {
    onChange(role);
    setIsOpen(false);
  };

  const handleOptionClick = (role) => (e) => {
    e.preventDefault();
    e.stopPropagation();
    handleSelect(role);
  };

  const handleChevronClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className={`dropdown-container ${className}`} ref={dropdownRef}>
      <div className="dropdown-label-margin">
        <label className="dropdown-label">
          {label}
          {required && <span className="required-asterisk">*</span>}
        </label>
      </div>

      <div className="dropdown-input">
        <div className="dropdown-trigger" onClick={handleToggle}>
          <div className="dropdown-content">
            <div className="dropdown-text">
              {value || placeholder}
            </div>
          </div>
          <div className="dropdown-icons">
            <div className={`dropdown-chevron ${isOpen ? 'dropdown-chevron-open' : ''}`} onClick={handleChevronClick}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="16" height="16" fill="white" style={{mixBlendMode: 'multiply'}} />
                <path d="M8 10.9998L3 5.9998L3.7 5.2998L8 9.5998L12.3 5.2998L13 5.9998L8 10.9998Z" fill="#161616"/>
              </svg>
            </div>
          </div>
        </div>

        {isOpen && (
          <div className="dropdown-options">
            {roles.map((role, index) => (
              <div
                key={index}
                className="dropdown-option"
                onClick={handleOptionClick(role)}
              >
                {role}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
