import Tesseract from "tesseract.js";

export async function getTextFromTesseract(image) {
    if (image) {
        return await Tesseract.recognize(image, 'eng');
    }
}

export async function getTextFromGemini(image) {
}

