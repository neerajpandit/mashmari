import React, { useState, useEffect } from 'react';
import SummaryCards from './SummaryCards';
import SummaryChart from './SummaryChart';
import AWCFilter from './AWCFilter';
import AWCSearch from './AWCSearch';
import Loader from './Loader';
import AWCLogCard from './AWCLogCard';
import customAxios from '../utils/customAxios';
const apiUrl = import.meta.env.VITE_API_URL;
const Dashboardmain = () => {
    const [filters, setFilters] = useState({
        status: '',
        cluster: '',
        code: '',
        awcCode: '',
    });
    const [selectedFolderCode, setSelectedFolderCode] = useState(null);

    const [siteNameOptions, setSiteNameOptions] = useState([]);
    const [awcLogCardsData, setAwcLogCardsData] = useState([]);
    const [filteredCards, setFilteredCards] = useState([]);
    const [summaryData, setSummaryData] = useState(null);
    const [codeOptions, setCodeOptions] = useState([]);
    const [statusOptions, setStatusOptions] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchLogCardData = async () => {
            try {
                setLoading(true);

                const token = localStorage.getItem('accessToken'); 

                const res = await fetch(`${apiUrl}/anganwadi?prefix=mashmari-rms-logs/`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });

                //  const res = await fetch('http://monitoring.mashmari.in:8000/api/v1/anganwadi?prefix=mashmari-rms-logs/');
                const json = await res.json();
                const folders = json?.data?.folders || [];

                const mappedData = folders.map((folder, index) => {
                    // console.log("folder.siteName:", folder.siteName);
                    const status = folder.hasLogFiles ? 'Active' : 'No Logs';
                    return {
                        name: `AWC-${index + 1}`,
                        code: folder.code,
                        siteName: folder.siteName || '',
                        status,
                        lastModified: folder.lastModified,
                        state: '',
                        district: '',
                        cluster: '',
                        fileCount: folder.fileCount,
                        totalSize: folder.totalSize,
                        sampleFiles: folder.sampleFiles,
                        hasLogFiles: folder.hasLogFiles
                    };
                });

                setAwcLogCardsData(mappedData);
                setFilteredCards(mappedData);

                const uniqueSiteNames = [...new Set(mappedData.map(awc => awc.siteName).filter(Boolean))];
                setSiteNameOptions(uniqueSiteNames);

                const uniqueStatuses = [...new Set(mappedData.map(awc => awc.status))];
                const codes = mappedData.map(awc => ({
                    label: `${awc.code} - ${awc.siteName}`,
                    value: awc.code
                }));

                setCodeOptions(codes);
                setStatusOptions(uniqueStatuses);

                const total = mappedData.length;
                const reporting = mappedData.filter(awc => awc.status === 'Active').length;
                const notReporting = mappedData.filter(awc => awc.status === 'No Logs').length;
                setSummaryData({ total, reporting, notReporting });

            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchLogCardData();
    }, []);

    const handleFilterChange = (type, value) => {
        const updatedFilters = { ...filters, [type]: value };
        setFilters(updatedFilters);

        const filtered = awcLogCardsData.filter((awc) =>
            (!updatedFilters.status || awc.status === updatedFilters.status) &&
            (!updatedFilters.cluster || awc.cluster === updatedFilters.cluster) &&
            (!updatedFilters.code || awc.code === updatedFilters.code) &&
            (!updatedFilters.awcCode ||
                awc.name?.toLowerCase().includes(updatedFilters.awcCode.toLowerCase()) ||
                awc.code?.toLowerCase().includes(updatedFilters.awcCode.toLowerCase()) ||
                awc.siteName?.toLowerCase().includes(updatedFilters.awcCode.toLowerCase()))
        );
        setFilteredCards(filtered);
    };

    return (
        <div className="bg-gray-100 min-h-screen p-6 flex justify-center">
            <div className="bg-white shadow-lg rounded-xl p-8 w-full max-w-7xl">
                {loading ? (
                    <Loader />
                ) : (
                    <>
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
                            <h2 className="text-2xl font-bold text-[#701a75]">ANGANWADI CENTER</h2>
                            <div className="flex flex-col items-end">
                                <p className="text-sm text-gray-400">
                                    Select an anganwadi to filter the log data or search by name/code
                                </p>
                                <AWCSearch
                                    className="mt-2 w-64"
                                    value={filters.awcCode || ''}
                                    onChange={handleFilterChange}
                                />
                            </div>
                        </div>

                        {summaryData && <SummaryCards data={summaryData} />}

                        <AWCFilter
                            filters={filters}
                            onChange={handleFilterChange}
                            codeOptions={codeOptions}
                            statusOptions={statusOptions}
                            overflow-visible
                        />

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
                            {filteredCards.map((awc, idx) => (
                                <AWCLogCard key={awc.code || idx} awc={awc} />
                            ))}
                        </div>

                        {summaryData && <SummaryChart data={summaryData} />}
                    </>
                )}
            </div>
        </div>
    );
};

export default Dashboardmain;
