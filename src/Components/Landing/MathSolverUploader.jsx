import React, {useState} from "react";
import {getText, handleUpload} from '../../RestUtils/GetFromGemini'
import {schema} from "../../RestUtils/Schemas/MCQSchema";
import {schema as imageSchema} from "../../RestUtils/Schemas/QuestionSchema";

const MathSolverUploader = ({onUpload}) => {
    const [image, setImage] = useState(null);

    const handleImageChange = (e) => {
        setImage(e.target.files[0]);
    };

    const getResponse = async () => {
        if (image) {
            try {
                const text = JSON.parse(await getText(image, "Extract question/math equation.", imageSchema))
                console.log(text)
                const prompt = `You are a helpful math tutor. Guide the user through the solution step by step. Generate MCQs for the user based on the this ${text[0].question} question?`;
                const result = await handleUpload(prompt, schema);
                onUpload(result.response.text);
            } catch (error) {
                console.error('Error:', error);
            }
        }
    };

    return (
        <div style={styles.container}>
            <h2 style={styles.title}>Try Math Solver</h2>
            <div style={styles.uploadBox}>
                <label htmlFor="fileUpload" style={styles.label}>
                    <input
                        type="file"
                        id="fileUpload"
                        style={styles.fileInput}
                        onChange={handleImageChange}
                    />
                    <div style={styles.placeholderText}>
                        {image ? image.name : "Upload a math problem image"}

                    </div>
                </label>
            </div>
            {image && (
                <button style={styles.button} onClick={getResponse}>
                    Solve Math Problem
                </button>
            )}
        </div>
    );
};

// Inline styles
const styles = {
    container: {
        backgroundColor: "#f9f9f9",
        padding: "20px",
        borderRadius: "8px",
        boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
        maxWidth: "600px",
        margin: "0 auto",
        fontFamily: "Arial, sans-serif",
        textAlign: "center",
    },
    title: {
        marginBottom: "16px",
        fontSize: "24px",
        color: "#333",
    },
    uploadBox: {
        border: "2px dashed #ccc",
        borderRadius: "8px",
        padding: "16px",
        cursor: "pointer",
        position: "relative",
    },
    label: {
        display: "block",
        cursor: "pointer",
    },
    fileInput: {
        display: "none",
    },
    placeholderText: {
        color: "#888",
        fontSize: "16px",
    },

    button: {
        marginTop: "20px",
        padding: "10px 20px",
        fontSize: "16px",
        color: "#fff",
        backgroundColor: "#007bff",
        border: "none",
        borderRadius: "5px",
        cursor: "pointer",
    }
};

export default MathSolverUploader;
