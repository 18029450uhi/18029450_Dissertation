import {SchemaType} from "@google/generative-ai";

export const schema = {
    description: "Verify Answer Schema",
    type: SchemaType.OBJECT,
    properties: {
        isCorrect: {
            type: SchemaType.BOOLEAN,
            description: "Verify the answer is correct or not.",
            nullable: false,
        },
        isValidFile: {
            type: SchemaType.BOOLEAN,
            description: "Indicates whether the file is a valid image or not.",
            nullable: true, // Allow null in case validation fails or isn't performed
        },
        isContainAlgebraQuestion: {
            type: SchemaType.BOOLEAN,
            description: "Indicates whether the image contains an algebra question.",
            nullable: true, // Allow null in case detection fails or isn't performed
        }
    },
    required: ["isCorrect", "isValidFile", "isContainAlgebraQuestion"]
}
