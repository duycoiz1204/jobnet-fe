import { configSchema } from '@/schemas/authSchema';

const configProject = configSchema.safeParse({
  NEXT_PUBLIC_BASE_URL: process.env.NEXT_PUBLIC_BASE_URL,
  NEXT_PUBLIC_ELASTIC: process.env.NEXT_PUBLIC_ELASTIC,
  NEXT_PUBLIC_TINYMCE_KEY: process.env.NEXT_PUBLIC_TINYMCE_KEY,
});

if (!configProject.success) {
  console.error(configProject.error.issues);
  throw new Error('Some enviroment invalid.');
}
console.log('SUccess');

/**
 * Store all env in .env file
 */
const envConfig = configProject.data;

export default envConfig;
