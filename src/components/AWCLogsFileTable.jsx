import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Loader from './Loader';
import FolderCard from './FolderCard';
const apiUrl = import.meta.env.VITE_API_URL;
const AWCLogsFileTable = () => {
  const [folders, setFolders] = useState([]);
  const [filteredFolders, setFilteredFolders] = useState([]);
  const [expandedFolder, setExpandedFolder] = useState(null);
  const [selectedFileData, setSelectedFileData] = useState({});
  const [selectedFile, setSelectedFile] = useState({ folderCode: null, fileName: null });
  const [loading, setLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCode, setSelectedCode] = useState('');

  const [currentPage, setCurrentPage] = useState(1);
  const foldersPerPage = 10;

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('accessToken');
        const res = await axios.get(
          `${apiUrl}/anganwadi?prefix=mashmari-rms-logs/`,
          // 'http://monitoring.mashmari.in:8000/api/v1/anganwadi?prefix=mashmari-rms-logs/',
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const fetchedFolders = res.data.data.folders || [];
        setFolders(fetchedFolders);
        setFilteredFolders(fetchedFolders);
      } catch (err) {
        console.error('Error fetching folders:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    // Filter folders based on search term and selected code
    const filtered = folders.filter((folder) => {
      const matchesSearch = folder.code.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesDropdown = selectedCode ? folder.code === selectedCode : true;
      return matchesSearch && matchesDropdown;
    });

    setFilteredFolders(filtered);
    setCurrentPage(1);
  }, [searchTerm, selectedCode, folders]);

  const handleToggle = (code) => {
    setExpandedFolder((prev) => (prev === code ? null : code));
    setSelectedFileData({});
  };

  const handleFileClick = async (folderCode, fileName) => {
    if (selectedFile.folderCode === folderCode && selectedFile.fileName === fileName) {
      setSelectedFile({ folderCode: null, fileName: null });
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

      setSelectedFileData((prevData) => ({
        ...prevData,
        [folderCode]: rows,
      }));
    } catch (error) {
      console.error("❌ Error reading file:", error.message);
    }
  };

  // Pagination
  const indexOfLast = currentPage * foldersPerPage;
  const indexOfFirst = indexOfLast - foldersPerPage;
  const currentFolders = filteredFolders.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredFolders.length / foldersPerPage);

  return (
    <div className="overflow-x-auto">
      <h1 className="text-2xl font-bold">Anganwadi Center Logs (Folder View)</h1>
      <p className="text-sm mb-4 text-gray-600">Search and filter logs by folder code</p>

      {/* Search + Dropdown */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <input
          type="text"
          placeholder="Search by code..."
          className="p-2 border rounded w-full md:w-1/2"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <select
          value={selectedCode}
          onChange={(e) => setSelectedCode(e.target.value)}
          className="p-2 border rounded w-full md:w-1/2"
        >
          <option value="">Filter by folder code</option>
          {folders.map((folder) => (
            <option key={folder.code} value={folder.code}>
              {folder.code}
            </option>
          ))}
        </select>
      </div>

      {loading ? (
        <Loader />
      ) : (
        <>
          <div className="space-y-4">
            {currentFolders.map((folder) => (
              <FolderCard
                key={folder.code}
                folder={folder}
                expandedFolder={expandedFolder}
                selectedFile={selectedFile}
                selectedFileData={selectedFileData}
                handleToggle={handleToggle}
                handleFileClick={handleFileClick}
              />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-4 mt-6">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 border rounded bg-gray-100 hover:bg-gray-200 disabled:opacity-50"
              >
                ‹
              </button>
              <span className="text-sm">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-3 py-1 border rounded bg-gray-100 hover:bg-gray-200 disabled:opacity-50"
              >
                ›
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default AWCLogsFileTable;
