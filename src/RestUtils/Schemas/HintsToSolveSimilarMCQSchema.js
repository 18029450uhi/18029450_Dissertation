import {SchemaType} from "@google/generative-ai";

export const schema = {
    description: "Hints to solve similar MCQ Schema",
    type: SchemaType.ARRAY,
    items: {
        type: SchemaType.OBJECT,
        properties: {
            question: {
                type: SchemaType.STRING,
                description: "This the Hint to solve the similar MCQ",
                nullable: false
            },
            options: {
                type: SchemaType.OBJECT,
                properties: {
                    A: {
                        type: SchemaType.OBJECT,
                        nullable: false,
                        properties: {
                            option: {type: SchemaType.STRING, nullable: false},
                            explanation: {type: SchemaType.STRING, nullable: false}
                        },
                        required: ["option", "explanation"]
                    },
                    B: {
                        type: SchemaType.OBJECT, nullable: false,
                        properties: {
                            option: {type: SchemaType.STRING, nullable: false},
                            explanation: {type: SchemaType.STRING, nullable: false}
                        },
                        required: ["option", "explanation"]
                    },
                    C: {
                        type: SchemaType.OBJECT,
                        nullable: false,
                        properties: {
                            option: {type: SchemaType.STRING, nullable: false},
                            explanation: {type: SchemaType.STRING, nullable: false}
                        },
                        required: ["option", "explanation"]
                    },
                    D: {
                        type: SchemaType.OBJECT,
                        nullable: false,
                        properties: {
                            option: {type: SchemaType.STRING, nullable: false},
                            explanation: {type: SchemaType.STRING, nullable: false}
                        },
                        required: ["option", "explanation"]
                    },
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
}