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
                const text = JSON.parse(await getText(image, "Analyze the provided image or document encoded in Base64 format. Perform the following tasks step-by-step:\n" +
                    "\n" +
                    "    Blank or Unreadable Check:\n" +
                    "        Verify if the input is blank, blurry, or unreadable.\n" +
                    "        Respond with: 'The document appears blank, blurry, or unreadable. Please upload a clearer image or document.'\n" +
                    "\n" +
                    "    Content Type Classification:\n" +
                    "        Identify whether the input contains non-mathematical data, such as tables, Excel sheets, or unrelated text.\n" +
                    "        Respond with: 'This document contains non-mathematical content (e.g., tables or text) and cannot be processed for algebraic problem-solving.'\n" +
                    "\n" +
                    "    Geometric and Diagram Detection:\n" +
                    "        Check if the input contains geometric diagrams or shapes instead of algebraic equations.\n" +
                    "        Respond with: 'This image appears to contain geometric data or diagrams. Algebraic processing is not supported for such inputs.'\n" +
                    "\n" +
                    "    Algebraic Equation Detection:\n" +
                    "        Determine if the input includes algebraic problems, equations, expressions, or formulas relevant to Nat 5, GCSE, or higher-level mathematics.\n" +
                    "        Extract and output the identified question or mathematical content clearly.\n" +
                    "\n" +
                    "    Complexity Evaluation:\n" +
                    "        If detected equations exceed GCSE-level complexity, respond with: 'The detected content may require higher-level mathematics processing. Proceeding with interpretation.'\n" +
                    "\n" +
                    "    Error Handling:\n" +
                    "        If no algebraic content is detected, respond with: 'No algebraic problems, equations, or mathematical expressions found in the input. Please upload a relevant question", imageSchema))

                if (!text.isValidFile) {
                    alert("The uploaded file is not valid. Please upload a valid image.");
                    return;
                }

                if (!text.isContainAlgebraQuestion) {
                    alert("The uploaded image does not contain an algebra question. Please upload a relevant image.");
                    return;
                }


                const prompt = `You are a helpful math tutor. Guide the user through the solution step by step. Generate MCQs for the user based on the this ${text.questions[0].question} question?`;
                const result = await handleUpload(prompt, schema);
                onUpload(result.response.text, text.questions);

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
        padding: "50px",
        borderRadius: "8px",
        boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
        maxWidth: "500px",
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
