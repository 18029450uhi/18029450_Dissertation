import {SchemaType} from "@google/generative-ai";

export const schema = {
    description: "Verify Answer Schema",
    type: SchemaType.OBJECT,
    properties: {
        isCorrect: {
            type: SchemaType.BOOLEAN,
            description: "Verify the answer is correct or not.",
            nullable: false,
        }
    },
    required: ["isCorrect"]
}
