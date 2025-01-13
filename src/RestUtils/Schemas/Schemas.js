import {SchemaType} from "@google/generative-ai";

export const schema = {
    description: "MCQ and Problem Schema",
    type: SchemaType.ARRAY,
    items: {
        type: SchemaType.OBJECT,
        properties: {
            MCQ: {
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
            },
            similarMCQ: {
                type: SchemaType.OBJECT,
                properties: {
                    question: {
                        type: SchemaType.STRING,
                        description: "The question of the Similar MCQ",
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
            },
            hintsMCQToSolveSimilarMCQ: {
                type: SchemaType.ARRAY,
                items: {
                    type: SchemaType.OBJECT,
                    properties: {
                        question: {type: SchemaType.STRING, nullable: false},
                        options: {
                            type: SchemaType.ARRAY,
                            items: {
                                type: SchemaType.OBJECT,
                                properties: {
                                    option: {type: SchemaType.STRING, nullable: false},
                                    explanation: {type: SchemaType.STRING, nullable: false},
                                    afterApplyingTheOption: {type: SchemaType.STRING, nullable: false},
                                },
                                required: ["option", "explanation", "afterApplyingTheOption"],
                            },
                        },
                        correct: {type: SchemaType.NUMBER, nullable: false},
                    },
                    required: ["question", "options", "correct"],
                },
            },
        },
        required: ["MCQ", "similarMCQ", "hintsMCQToSolveSimilarMCQ"],
    }
};