"use server";

import openai from "@/lib/openai";
import {
    GenerateSummaryInput,
    generateSummarySchema,
    GenerateWorkExperienceInput,
    generateWorkExperienceSchema,
    WorkExperience,
} from "@/lib/validation";

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

export async function generateWorkExperience(
    input: GenerateWorkExperienceInput,
) {
    // TODO: Block for non-premium users

    const { description } = generateWorkExperienceSchema.parse(input);

    const systemMessage = `
    You are a job resume generator AI. Your task is to write a single work experience entry based on the user input.

    Your response must adhere to the following structure. You can omit fields if they can't be inferred from provided data.

    Job title: <job title>
    Company: <company name>
    Start Date: <format: YYYY-MM-DD> (only if provided)
    End Date: <format: YYYY-MM-DD> (only if provided)
    Description: <an optimized description in bullet format, might be inferred from the job title>
    `;

    const userMessage = `
    Please provide a work experience entry from this description:
    ${description}
    `;

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

    console.log("aiResponse: ", aiResponse);

    return {
        position: aiResponse.match(/Job title: (.*)/)?.[1] || "",
        company: aiResponse.match(/Company: (.*)/)?.[1] || "",
        description: (
            aiResponse.match(/Description:([\s\S]*)/)?.[1] || ""
        ).trim(),
        startDate: aiResponse.match(/Start date: (\d{4}-\d{2}-\d{2})/)?.[1],
        endDate: aiResponse.match(/End date: (\d{4}-\d{2}-\d{2})/)?.[1],
    } satisfies WorkExperience;
}
