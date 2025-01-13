import {SchemaType} from "@google/generative-ai";

export const schema = {
    description: "Image Schema",
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
        required: ["question"],
    }
}
