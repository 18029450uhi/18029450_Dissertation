import React, {useState} from 'react';
import {getText, handleUpload} from '../../RestUtils/GetFromGemini'
import {schema} from "../../RestUtils/Schemas/MCQSchema";
import {schema as imageSchema} from "../../RestUtils/Schemas/Image";

const UploadImage = ({onUpload}) => {
    const [image, setImage] = useState(null);

    const handleImageChange = (e) => {
        setImage(e.target.files[0]);
    };

    const getResponse = async () => {
        if (image) {
            try {
                const text = JSON.parse(await getText(image, "Extract question/math equation.",imageSchema))
                console.log(text)
                // console.log(text.response)
                // console.log(text.response.candidates)
                const prompt = `You are a helpful math tutor. Guide the user through the solution step by step. Generate MCQs for the user based on the this ${text[0].question} question?`;
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