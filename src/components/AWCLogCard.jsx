//Dashboard pe jo card show ho rha h ushka code h 
import React from 'react';
import { FaFolder, FaFileAlt, FaCalendarAlt, FaFile } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';


const formatBytes = (bytes) => {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

const AWCLogCard = ({ awc, onViewLogs }) => {
  const {
    code = 'N/A',
    siteName = '',
    fileCount = 0,
    totalSize = 0,
    lastModified,
    sampleFiles = [],
    hasLogFiles = false
  } = awc || {};

  const navigate = useNavigate();
  const handleViewLogs = () => {
    // Navigate to settings with state
    navigate('/logs', { state: { awc } });
  };
  const formattedDate = lastModified
    ? new Date(lastModified).toLocaleString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    })
    : 'N/A';

  return (
    <div className="bg-white rounded-xl shadow-md p-4 w-full max-w-sm border border-purple-100 flex flex-col justify-between h-full">

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-black font-semibold">
          <FaFolder className="text-[#701a75] text-sm sm:text-base md:text-lg" />
          <span className="text-xs sm:text-sm break-words max-w-[200px]">
            {code}
            {siteName && ` / ${siteName}`}
          </span>
        </div>

        <span
          className={`text-xs sm:text-sm font-semibold px-3 py-[2px] rounded-full min-w-[70px] text-center 
  ${hasLogFiles ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
          {hasLogFiles ? '✔ Active' : '❌ No Logs'}
        </span>



      </div>

      <div className="mt-3 space-y-2 text-sm text-gray-700">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <FaFileAlt className="text-gray-600" />
            <span>Files:</span>
          </div>
          <span>{fileCount}</span>
        </div>

        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <FaFile className="text-gray-600" />
            <span>Size:</span>
          </div>
          <span>{formatBytes(totalSize)}</span>
        </div>

        <div className="flex justify-between items-start sm:items-center gap-2 sm:gap-4">
          <div className="flex items-center gap-2">
            <FaCalendarAlt className="text-gray-600 text-xs sm:text-sm" />
            <span className="text-xs sm:text-sm">Modified:</span>
          </div>
          <span className="text-[10px] sm:text-xs md:text-sm text-gray-800 text-right break-words max-w-[150px]">
            {formattedDate}
          </span>
        </div>

      </div>

      <div className="mt-3">
        <h4 className="text-xs font-semibold text-gray-600 mb-1">Sample files:</h4>

        {sampleFiles.length > 0 ? (
          <div className="space-y-1">
            {sampleFiles.map((file, idx) => (
              <div key={idx} className="flex items-center gap-2 text-xs text-gray-800">
                <FaFileAlt className="text-gray-800" />
                <span>{file}</span>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-xs text-red-600 font-semibold flex items-center gap-2">
            <FaFileAlt className="text-red-600" />
            <span>No sample files</span>
          </div>
        )}
      </div>



      <div className="mt-auto pt-4">
        <button
          className="w-full text-sm font-medium border border-[#701a75] text-[#701a75] px-4 py-2 rounded hover:bg-[#701a75] hover:text-white flex items-center justify-center gap-2"
          onClick={handleViewLogs}
        >
          <FaFileAlt />
          View Logs
        </button>
      </div>


    </div>
  );
};

export default AWCLogCard;
