"use client"
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import FileUpload from "./Components/FileUpload";
import Markdown from "react-markdown";
import { AnalysisResult } from "@/types";

export default function Home() {
  const { user } = useAuth();
  return (
    !!user &&
    <div className="grid grid-rows-[1px_1fr] grid-cols-3 items-center justify-items-center font-[family-name:var(--font-geist-sans)] w-full">
      <div className="row-start-2 h-full col-span-1 p-8 px-16 w-full">
        <FileUpload />
      </div>
    </div>
  );
}
