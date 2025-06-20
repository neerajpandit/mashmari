import React, { useState } from 'react';

import { FaChevronDown, FaChevronRight, FaFileAlt, FaFolder } from 'react-icons/fa';
import FileTable from './FileTable';

const FolderCard = ({
  folder,
  expandedFolder,
  selectedFile,
  selectedFileData,
  handleToggle,
  handleFileClick,
}) => {
  return (
    <div className="overflow-x-auto">
      <div
        key={folder.code}
        className="border rounded-md shadow-sm hover:shadow-md transition-all cursor-pointer bg-white"
      >
        <div
          className="flex flex-wrap sm:flex-nowrap items-start sm:items-center justify-between p-4 gap-2 overflow-x-auto"
          onClick={() => handleToggle(folder.code)}
        >

          <div className="flex items-center gap-3 text-[#4c0b4d] font-medium">
            {expandedFolder === folder.code ? <FaChevronDown /> : <FaChevronRight />}
            <FaFolder className="text-[#4c0b4d]" />
            <span>{folder.code}</span>
          </div>
          <div className="flex items-center gap-4 text-sm text-gray-600">
            <span>{folder.fileCount} {folder.fileCount === 1 ? 'file' : 'files'}</span>
            <span>{folder.sampleFiles.length} {folder.sampleFiles.length === 1 ? 'log' : 'logs'}</span>
            <span className="flex items-center gap-1">
              <FaFileAlt />
              {new Date(folder.lastModified).toLocaleDateString()}
            </span>
          </div>
        </div>

        {expandedFolder === folder.code && (
          <div className="bg-white px-6 py-3 border-t">
            {folder.sampleFiles.map((file, index) => (
              <FileTable
                key={index}
                file={file}
                folderCode={folder.code}
                selectedFile={selectedFile}
                selectedFileData={selectedFileData}
                handleFileClick={handleFileClick}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FolderCard;
