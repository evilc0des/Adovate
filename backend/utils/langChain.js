const { ChatOpenAI } = require('@langchain/openai');
const { SystemMessage, HumanMessage } = require('@langchain/core/messages');
const { ChatPromptTemplate } = require('@langchain/core/prompts');
const { z } = require('zod');
const openai = new ChatOpenAI({ apiKey: "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", model: "gpt-4o-mini" });

const adAnalysisSchema = z.object({
  summary: z.optional(z.string()).describe('A concise summary of the performance of the ad data considering factors like ROAS, ACOS, CTR, click to purchase rate, etc. and suggestions for improvement.'),
  highPerformingKeywords: z.array(z.object({ 
    keyword: z.optional(z.string()).describe('The keyword that is performing well.'), 
    performance: z.optional(z.string()).describe('Insights and suggestions for the high performing keyword') })
  ).describe('Keywords that are performing well and contributing to the success of the ad campaign.'),
  lowPerformingKeywords: z.array(z.object({ 
    keyword: z.optional(z.string()).describe('The keyword that is performing poorly.'), 
    performance: z.optional(z.string()).describe('Insights and suggestions for the low performing keyword') })
  ).describe('Keywords that are performing poorly and need improvement.'),
  suggestions: z.optional(z.string()).describe('General suggestions for improving the overall performance of the ad campaign.'),
});

const promptTemplate = ChatPromptTemplate.fromMessages([
  [
    "system",
    `You are an expert extraction and analysis algorithm. Analyze the following ad data and provide a concise summary of the 
      performance. Focus on high-performing and low-performing keywords with suggestions for improvement. If you do not know the value of an 
      attribute asked to extract, return null for the attribute's value`,
  ],
  ["human", "{adData}"],
]);

const structured_llm = openai.withStructuredOutput(adAnalysisSchema);

// Analyze ad data
exports.analyzeAdData = async (adData) => {
  const prompt = await promptTemplate.invoke({
    adData,
  });
  try {
    const response = await structured_llm.invoke(prompt);
    return response;
  } catch (error) {
    console.error('Error during analysis:', error);
    throw new Error('Error during analysis');
  }
};