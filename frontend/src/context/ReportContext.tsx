"use client";
import { mockReport } from '@/mock.data';
import { AnalysisResult } from '@/types';
import React, { createContext, useState, ReactNode, useContext } from 'react';

export interface Report {
    id: string;
    analysisResult: AnalysisResult;
    analysisTimestamp: string;
    uploadTimestamp: string;
    filepath: string;
}

interface ReportContextProps {
    reports: Report[];
    addReport: (report: Report) => void;
    removeReport: (id: string) => void;
}

const ReportContext = createContext<ReportContextProps | undefined>(undefined);

const useReports = () => {
    const context = useContext(ReportContext);
    if (context === undefined) {
        throw new Error('useReports must be used within a ReportProvider');
    }
    return context;
}

const ReportProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [reports, setReports] = useState<Report[]>([mockReport]);

    const addReport = (report: Report) => {
        setReports([...reports, report]);
    };

    const removeReport = (id: string) => {
        setReports(reports.filter(report => report.id !== id));
    };

    return (
        <ReportContext.Provider value={{ reports, addReport, removeReport }}>
            {children}
        </ReportContext.Provider>
    );
};

export { ReportProvider, useReports };