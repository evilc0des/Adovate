"use client"
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import FileUpload from "./Components/FileUpload";
import Markdown from "react-markdown";
import { AnalysisResult } from "@/types";

const mockAnalysisResult: AnalysisResult = {
    "summary": "The ad campaign generated a total of $89.92 in sales from 7 orders, with a Return on Ad Spend (ROAS) of 3.25 and an Average Cost of Sale (ACOS) of 30.77. The campaign had a total of 1,000 impressions and 100 clicks, resulting in a Click-Through Rate (CTR) of 10%.",
    "highPerformingKeywords": [
      {
        "keyword": "black covid mask",
        "performance": "This keyword is the highest performer with a ROAS of 12.25 and an ACOS of 8.16. It generated $12.99 in sales from 1 order, demonstrating strong conversion."
      },
      {
        "keyword": "mascarillas desechables",
        "performance": "This keyword has a high ROAS of 12.99 and an ACOS of 7.70, leading to $12.99 in sales from 1 order, indicating good keyword effectiveness."
      },
      {
        "keyword": "covid disposable face mask",
        "performance": "Generates a solid ROAS of 12.99 with an ACOS of 7.70, leading to $12.99 in sales. It shows strong conversion rate."
      },
      {
        "keyword": "covid masks",
        "performance": "This keyword shows a good performance with 3 orders and $32.97 in sales at a ROAS of 2.36 and an ACOS of 42.46."
      },
      {
        "keyword": "surgical masks disposable medical grade",
        "performance": "Effective keyword with $9.99 in sales and ROAS of 13.32, indicating a strong conversion."
      }
    ],
    "lowPerformingKeywords": [
      {
        "keyword": "masks disposable 100 pack",
        "performance": "No sales recorded and no orders despite 70 impressions, indicating this keyword may not be relevant or effective."
      },
      {
        "keyword": "covid masks for women",
        "performance": "Although it has a high CTR, it generated no sales and may need review for targeting or messaging."
      },
      {
        "keyword": "black disposable face mask",
        "performance": "Despite decent impressions and CTR, it did not generate any sales, suggesting a need for optimization or better targeting."
      },
      {
        "keyword": "covid mask",
        "performance": "Has high impressions but a high ACOS of 90.43 and low orders. May need focus on improving target audience."
      },
      {
        "keyword": "covid face masks for adults",
        "performance": "No sales generated with decent impressions and clicks, signaling a need for optimization or relevance checks."
      }
    ],
    "suggestions": "Enhance the targeting and ad copy for underperforming keywords. Consider A/B testing different ad formats or messaging to improve conversion rates. Additionally, analyze the high-performing keywords to understand the successful strategies that can be applied to other low-performing ones. Focus on optimizing bids and reviewing audience targeting to better align with potential customers."
  }

export default function Home() {
  const { user } = useAuth();
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult>(mockAnalysisResult || {summary: '', highPerformingKeywords: [], lowPerformingKeywords: [], suggestions: ''});
  return (
    !!user &&
    <div className="grid grid-rows-[20px_1fr] grid-cols-3 items-center justify-items-center min-h-screen font-[family-name:var(--font-geist-sans)] w-full">
      <div className="row-start-2 h-full col-span-1 p-8 px-16 w-full">
        <FileUpload setAnalysisResult={setAnalysisResult} />
      </div>
      {
        !!analysisResult.summary &&
        <div className="row-start-2 h-full col-start-2 col-span-1 p-8 px-16 w-full">
          <div className="bg-gray-100 p-8 rounded-md h-full w-full">
            <h2 className="text-2xl font-semibold text-gray-800">Analysis Summary</h2>
            <p>{analysisResult.summary}</p>
          </div>
        </div>
      }
      {
        !!analysisResult.highPerformingKeywords.length &&
        <div className="h-full row-start-2 col-start-3 col-span-1 p-8 px-16 w-full">
          <div className="bg-gray-100 p-8 rounded-md h-full w-full">
            <h2 className="text-2xl font-semibold text-gray-800">High Performing Keywords</h2>
            <ul>
              {analysisResult.highPerformingKeywords.map(({keyword}, index) => (
                <li key={index}>{keyword}</li>
              ))}
            </ul>
          </div>
        </div>
      }
      {
        !!analysisResult.lowPerformingKeywords.length &&
        <div className="h-full row-start-3 col-start-3 col-span-1 p-8 px-16 w-full">
          <div className="bg-gray-100 p-8 rounded-md h-full w-full">
            <h2 className="text-2xl font-semibold text-gray-800">Low Performing Keywords</h2>
            <ul>
              {analysisResult.lowPerformingKeywords.map(({keyword}, index) => (
                <li key={index}>{keyword}</li>
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
