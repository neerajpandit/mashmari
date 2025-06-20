import React, { useState } from 'react';
import {
  FaChevronRight,
  FaChevronDown,
  FaFileAlt,
  FaSortDown,
  FaChevronLeft,
  FaSortUp,
} from 'react-icons/fa';

const FileTable = ({
  file,
  folderCode,
  selectedFile,
  selectedFileData,
  handleFileClick,
}) => {
  const [sortConfig, setSortConfig] = useState({ column: null, direction: 'desc' });
  const [currentPage, setCurrentPage] = useState(1);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const rowsPerPage = 10;
  const isSelected = selectedFile.folderCode === folderCode && selectedFile.fileName === file;
  const fileData = selectedFileData[folderCode];
  const excludedColumns = ['ClickMode', 'ManuallyPlay', 'Version'];

  const handleSort = (columnIndex) => {
    if (!fileData) return;
    const header = fileData[0][columnIndex];
    if (excludedColumns.includes(header)) return;

    setSortConfig((prevConfig) => {
      setCurrentPage(1);
      if (prevConfig.column === columnIndex) {
        return {
          column: columnIndex,
          direction: prevConfig.direction === 'asc' ? 'desc' : 'asc',
        };
      }
      return { column: columnIndex, direction: 'desc' };
    });
  };

  const sortedData = () => {
    if (!fileData) return [];
    const [headers, ...rows] = fileData;
    const { column, direction } = sortConfig;
    if (column === null) return rows;

    const sorted = [...rows].sort((a, b) => {
      const valA = a[column];
      const valB = b[column];

      const numA = parseFloat(valA);
      const numB = parseFloat(valB);

      if (!isNaN(numA) && !isNaN(numB)) {
        return direction === 'asc' ? numA - numB : numB - numA;
      }

      return direction === 'asc'
        ? valA.localeCompare(valB)
        : valB.localeCompare(valA);
    });

    return sorted;
  };

 const parseDateFlexible = (input) => {
  if (!input || typeof input !== 'string') return null;

  // Try built-in Date parsing
  const standard = new Date(input);
  if (!isNaN(standard)) return standard;

  // Patterns to match various common formats
  const patterns = [
    { regex: /^(\d{2})\/(\d{2})\/(\d{2})$/, format: (d, m, y) => new Date(`20${y}-${m}-${d}`) }, // DD/MM/YY
    { regex: /^(\d{2})\/(\d{2})\/(\d{4})$/, format: (d, m, y) => new Date(`${y}-${m}-${d}`) },   // DD/MM/YYYY
    { regex: /^(\d{2})-(\d{2})-(\d{4})$/, format: (d, m, y) => new Date(`${y}-${m}-${d}`) },     // DD-MM-YYYY
    { regex: /^(\d{4})\/(\d{2})\/(\d{2})$/, format: (y, m, d) => new Date(`${y}-${m}-${d}`) },   // YYYY/MM/DD
    { regex: /^(\d{2})-(\d{2})-(\d{2})$/, format: (m, d, y) => new Date(`20${y}-${m}-${d}`) },   // MM-DD-YY
    { regex: /^(\d{2})-(\d{2})-(\d{4})$/, format: (m, d, y) => new Date(`${y}-${m}-${d}`) },     // MM-DD-YYYY
  ];

  for (const { regex, format } of patterns) {
    const match = input.match(regex);
    if (match) {
      const [, p1, p2, p3] = match;
      const date = format(p1, p2, p3);
      if (!isNaN(date)) return date;
    }
  }

  return null;
};


const filteredData = () => {
  const sorted = sortedData();
  const [headers] = fileData || [[]];
  const startDateTimeIndex = headers.indexOf('StartDateTime');

  if (searchOpen && searchTerm && startDateTimeIndex !== -1) {
    return sorted.filter((row) => {
      const cellValue = row[startDateTimeIndex];
      const cellDate = new Date(cellValue);
      const searchDate = parseDateFlexible(searchTerm);

      if (!isNaN(cellDate) && searchDate && !isNaN(searchDate)) {
        return cellDate.toDateString() === searchDate.toDateString();
      }

      return cellValue.toLowerCase().includes(searchTerm.toLowerCase());
    });
  }

  return sorted;
};


  const paginatedData = () => {
    const data = filteredData();
    const startIndex = (currentPage - 1) * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    return data.slice(startIndex, endIndex);
  };

  const totalPages = Math.ceil((filteredData().length || 0) / rowsPerPage);

  return (
    <div>
      <div
        onClick={() => handleFileClick(folderCode, file)}
        className={`flex items-center gap-2 py-2 px-3 cursor-pointer bg-white border rounded mb-1 ${isSelected ? 'bg-white border-black-300' : 'border-gray-200'
          } hover:shadow-md transition-all`}
      >
        {isSelected ? (
          <FaChevronDown className="text-black text-sm" />
        ) : (
          <FaChevronRight className="text-black text-sm" />
        )}
        <FaFileAlt className="text-gray-900" />
        <span className="text-sm text-black">{file}</span>
      </div>

      {isSelected && fileData?.length > 0 && (
        <div className="ml-6 mt-2 overflow-x-auto">
          <table className="min-w-full text-sm divide-y divide-gray-200">
            <thead className="bg-gray-100">
              <tr>
                {fileData[0].map((header, idx) => {
                  const isSortable = !excludedColumns.includes(header);
                  const isActive = sortConfig.column === idx;

                  return (
                    <th
                      key={idx}
                      onClick={() => handleSort(idx)}
                      className={`px-2 py-4 text-left font-medium border border-gray-200 text-gray-700 ${isSortable ? 'cursor-pointer' : ''}`}
                    >
                      <div className="flex items-center gap-1 relative">
                        {header}

                        {/* Sort Icons */}
                        {isSortable && (
                          <div className="flex flex-col -space-y-1 text-s ml-1">
                            <FaSortUp className={`${isActive && sortConfig.direction === 'asc' ? 'text-black' : 'text-gray-700'}`} />
                            <FaSortDown className={`${isActive && sortConfig.direction === 'desc' ? 'text-black' : 'text-gray-700'}`} />
                          </div>
                        )}

                        {/* Search icon only for StartDateTime */}
                        {header === 'StartDateTime' && (
                          <button
                            className="ml-2 text-xs text-blue-600"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSearchOpen((prev) => !prev);
                              setSearchTerm('');
                            }}
                          >
                            🔍
                          </button>
                        )}
                      </div>

                      {/* Search Box */}
                      {header === 'StartDateTime' && searchOpen && (
                        <div className="absolute z-10 mt-1">
                          <div className="flex items-center gap-1 bg-white p-2 border rounded shadow-lg">
                            <input
                              type="text"
                               placeholder="e.g - 30-Apr-2025"
                              value={searchTerm}
                              onChange={(e) => {
                                setSearchTerm(e.target.value);
                                setCurrentPage(1);
                              }}
                              className="border p-1 rounded text-xs"
                            />
                            <button
                              className="text-red-500 text-sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                setSearchOpen(false);
                                setSearchTerm('');
                              }}
                            >
                              ❌
                            </button>
                          </div>
                        </div>
                      )}
                    </th>
                  );
                })}
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {paginatedData().map((row, rowIdx) => (
                <tr key={rowIdx} className="hover:bg-gray-50">
                  {row.map((cell, cellIdx) => {
                    const header = fileData[0][cellIdx];

                    if (header === 'CurrentStatus') {
                      return (
                        <td key={cellIdx} className="px-2 py-4 border border-gray-200">
                          {cell === 'Close Screen' ? (
                            <span className="bg-yellow-100 text-yellow-800 text-xs font-medium px-2.5 py-0.5 rounded">
                              Close Screen
                            </span>
                          ) : cell === 'Start Play' ? (
                            <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
                              Start Play
                            </span>
                          ) : (
                            <span className="text-gray-700">{cell}</span>
                          )}
                        </td>
                      );
                    }

                    if (header === 'ManuallyPlay') {
                      return (
                        <td key={cellIdx} className="px-2 py-4">
                          {cell === 'true' ? (
                            <span className="bg-purple-900 text-white text-xs font-semibold px-2.5 py-0.5 rounded-full">
                              Manual
                            </span>
                          ) : (
                            <span className="bg-gray-200 text-gray-800 text-xs font-semibold px-2.5 py-0.5 rounded-full">
                              Auto
                            </span>
                          )}
                        </td>
                      );
                    }

                    return (
                      <td key={cellIdx} className="px-2 py-4 text-gray-800 border border-gray-200">
                        {cell}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination Controls */}
          {filteredData().length > rowsPerPage && (
            <div className="flex justify-center items-center gap-4 mt-3">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="p-2 bg-gray-200 rounded disabled:opacity-50"
              >
                <FaChevronLeft className="text-sm" />
              </button>
              <span className="text-sm text-gray-700">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage((prev) => (prev < totalPages ? prev + 1 : prev))}
                disabled={currentPage === totalPages}
                className="p-2 bg-gray-200 rounded disabled:opacity-50"
              >
                <FaChevronRight className="text-sm" />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default FileTable;
