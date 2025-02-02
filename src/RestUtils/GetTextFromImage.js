import Tesseract from "tesseract.js";
import {GoogleGenerativeAI} from "@google/generative-ai";

export async function getTextFromTesseract(image) {
    if (image) {
        return await Tesseract.recognize(image, 'eng');
    }
}

export async function handleUpload(prompt, schema) {
    try {
        // Generate content using Google Generative AI
        // It is recommended to use the API key as an environment variable
        const genAI = new GoogleGenerativeAI("YOUR_Gemini_KEY");

        const model = genAI.getGenerativeModel({
            model: "gemini-1.5-flash",
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
