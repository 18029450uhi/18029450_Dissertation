import {SchemaType} from "@google/generative-ai";

export const schema = {
    description: "Image Schema",
    type: SchemaType.OBJECT,
    properties: {
        isValidFile: {
            type: SchemaType.BOOLEAN,
            description: "Indicates whether the file is a valid image or not.",
            nullable: true, // Allow null in case validation fails or isn't performed
        },
        isContainAlgebraQuestion: {
            type: SchemaType.BOOLEAN,
            description: "Indicates whether the image contains an algebra question.",
            nullable: true, // Allow null in case detection fails or isn't performed
        },
        questions: {
            type: SchemaType.ARRAY,
            items: {
                type: SchemaType.OBJECT,
                properties: {
                    question: {
                        type: SchemaType.STRING,
                        description: "Extracted question from the image",
                        nullable: false,
                    }
                },
            }
        }
    },
    required: ["isValidFile", "isContainAlgebraQuestion", "questions"]
}