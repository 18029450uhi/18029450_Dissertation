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
        const genAI = new GoogleGenerativeAI("AIzaSyDzEGjWICyC373PK5lXbd6g_83B8fNACBQ");

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
