import {GoogleGenerativeAI} from "@google/generative-ai";


export async function handleUpload(prompt, schema) {
    try {
        const genAI = new GoogleGenerativeAI("AIzaSyDzEGjWICyC373PK5lXbd6g_83B8fNACBQ");

        const model = genAI.getGenerativeModel({
            model: "gemini-1.5-pro",
            generationConfig: {
                responseMimeType: "application/json",
                responseSchema: schema,
            },
        });

        return await model.generateContent(prompt);

    } catch (error) {
        console.error('Error:', error);
    }
}

export async function getText(imageFile, prompt, schema) {
    try {
        const base64Image = await convertToBase64(imageFile);

        const genAI = new GoogleGenerativeAI("AIzaSyDzEGjWICyC373PK5lXbd6g_83B8fNACBQ");
        const model = genAI.getGenerativeModel({
            model: "gemini-1.5-pro",
            generationConfig: {
                responseMimeType: "application/json",
                responseSchema: schema,
            },
        });

        const result = await model.generateContent([
            prompt,
            {
                inlineData: {
                    data: base64Image,
                    mimeType: imageFile.type,
                },
            },
        ]);

        return result.response.text();

    } catch (error) {
        console.error('Error:', error);
    }
}
export async function getVerifyAnswer(imageFile, prompt, schema) {
    try {
        const base64Image = await convertToBase64(imageFile);

        const genAI = new GoogleGenerativeAI("AIzaSyDzEGjWICyC373PK5lXbd6g_83B8fNACBQ");
        const model = genAI.getGenerativeModel({
            model: "gemini-1.5-pro",
            generationConfig: {
                responseMimeType: "application/json",
                responseSchema: schema,
            },
        });

        const result = await model.generateContent([
            prompt,
            {
                inlineData: {
                    data: base64Image,
                    mimeType: imageFile.type,
                },
            },
        ]);

        return result.response.text();

    } catch (error) {
        console.error('Error:', error);
    }
}

function convertToBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result.split(',')[1]);
        reader.onerror = error => reject(error);
    });
}