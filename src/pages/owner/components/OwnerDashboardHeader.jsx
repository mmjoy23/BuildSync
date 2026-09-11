import React, { useState, useRef, useEffect } from 'react';
import Button from '../../../components/common/Button';
import Icon from '../../../components/common/Icon';
import { monthsList } from '../../../data/ownerDashboardData';

/**
 * OwnerDashboardHeader
 * Page header with greeting, subtitle, interactive month selector, and "Add Property" button.
 */
function OwnerDashboardHeader({
  name = 'Rahman Ahmed',
  greeting = 'Good Evening',
  subtitle = "Here's an overview of your properties and activities.",
  onAddProperty,
}) {
  const [selectedMonth, setSelectedMonth] = useState(monthsList[0]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsDropdownOpen(false);
      }
    };
    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isDropdownOpen]);

  return (
    <div className="owner-header">
      <div>
        <h1 className="owner-header__greeting">
          {greeting}, {name}
        </h1>
        <p className="owner-header__subtitle">{subtitle}</p>
      </div>

      <div className="owner-header__controls">
        {/* Month Selector */}
        <div className="month-selector" ref={dropdownRef}>
          <button
            type="button"
            className="month-selector__btn"
            onClick={() => setIsDropdownOpen((prev) => !prev)}
            aria-expanded={isDropdownOpen}
          >
            <Icon name="calendar" size={16} />
            <span>{selectedMonth}</span>
            <Icon name="chevron-down" size={14} />
          </button>

          {isDropdownOpen && (
            <div className="month-selector__dropdown">
              {monthsList.map((month) => (
                <button
                  key={month}
                  type="button"
                  className={`month-selector__item ${month === selectedMonth ? 'active' : ''}`}
                  onClick={() => {
                    setSelectedMonth(month);
                    setIsDropdownOpen(false);
                  }}
                >
                  {month}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Add Property Button */}
        <Button
          variant="primary"
          icon={<Icon name="plus" size={16} />}
          onClick={onAddProperty}
        >
          Add Property
        </Button>
      </div>
    </div>
  );
}

export default OwnerDashboardHeader;
