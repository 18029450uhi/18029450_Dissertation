import React, {useState} from 'react';
import {handleUpload} from '../../RestUtils/GetFromGemini'
import {getTextFromTesseract} from "../../RestUtils/GetTextFromImage";
import {schema} from "../../RestUtils/Schemas/MCQSchema";

const UploadImage = ({onUpload}) => {
    const [image, setImage] = useState(null);

    const handleImageChange = (e) => {
        setImage(e.target.files[0]);
    };

    const getResponse = async () => {
        if (image) {
            try {
                const text = (await getTextFromTesseract(image)).data.text;
                const prompt = `You are a helpful math tutor. Guide the user through the solution step by step. Generate MCQs for the user based on the this ${text} question?`;
                const result = await handleUpload(prompt, schema);
                onUpload(result.response.text);
            } catch (error) {
                console.error('Error:', error);
            }
        }
    };

    return (
        <div>
            <input type="file" accept="image/*" onChange={handleImageChange}/>
            <button onClick={getResponse}>Upload</button>
        </div>
    );
};

export default UploadImage;