import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import Loader from '../components/Loader';
import FolderCard from '../components/FolderCard';
const apiUrl = import.meta.env.VITE_API_URL;
const ViewLogs = () => {
  const location = useLocation();
  const awc = location.state?.awc;

  const [selectedFileData, setSelectedFileData] = useState({});
  const [selectedFile, setSelectedFile] = useState({ folderCode: null, fileName: null });
  const [expandedFolder, setExpandedFolder] = useState(awc?.code); 

  const handleFileClick = async (folderCode, fileName) => {
    if (selectedFile.folderCode === folderCode && selectedFile.fileName === fileName) {
      setSelectedFile({ folderCode: null, fileName: null });
      setSelectedFileData({});
      return;
    }

    setSelectedFile({ folderCode, fileName });

    try {
      const key = `mashmari-rms-logs/${folderCode}/${fileName}`;
      const token = localStorage.getItem('accessToken');

      const response = await axios.get(
        `${apiUrl}/anganwadi/read-report?key=${key}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const csvText = response.data.content;

      const rows = csvText
        .split('\n')
        .filter(Boolean)
        .map((line) => line.trim().split('||').map((cell) => cell.trim()));

      setSelectedFileData((prev) => ({
        ...prev,
        [folderCode]: rows,
      }));
    } catch (error) {
      console.error('❌ Error reading file:', error.message);
    }
  };

  const handleToggle = (code) => {
    setExpandedFolder((prev) => (prev === code ? null : code));
    setSelectedFileData({});
    setSelectedFile({ folderCode: null, fileName: null });
  };

  if (!awc) {
    return <p className="text-center text-red-500 mt-4">❗ No AWC data found</p>;
  }

  return (
    <div className="overflow-x-auto p-6">
      <h1 className="text-2xl font-bold">Anganwadi Center Logs - {awc.code}</h1>
      <p className="text-s mb-6">Browsing logs for a specific Anganwadi center</p>

      {/* 🔁 Reusing FolderCard with single folder data */}
      <FolderCard
        folder={awc}
        expandedFolder={expandedFolder}
        selectedFile={selectedFile}
        selectedFileData={selectedFileData}
        handleToggle={handleToggle}
        handleFileClick={handleFileClick}
      />
    </div>
  );
};

export default ViewLogs;
