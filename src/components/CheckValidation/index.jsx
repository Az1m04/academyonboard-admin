import React from 'react';

const CheckValidation = ({ show, fallback, children }) => {
  return (
    <div>
      {show && children}
      {!show && fallback}
    </div>
  );
};

export default CheckValidation;

export const CheckValidationWithoutDiv = ({ show, fallback, children }) => {
  if (show) {
    return children;
  }
  return fallback || '';
};
