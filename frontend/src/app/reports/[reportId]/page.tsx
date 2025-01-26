"use client"
import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/context/AuthContext";
import FileUpload from "@/app/Components/FileUpload";
import Markdown from "react-markdown";
import { AnalysisResult } from "@/types";
import axios from "axios";
import * as d3 from "d3";
import * as Plot from "@observablehq/plot";
import { Report, useReports } from "@/context/ReportContext";
import { getDownloadURL, ref } from "firebase/storage";
import { storage } from "@/lib/firebase";

interface ReportProps {
    params: Promise<{ reportId: string }>;
}

export default function Home({ params }: ReportProps) {
    const { user } = useAuth();
    const chartRef = useRef<HTMLDivElement>(null);
    const [analysisResult, setAnalysisResult] = useState<AnalysisResult>({ summary: '', highPerformingKeywords: [], lowPerformingKeywords: [], suggestions: '' });
    const [reportId, setReportId] = useState<string | null>(null);
    const [report, setReport] = useState<Report | null>(null);
    const [selectedKeyword, setSelectedKeyword] = useState<string | null>(null);
    const [adData, setAdData] = useState<any>();

    const { reports, addReport } = useReports();

    useEffect(() => {
        params.then(({ reportId }) => {
            setReportId(reportId);
        });
    }, [params]);

    useEffect(() => {
        if (reportId) {
            const report = reports.find(({ id }) => id === reportId);

            if (report) {
                setReport(report);
                setAnalysisResult(report.analysisResult);
            } else {
                axios.get(`http://${process.env.NEXT_PUBLIC_SERVER_HOST}:${process.env.NEXT_PUBLIC_SERVER_PORT}/reports/${reportId}`).then(({ data }) => {
                    addReport(data);
                    setReport(data);
                    setAnalysisResult(data?.analysisResult);
                }).catch((error) => {
                    console.error('Error fetching analysis result:', error);
                });
            }
        }
    }, [reportId]);

    useEffect(() => {
        if (report?.filepath) {
            getDownloadURL(ref(storage, decodeURIComponent(report.filepath))).then((url) => {
                d3.csv(url, d3.autoType).then((data) => {
                    setAdData(data);
                }).catch((error) => {
                    console.error('Error fetching file:', error);
                });
            }).catch((error) => {
                console.error('Error fetching download URL:', error);
            });
        }
    }, [report?.filepath]);

    useEffect(() => {
        if (adData === undefined) return;

        console.log(adData);

        // Scatter Plot with CPC on one axis and ACOS on the other
        const plot = Plot.plot({
            marks: [
              Plot.dot(adData, { x: "CPC(USD)", y: "ACOS", fill: "Matched product " }),
              Plot.ruleX([0]),
              Plot.ruleY([0]),
              Plot.text(adData, { x: "CPC(USD)", y: "ACOS", text: "Matched product " })
            ],
            x: { label: "CPC" },
            y: { label: "ACOS" },
            color: { legend: false }
          });
        if (chartRef.current) {
            chartRef.current.append(plot);
        }
        return () => plot.remove();
      }, [adData]);


    return (
        !!user && !!report &&
        <div className="grid grid-rows-[40px] grid-cols-3 items-center justify-items-center min-h-screen font-[family-name:var(--font-geist-sans)] w-full">
            <div className="row-start-2 row-span-2 h-full col-span-1 p-8 px-16 w-full">
                <div className="bg-background-alt p-8 rounded-md mb-4">
                    <h3 className="text-yellow-200 font-light uppercase text-xs">{new Date(report.analysisTimestamp).toDateString()}</h3>
                    <h2 className="text-2xl font-semibold text-white">Report #: {reportId}</h2>
                    <h3 className="break-words text-white font-light text-sm">{report.filepath.split("/").pop()}</h3>
                </div>
                <FileUpload isWidget setAnalysisResult={setAnalysisResult} />
                <div className="" ref={chartRef} />
            </div>
            {
                !!analysisResult.summary &&
                <div className="row-start-2 h-full col-start-2 col-span-1 p-8 px-16 w-full">
                    <div className="bg-blue-100 p-8 rounded-md h-full w-full">
                        <h2 className="text-2xl font-semibold text-gray-800">Analysis Summary</h2>
                        <p>{analysisResult.summary}</p>
                    </div>
                </div>
            }
            {
                !!analysisResult.highPerformingKeywords.length &&
                <div className="h-full row-start-2 col-start-3 col-span-1 p-8 px-16 w-full">
                    <div className="bg-background-alt text-white rounded-md h-full w-full overflow-hidden">
                        <h2 className="text-2xl font-semibold text-white p-8 py-4 border-b border-gray-500">High Performing Keywords</h2>
                        <ul>
                            {analysisResult.highPerformingKeywords.map(({ keyword, performance, impressions, clicks, conversions }, index) => (
                                <li className="px-8 py-4 border-b border-gray-600 hover:bg-gray-700 cursor-pointer"
                                    onClick={() => selectedKeyword === keyword ? setSelectedKeyword(null) : setSelectedKeyword(keyword)}
                                    key={index}>
                                    {keyword}
                                    {selectedKeyword === keyword &&
                                        <div className="bg-gray-700 text-white p-2 rounded-md">
                                            <div className="flex justify-between gap-2 mb-2">
                                                <div className="border border-gray-500 p-4 text-center w-1/3 rounded-md">
                                                    <p className="text-xs font-light uppercase">Impressions</p>
                                                    <p className=" font-semibold text-xl text-yellow-200">{impressions}</p>
                                                </div>
                                                <div className="border border-gray-500 p-4 text-center w-1/3 rounded-md">
                                                    <p className="text-xs font-light uppercase">Clicks</p>
                                                    <p className=" font-semibold text-xl text-yellow-200">{clicks}</p>
                                                </div>
                                                <div className="border border-gray-500 p-4 text-center w-1/3 rounded-md">
                                                    <p className="text-xs font-light uppercase">Conversions</p>
                                                    <p className=" font-semibold text-xl text-yellow-200">{conversions}</p>
                                                </div>
                                            </div>
                                            <p className="text-sm font-light">{performance}</p>
                                        </div>
                                    }
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            }
            {
                !!analysisResult.lowPerformingKeywords.length &&
                <div className="h-full row-start-3 col-start-3 col-span-1 p-8 px-16 w-full">
                    <div className="bg-background-alt text-white rounded-md h-full w-full overflow-hidden">
                        <h2 className="text-2xl font-semibold text-white p-8 py-4 border-b border-gray-500">Low Performing Keywords</h2>
                        <ul>
                            {analysisResult.lowPerformingKeywords.map(({ keyword, performance, impressions, clicks, conversions }, index) => (
                                <li className="px-8 py-4 border-b border-gray-600 hover:bg-gray-700 cursor-pointer"
                                    onClick={() => selectedKeyword === keyword ? setSelectedKeyword(null) : setSelectedKeyword(keyword)}
                                    key={index}>
                                    {keyword}
                                    {selectedKeyword === keyword &&
                                        <div className="bg-gray-700 text-white p-2 rounded-md">
                                            <div className="flex justify-between gap-2 mb-2">
                                                <div className="border border-gray-500 p-4 text-center w-1/3 rounded-md">
                                                    <p className="text-xs font-light uppercase">Impressions</p>
                                                    <p className=" font-semibold text-xl text-yellow-200">{impressions}</p>
                                                </div>
                                                <div className="border border-gray-500 p-4 text-center w-1/3 rounded-md">
                                                    <p className="text-xs font-light uppercase">Clicks</p>
                                                    <p className=" font-semibold text-xl text-yellow-200">{clicks}</p>
                                                </div>
                                                <div className="border border-gray-500 p-4 text-center w-1/3 rounded-md">
                                                    <p className="text-xs font-light uppercase">Conversions</p>
                                                    <p className=" font-semibold text-xl text-yellow-200">{conversions}</p>
                                                </div>
                                            </div>
                                            <p className="text-sm font-light">{performance}</p>
                                        </div>
                                    }
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            }
            {
                !!analysisResult.suggestions &&
                <div className="h-full row-start-3 col-start-2 col-span-1 p-8 px-16 w-full">
                    <div className="bg-gray-100 p-8 rounded-md h-full w-full">
                        <h2 className="text-2xl font-semibold text-gray-800">Suggestions</h2>
                        <Markdown>{analysisResult.suggestions}</Markdown>
                    </div>
                </div>
            }
        </div>
    );
}
