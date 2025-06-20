import React, { useState } from 'react';
import FileTable from './FileTable';
import { FaChevronDown, FaChevronRight, FaFolder } from 'react-icons/fa';
const apiUrl = import.meta.env.VITE_API_URL;
const AWCLogDetails = ({ awc, onBack }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileData, setFileData] = useState([]);

  const handleFileClick = async (fileName) => {
    if (selectedFile === fileName) {
      setSelectedFile(null);
      setFileData([]);
      return;
    }

    setSelectedFile(fileName);

    try {
      const key = `mashmari-rms-logs/${awc.code}/${fileName}`;
      const res = await fetch(`${apiUrl}/anganwadi/read-report?key=${key}`);
      const data = await res.json();

      const rows = data.content
        .split('\n')
        .filter(Boolean)
        .map(line => line.trim().split('||').map(cell => cell.trim()));

      setFileData(rows);
    } catch (err) {
      console.error('Error reading file:', err.message);
    }
  };

  return (
    <div className="p-4 bg-white shadow rounded-lg">
      <button onClick={onBack} className="mb-4 px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded text-sm">← Back to Dashboard</button>

      <div className="flex items-center gap-2 text-purple-700 font-bold text-lg mb-4">
        <FaFolder />
        <span>{awc.code} {awc.siteName ? `/ ${awc.siteName}` : ''}</span>
      </div>

      <div className="space-y-2">
        {awc.sampleFiles.map((file, idx) => (
          <div key={idx}>
            <div
              className="flex items-center gap-2 text-sm bg-gray-100 p-2 rounded cursor-pointer hover:bg-gray-200"
              onClick={() => handleFileClick(file)}
            >
              {selectedFile === file ? <FaChevronDown /> : <FaChevronRight />}
              <span>{file}</span>
            </div>

            {selectedFile === file && fileData.length > 0 && (
              <div className="mt-2 ml-6">
                <FileTable
                  file={file}
                  folderCode={awc.code}
                  selectedFile={{ folderCode: awc.code, fileName: file }}
                  selectedFileData={{ [awc.code]: fileData }}
                  handleFileClick={() => { }}
                />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default AWCLogDetails;
