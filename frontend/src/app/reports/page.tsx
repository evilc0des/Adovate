import React from 'react';

const ReportsPage = () => {
    const reports = [
        { id: 1, name: 'Report 1', description: 'Description of Report 1' },
        { id: 2, name: 'Report 2', description: 'Description of Report 2' },
        { id: 3, name: 'Report 3', description: 'Description of Report 3' },
    ];

    return (
        <div>
            <h1>Reports</h1>
            <ul>
                {reports.map(report => (
                    <li key={report.id}>
                        <h2>{report.name}</h2>
                        <p>{report.description}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ReportsPage;