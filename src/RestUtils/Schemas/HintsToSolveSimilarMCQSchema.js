import {SchemaType} from "@google/generative-ai";

export const schema = {
    description: "Hints to solve similar MCQ Schema",
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
    }
}