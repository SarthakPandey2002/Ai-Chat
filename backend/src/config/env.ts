/**
 * Environment Configuration and Validation
 * Ensures all required environment variables are present before server starts
 */

interface EnvConfig {
  GROQ_API_KEY: string;
  DATABASE_URL: string;
  PORT: number;
  NODE_ENV: string;
}

/**
 * Validates that all required environment variables are set
 * Exits process with error if any are missing
 */
export function validateEnv(): EnvConfig {
  const required = ['GROQ_API_KEY', 'DATABASE_URL'];
  const missing = required.filter(key => !process.env[key]);

  if (missing.length > 0) {
    console.error('\n❌ Missing required environment variables:');
    missing.forEach(key => console.error(`   - ${key}`));
    console.error('\n💡 Please check your .env file and ensure all required variables are set.');
    console.error('   See .env.example for reference.\n');
    process.exit(1);
  }

  console.log('✅ Environment variables validated');

  return {
    GROQ_API_KEY: process.env.GROQ_API_KEY!,
    DATABASE_URL: process.env.DATABASE_URL!,
    PORT: parseInt(process.env.PORT || '3001', 10),
    NODE_ENV: process.env.NODE_ENV || 'development'
  };
}
