export type AnalysisResult = {
    summary: string;
    highPerformingKeywords: {
        keyword: string;
        performance: string;
        impressions: number;
        clicks: number;
        cost: number;
        conversions: number;
        revenue: number;
        acos: number;
        roas: number;
    }[],
    lowPerformingKeywords: {
        keyword: string;
        performance: string;
        impressions: number;
        clicks: number;
        cost: number;
        conversions: number;
        revenue: number;
        acos: number;
        roas: number;
    }[],
    suggestions: string;
}