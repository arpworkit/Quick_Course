'use client';

import { useRef } from 'react';

export default function TextInput({
  label,
  placeholder,
  type = 'text',
  helperText,
  helperLink = false,
  className = '',
  required = false,
  showCalendarIcon = false,
  ...props
}) {
  const inputRef = useRef(null);

  const handleCalendarClick = () => {
    if (inputRef.current && type === 'date') {
      try {
        // Try modern showPicker method first
        if (inputRef.current.showPicker) {
          inputRef.current.showPicker();
        } else {
          // Fallback: focus and click the input to trigger date picker
          inputRef.current.focus();
          inputRef.current.click();
        }
      } catch (error) {
        // Final fallback: just focus the input
        inputRef.current.focus();
      }
    }
  };
  return (
    <div className={`text-input-container ${className}`}>
      <div className="text-input-label-container">
        <div className="text-input-label-margin">
          <label className="text-input-label">
            {label}
            {required && <span className="required-asterisk">*</span>}
          </label>
        </div>
      </div>

      <div className="text-input-field-container">
        <div className="text-input-field">
          <input
            ref={inputRef}
            type={type}
            placeholder={placeholder}
            className="text-input"
            required={required}
            {...props}
          />
          {showCalendarIcon && (
            <div className="text-input-calendar-icon" onClick={handleCalendarClick}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="16" height="16" fill="white" style={{mixBlendMode: 'multiply'}}/>
                <path d="M13 2H11V1H10V2H6V1H5V2H3C2.45 2 2 2.45 2 3V13C2 13.55 2.45 14 3 14H13C13.55 14 14 13.55 14 13V3C14 2.45 13.55 2 13 2ZM13 13H3V6H13V13ZM13 5H3V3H5V4H6V3H10V4H11V3H13V5Z" fill="#161616"/>
              </svg>
            </div>
          )}
        </div>
        <div className="text-input-background"></div>
      </div>

      {helperText && (
        <div className="text-input-helper-margin">
          <div className={`text-input-helper ${helperLink ? 'text-input-helper-link' : ''}`}>
            {helperText}
          </div>
        </div>
      )}
    </div>
  );
}
