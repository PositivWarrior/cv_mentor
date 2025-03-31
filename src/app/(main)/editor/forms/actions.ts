"use server";

import openai from "@/lib/openai";
import { GenerateSummaryInput, generateSummarySchema } from "@/lib/validation";

export async function generateSummary(input: GenerateSummaryInput) {
    // TODO: Block for non-premium users

    const { jobTitle, workExperience, education, skills } =
        generateSummarySchema.parse(input);

    const systemMessage = `
    You are a job resume generator AI. Your task is to write a professional introduction summary for a resume given the user's provided data.
    Only return the summary, nothing else. Do not include any other text, comments or any other information in your response.
    Keep it concise and professional.
    `;

    const userMessage = `
    Please generate a professional resume summary from this data:

    Job Title: ${jobTitle || "N/A"}
    Work Experience: ${workExperience
        ?.map(
            (exp) => `
        Position: 
            ${exp.position || "N/A"} at ${exp.company || "N/A"} from ${exp.startDate || "N/A"} to ${exp.endDate || "Present"}

        Description: 
            ${exp.description || "N/A"}
        `,
        )
        .join("\n\n")}

    Education: ${education
        ?.map(
            (edu) => `
        Degree: 
            ${edu.degree || "N/A"} at ${edu.school || "N/A"} from ${edu.startDate || "N/A"} to ${edu.endDate || "N/A"}
        `,
        )
        .join("\n\n")}

    Skills: ${skills}
    `;

    console.log("System Message: ", systemMessage);
    console.log("User Message: ", userMessage);

    const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
            {
                role: "system",
                content: systemMessage,
            },
            {
                role: "user",
                content: userMessage,
            },
        ],
    });

    const aiResponse = completion.choices[0].message.content;

    if (!aiResponse) {
        throw new Error("Failed to generate AI response");
    }

    return aiResponse;
}
