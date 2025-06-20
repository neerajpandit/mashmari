import React from 'react';

const AWCSearch = ({ value, onChange }) => {
  return (
    <input
      type="text"
      placeholder="Search by AWC Name or Code"
      value={value}
      onChange={(e) => onChange("awcCode", e.target.value)}
      className="border p-2 rounded-md w-full md:w-64"
    />
  );
};

export default AWCSearch;
