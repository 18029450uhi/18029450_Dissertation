import React, {useState, useEffect, useCallback} from "react";
import {ref, set, push} from "firebase/database";
import "./Question.css";
import SimilarQuestion from "../SimilarQuestion/SimilarQuestion";
import ResultModal from "../Modal/ResultModal";
import {handleUpload, getVerifyAnswer} from "../../RestUtils/GetFromGemini";
import {schema as similarMCQSchema} from "../../RestUtils/Schemas/SimilarMCQSchema";
import {schema as verifyAnswerSchema} from "../../RestUtils/Schemas/VarifyAnswerSchema";
import {db} from "../../firebase-config";

const Question = ({data, user}) => {
    const mcq = JSON.parse(data);
    const [similarMCQ, setSimilarMCQ] = useState(null);
    const [showSimilarQuestionModal, setShowSimilarQuestionModal] = useState(false);
    const [similarButtonEnabled, setSimilarButtonEnabled] = useState(false);
    const [showResultModal, setShowResultModal] = useState(false);
    const [resultMessage, setResultMessage] = useState("");

    const fetchSimilarMCQ = useCallback(async () => {
        try {
            const prompt = `Given the following algebra MCQ: ${mcq.question} Generate 4 new, unique algebra MCQs that are conceptually similar but numerically different. Each MCQ should have the same structure and difficulty level as the original. Ensure each new MCQ has one correct answer and three incorrect options.
      *Constraints:*
          * The generated MCQs must be mathematically correct and solvable.
          * The incorrect options should be plausible distractors, not obviously wrong.
          * The level of difficulty should be consistent with the original MCQ.`;
            const result = await handleUpload(prompt, similarMCQSchema);
            setSimilarMCQ(result.response.text);
            setSimilarButtonEnabled(true);


        } catch (error) {
            console.error("Error fetching similar MCQ:", error);
        }
    }, [mcq.question]);

    useEffect(() => {
        const localData = getLocalStorage();
        if (localData[mcq.question] !== undefined) {
            setSimilarMCQ(localData[mcq.question]);
            setSimilarButtonEnabled(true);
        } else {
            setSimilarButtonEnabled(false);
            setShowSimilarQuestionModal(false);
            fetchSimilarMCQ();
        }
    }, [fetchSimilarMCQ, mcq.question]);

    useEffect(() => {
        if (similarMCQ) {
            const similarQuestion = JSON.parse(localStorage.getItem("similarQuestion")) || {};
            similarQuestion[mcq.question] = similarMCQ;
            localStorage.setItem("similarQuestion", JSON.stringify(similarQuestion));
        }
    }, [similarMCQ, mcq.question]);

    const getLocalStorage = () => {
        try {
            return JSON.parse(localStorage.getItem("similarQuestion")) || {};
        } catch (error) {
            console.error("Error reading from localStorage:", error);
            return {};
        }
    };

    const postToRealtimeDatabase = async (isCorrect) => {
        const subject = {
            question: mcq.question,
            isCorrect: isCorrect,
            email: user.email,
        };

        try {
            const questionRef = ref(db, `questions/${user.uid}`);
            const newQuestionRef = push(questionRef);
            await set(newQuestionRef, subject);
            console.log("Successfully posted to Realtime Database:", subject);
        } catch (error) {
            console.error("Error posting to Realtime Database:", error);
        }
    };

    const handleImageUpload = async (event) => {
        const file = event.target.files[0];
        if (file) {
            try {
                const prompt = "Analyze the provided image or document encoded in Base64 format. Perform the following tasks step-by-step:\n" +
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
                    "        If no algebraic content is detected, respond with: 'No algebraic problems, equations, or mathematical expressions found in the input. Please upload a relevant question";
                const result = await getVerifyAnswer(file, prompt, verifyAnswerSchema);
                const isCorrect = JSON.parse(result).isCorrect;
                setResultMessage(isCorrect ? "Congratulations! You have done it." : "You got it wrong.");
                setShowResultModal(true);
                await postToRealtimeDatabase(isCorrect);
            } catch (error) {
                console.error("Error verifying answer:", error);
            }
        }
    };

    return (
        <div className="container">
            <div className="question-section">
                <h1>Auto Tutor</h1>
                <hr/>
                <div className="content">
                    <h2 className="question-header">{mcq.question}</h2>
                    <div className="content-button">
                        <button
                            className="similar-question-button"
                            onClick={() => setShowSimilarQuestionModal(!showSimilarQuestionModal)}
                            disabled={!similarButtonEnabled}
                        >
                            Similar Question
                        </button>
                        <input className="upload-answer" type="file" accept="image/*" onChange={handleImageUpload}/>
                    </div>
                </div>
            </div>
            {similarMCQ && (
                <div className={`similar-question-section ${showSimilarQuestionModal ? "show" : ""}`}>
                    <SimilarQuestion q={similarMCQ}/>
                </div>
            )}
            <ResultModal
                show={showResultModal}
                message={resultMessage}
                onClose={() => setShowResultModal(false)}
            />
        </div>
    );
};

export default Question;
