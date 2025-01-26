"use client"
import React, { useState } from 'react';
import Image from "next/image";
import { XCircleIcon } from '@heroicons/react/20/solid';
import { CheckBadgeIcon } from '@heroicons/react/20/solid';
import { useAuth } from '@/context/AuthContext';
import axios from 'axios';
import { AnalysisResult } from '@/types';

interface FileUploadProps {
    setAnalysisResult: (result: AnalysisResult) => void;
    isWidget?: boolean;
}

const FileUpload = ({setAnalysisResult, isWidget}: FileUploadProps) => {
    const { user } = useAuth();
    const [file, setFile] = useState<File | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [filePath, setFilePath] = useState('');

    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files.length > 0) {
            setFile(event.target.files[0]);
            await handleUpload(event.target.files[0]);
        }
    };

    const cancelUpload = () => {

        setFile(null);
    }

    const handleUpload = async (file: File) => {
        if (!file || !user) return;

        const token = await user.getIdToken();

        const formData = new FormData();
        formData.append('file', file);

        setIsUploading(true);

        try {
            const response = await axios.post(`http://${process.env.NEXT_PUBLIC_SERVER_HOST}:${process.env.NEXT_PUBLIC_SERVER_PORT}/upload`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${token}`,
                },
            });
            setFilePath(response.data.firebaseFilePath);
            setIsUploading(false);
            return response.data;
        } catch (error) {
            setIsUploading(false);
            console.error('Error uploading file:', error);
        }
    };

    const handleAnalyze = async () => {
        if (!filePath || !user) return;

        const token = await user.getIdToken();

        try {
          // Fetch the analysis result
          const response = await axios.post(`http://${process.env.NEXT_PUBLIC_SERVER_HOST}:${process.env.NEXT_PUBLIC_SERVER_PORT}/analyze`, {
            filePath, // Pass the correct file path from Firestore
          }, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
          });
          setAnalysisResult(response.data.analysisResult);
        } catch (error) {
          console.error('Error fetching analysis result:', error);
        }
      };

    if(isWidget) {
        return (
            <div className="bg-gray-100 p-4 rounded-md w-full">
                <label className="p-2 border-4 border-dashed border-accent/25 rounded-md h-full w-full flex flex-col items-center justify-center cursor-pointer">
                    <input
                        type="file"
                        accept=".csv"
                        onChange={handleFileChange}
                        className="hidden"
                        value=""
                    />
                    { !file && <h2 className="font-semibold text-center">Upload new <span className="text-accent">Ad data</span> CSV</h2>}
                    {
                        file && <div className="flex items-center w-full gap-2">
                            <p className="text-wrap overflow-hidden shrink">{file?.name}</p>
                            <XCircleIcon onClick={cancelUpload} className="w-8 h-8 text-gray-600 cursor-pointer hover:text-blue-600" />
                            <button
                                onClick={handleAnalyze}
                                disabled={!file}
                                className={"px-4 py-2 rounded-md text-white bg-accent hover:bg-blue-600"}
                            >
                                Analyze
                            </button>
                        </div>
                    }
                </label>
            </div>
        )
    }

    return (
        <div className="bg-gray-100 p-8 rounded-md h-full w-full">
            {!file && <label className="mb-4 p-2 border-4 border-dashed border-accent/25 rounded-md h-full w-full flex flex-col items-center justify-center cursor-pointer">
                <input
                    type="file"
                    accept=".csv"
                    onChange={handleFileChange}
                    className="hidden"
                    value=""
                />
                <Image
                    className=""
                    src="/csv.png"
                    alt="csv logo"
                    width={60}
                    height={60}
                    priority
                />
                <h2 className="text-lg font-semibold mt-2 m-4 text-center">Drag & Drop your <span className="text-accent">Ad data</span> here as CSV</h2>
                <p className="text-sm text-gray-600 mt-2">or <span className="text-accent underline font-semibold">browse files</span> on your computer</p>
            </label>}
            {file && (
                <div className="p-2 border-4 border-dashed border-accent/25 rounded-md h-full w-full flex flex-col items-center justify-center">
                    <CheckBadgeIcon className="w-16 h-16 text-accent" />
                    <h2 className="text-3xl font-semibold text-gray-800">Ready!</h2>
                    <div className="flex items-center gap-2 w-full p-2">
                        <p className="text-wrap overflow-hidden">{file.name}</p>
                        <XCircleIcon onClick={cancelUpload} className="w-6 h-6 text-gray-600 cursor-pointer hover:text-blue-600" />
                    </div>
                    <button
                        onClick={handleAnalyze}
                        disabled={!file}
                        className={"mt-16 px-4 py-2 rounded-md text-white bg-accent hover:bg-blue-600"}
                    >
                        Analyze
                    </button>
                </div>
            )}
        </div>
    );
};

export default FileUpload;