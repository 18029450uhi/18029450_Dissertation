import {SchemaType} from "@google/generative-ai";

export const schema = {
    description: "MCQ Schema",
    type: SchemaType.OBJECT,
    properties: {
        question: {
            type: SchemaType.STRING,
            description: "The question of the MCQ",
            nullable: false,
        },
        options: {
            type: SchemaType.OBJECT,
            properties: {
                A: {type: SchemaType.STRING, nullable: false},
                B: {type: SchemaType.STRING, nullable: false},
                C: {type: SchemaType.STRING, nullable: false},
                D: {type: SchemaType.STRING, nullable: false},
            },
            required: ["A", "B", "C", "D"],
        },
        correctAnswer: {
            type: SchemaType.STRING,
            description: "The correct answer key (A, B, C, or D)",
            nullable: false,
        },
    },
    required: ["question", "options", "correctAnswer"],
}
