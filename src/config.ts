import { configSchema } from "@/schemas";



const configProject = configSchema.safeParse(process.env)

if (!configProject.success){
    console.error(configProject.error.issues);
    throw new Error("Some enviroment invalid.")
}

/**
 * Store all env in .env file
 */
const envConfig = configProject.data


export default envConfig