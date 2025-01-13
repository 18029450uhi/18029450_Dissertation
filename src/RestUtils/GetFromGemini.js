import {GoogleGenerativeAI} from "@google/generative-ai";

export async function handleUpload(prompt, schema) {
    try {
        // Generate content using Google Generative AI
        // It is recommended to use the API key as an environment variable
        const genAI = new GoogleGenerativeAI("AIzaSyDmSiH_d_mjO84XEe_5WJkKbHMofGOnJkw");

        const model = genAI.getGenerativeModel({
            model: "gemini-1.5-pro",
            generationConfig: {
                responseMimeType: "application/json",
                responseSchema: schema,
            },
        });


        return await model.generateContent(
            prompt,
        );

    } catch (error) {
        console.error('Error:', error);
    }
}