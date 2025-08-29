'use client';

import { useState } from 'react';

export default function Dropdown({
  label,
  placeholder,
  className = '',
  options = ['Admin', 'Author', 'Student'],
  ...props
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState('');

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  const handleSelect = (option) => {
    setSelectedOption(option);
    setIsOpen(false);
  };

  return (
    <div className={`dropdown-container ${className}`}>
      <div className="dropdown-label-margin">
        <label className="dropdown-label">{label}</label>
      </div>

      <div className="dropdown-input">
        <div className="dropdown-trigger" onClick={handleToggle}>
          <div className="dropdown-content">
            <div className="dropdown-text">
              {selectedOption || placeholder}
            </div>
          </div>
          <div className="dropdown-icons">
            <div className={`dropdown-chevron ${isOpen ? 'dropdown-chevron-open' : ''}`}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="16" height="16" fill="white" style={{mixBlendMode: 'multiply'}} />
                <path d="M8 10.9998L3 5.9998L3.7 5.2998L8 9.5998L12.3 5.2998L13 5.9998L8 10.9998Z" fill="#161616"/>
              </svg>
            </div>
          </div>
        </div>

        {isOpen && (
          <div className="dropdown-options">
            {options.map((option, index) => (
              <div
                key={index}
                className="dropdown-option"
                onClick={() => handleSelect(option)}
              >
                {option}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
