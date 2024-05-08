import { configSchema } from "@/schemas";

const configProject = configSchema.safeParse({
    AUTH_SECRET: process.env.AUTH_SECRET,
    VITE_API_BASE_URL: process.env.VITE_API_BASE_URL,
    VITE_API_ELASTIC: process.env.VITE_API_ELASTIC
})

if (!configProject.success){    
    console.error(configProject.error.issues);
    throw new Error("Some enviroment invalid.")
}
console.log("SUccess");

/**
 * Store all env in .env file
 */
const envConfig = configProject.data


export default envConfig