# Auto Tutor

## Overview
Auto Tutor is a web application designed to assist users in solving algebraic problems. It leverages AI to analyze images of algebraic questions, verify answers, and generate similar questions for practice. The application is built using React and integrates with Firebase for real-time database storage.

## Technical Overview
- *Languages*: JavaScript
- *Frameworks*: React
- *Package Manager*: npm
- *Backend Services*: Firebase Realtime Database
- *AI Integration*: Google Generative AI

## Technical Documentation

### Project Structure
- src/Components: Contains React components used in the application.
- src/RestUtils: Contains utility functions for interacting with external services.
- src/RestUtils/Schemas: Contains schema definitions for AI responses.

### Key Components
- *Question.jsx*: Handles the main functionality of displaying questions, uploading images, and fetching similar questions.
- *MathSolverUploader.jsx*: Manages the image upload process and validates the content using AI.

### Key Functions
- *getText*: Converts an image to Base64 and sends it to the AI for analysis.
- *handleUpload*: Sends a prompt to the AI and handles the response.
- *getVerifyAnswer*: Verifies the correctness of the uploaded image's content.

### Example Usage
To run the project locally:
1. Clone the repository.
2. Install dependencies using npm install.
3. Start the development server using npm start.

### Firebase Configuration
Ensure you have a Firebase project set up and replace the configuration in src/firebase-config.js with your project's credentials.

### AI Integration
The project uses Google Generative AI for analyzing images and generating questions. Ensure you have the API key set up in your environment.