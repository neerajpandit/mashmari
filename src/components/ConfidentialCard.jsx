import React, { useState } from 'react';
import { FaEye, FaEyeSlash, FaCopy, FaUserLock, FaKey, FaCloud } from 'react-icons/fa';

const InfoRow = ({ label, value, isSecret = false, icon }) => {
  const [show, setShow] = useState(!isSecret);
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col gap-1 border-b py-3">
      <div className="text-sm font-semibold text-gray-600 flex items-center gap-2">
        {icon} {label}
      </div>
      <div className="flex justify-between items-center gap-3">
        <span
          className={`font-mono text-sm text-gray-800 break-all ${show ? '' : 'blur-sm select-none'
            }`}
        >
          {value}
        </span>
        <div className="flex items-center gap-3 text-gray-500">
          {isSecret && (
            <button onClick={() => setShow(!show)} title={show ? 'Hide' : 'Show'}>
              {show ? <FaEyeSlash /> : <FaEye />}
            </button>
          )}
          <button onClick={handleCopy} title="Copy">
            <FaCopy className={`${copied ? 'text-green-600' : ''}`} />
          </button>
        </div>
      </div>
      {copied && <span className="text-xs text-green-600">✔ Copied!</span>}
    </div>
  );
};

const ConfidentialCard = () => {
  // Cloud Credentials


  return (
    <div className="max-w-xl mx-auto bg-white shadow-xl rounded-xl p-6 border border-purple-200">
      <h2 className="text-2xl font-bold text-purple-900 mb-1 flex items-center gap-2">
        <FaCloud /> Confidential Access
      </h2>
      <p className="text-sm text-gray-500 mb-4">
        These credentials are sensitive. Please store them securely.
      </p>

      {/* Login Info */}
      <div className="bg-gray-50 rounded-md p-4 mb-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">🔐 Login Credentials</h3>
        <InfoRow label="Username" value={loginUsername} icon={<FaUserLock />} />
        <InfoRow label="Password" value={loginPassword} isSecret={true} icon={<FaKey />} />
      </div>

      {/* Cloud Info */}
      <div className="bg-gray-50 rounded-md p-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">☁️ Cloud Credentials</h3>
        <InfoRow label="Access Key ID" value={accessKeyId} isSecret={true} icon={<FaKey />} />
        <InfoRow label="Secret Access Key" value={secretAccessKey} isSecret={true} icon={<FaKey />} />
        <InfoRow label="Region" value={region} icon={<FaCloud />} />
      </div>
    </div>
  );
};





export default ConfidentialCard;
