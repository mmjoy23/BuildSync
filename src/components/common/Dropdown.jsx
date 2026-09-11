import React, { useState, useRef, useEffect } from 'react';

/**
 * Dropdown component
 * Props:
 *  - trigger: ReactNode
 *  - align: 'right' | 'left'
 *  - children: ReactNode
 */
function Dropdown({ trigger, align = 'right', children, className = '' }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className={`dropdown ${className}`.trim()} ref={dropdownRef}>
      <div onClick={() => setIsOpen((prev) => !prev)}>{trigger}</div>
      {isOpen && (
        <div
          className={`dropdown__menu ${align === 'left' ? 'dropdown__menu--left' : ''}`}
          onClick={() => setIsOpen(false)}
        >
          {children}
        </div>
      )}
    </div>
  );
}

export default Dropdown;
