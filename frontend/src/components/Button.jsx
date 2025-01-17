import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

const Button = ({ to, label, color, onClick, isLink, className }) => {
  const baseStyles = `py-3 px-6 rounded-md text-lg font-semibold transition duration-200 shadow-lg ${className}`;
  const colorStyles = {
    blue: 'bg-blue-600 hover:bg-blue-700 text-white',
    green: 'bg-green-600 hover:bg-green-700 text-white',
    purple: 'bg-purple-600 hover:bg-purple-700 text-white',
    red: 'bg-red-600 hover:bg-red-700 text-white',
    gray: 'bg-gray-600 hover:bg-gray-700 text-white',
  };

  const buttonClasses = `${baseStyles} ${colorStyles[color] || colorStyles.blue}`;

  return isLink ? (
    <Link to={to} className={buttonClasses} onClick={onClick}>
      {label}
    </Link>
  ) : (
    <button onClick={onClick} className={buttonClasses}>
      {label}
    </button>
  );
};

Button.propTypes = {
  to: PropTypes.string,
  label: PropTypes.string.isRequired,
  color: PropTypes.oneOf(['blue', 'green', 'purple', 'red', 'gray']),
  onClick: PropTypes.func,
  isLink: PropTypes.bool,
  className: PropTypes.string,
};

Button.defaultProps = {
  color: 'blue',
  isLink: false,
  onClick: () => {},
  className: '',
};

export default Button;
