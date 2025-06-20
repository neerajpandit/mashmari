
import React from 'react';

const SummaryCards = ({ data }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <Card title="Total Anganwadi Centers " value={data.total} color="purple" />
      <Card title="Active Anganwadi Centers" value={data.reporting} color="green" />
      <Card title="No Logs Anganwadi Centers" value={data.notReporting} color="red" />
    </div>
  );
};

const Card = ({ title, value, color }) => {
  const colorMap = {
    purple: 'bg-purple-100 border-[#701a75] text-[#4a044e]',
    green: 'bg-green-100 border-green-600 text-green-800',
    red: 'bg-red-100 border-red-600 text-red-800',
  };

  return (
    <div className={`border-l-4 p-4 rounded-md shadow ${colorMap[color]}`}>
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  );
};

export default SummaryCards;
