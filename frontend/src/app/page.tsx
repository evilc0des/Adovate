"use client"
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import FileUpload from "./Components/FileUpload";
import axios from "axios";
import { Report, useReports } from "@/context/ReportContext";
import { useRouter } from "next/navigation";

export default function Home() {
  const { user } = useAuth();
  const { addReport } = useReports();
  const router = useRouter();

  const [recentReports, setRecentReports] = useState<Report[]>([]);

  useEffect(() => {
    if (!user) return;
    user.getIdToken().then((token) => {
      axios.get(`${process.env.NEXT_PUBLIC_SERVER_HOST}:${process.env.NEXT_PUBLIC_SERVER_PORT}/reports/recent`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }).then((response) => {
        const reports = response.data;
        setRecentReports(reports.map((report: { id: string, data: Omit<Report, "id">}) => {
          const newReport: Report = {
            id: report.id,
            ...report.data
          }
          addReport(newReport);
          return newReport;
        }));
      }).catch((error) => {
        console.error('Error fetching reports:', error);
      });
    });
  }, [user]);
  return (
    !!user &&
    <div className="grid grid-rows-[1px_1fr] grid-cols-3 items-center justify-items-center font-[family-name:var(--font-geist-sans)] w-full h-full">
      <div className="row-start-2 row-span-2 h-full col-span-1 p-8 px-16 w-full">
        <FileUpload />
      </div>
      <div className="row-start-2 row-span-1 col-span-1 p-8 px-16 w-full place-self-start">
        <div className="bg-background-alt h-full rounded-md row-span-1 text-white">
          <h1 className="text-2xl font-semibold p-4 border-b border-gray-600">Recent Reports</h1>
          {
            recentReports.length === 0 &&
            <h2 className="text-white text-center p-4">No reports yet!</h2>
          }
          {
            recentReports.map((report) => (
              <div key={report.id} className="p-4 border-b border-gray-600 flex justify-between cursor-pointer hover:bg-gray-600" onClick={() => router.push(`/reports/${report.id}`)}>
                <div className="w-1/2">
                  <h2 className="text-sm">{report.id}</h2>
                  <h3 className="text-white font-light text-xs">{report.filePath?.split("/").pop()}</h3>
                </div>
                <h3 className="text-yellow-200 font-light uppercase text-xs">{new Date(report.analysisTimestamp?._seconds * 1000).toDateString()}</h3>
              </div>
            ))
          }

        </div>
      </div>
    </div>
  );
}
