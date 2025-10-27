/**
 * Environment Variables Validator
 * Validates that all required environment variables are present at startup
 * Fails fast in production to prevent runtime errors
 */

interface EnvConfig {
  name: string;
  required: boolean;
  description: string;
  validate?: (value: string) => boolean;
}

const ENV_VARS: EnvConfig[] = [
  {
    name: 'VITE_SUPABASE_URL',
    required: true,
    description: 'Supabase project URL',
    validate: (value) => value.startsWith('https://') && value.includes('.supabase.co'),
  },
  {
    name: 'VITE_SUPABASE_ANON_KEY',
    required: true,
    description: 'Supabase anonymous key',
    validate: (value) => value.length > 50, // Supabase keys are long JWTs
  },
  {
    name: 'VITE_APP_URL',
    required: false,
    description: 'Application URL',
    validate: (value) => value.startsWith('http'),
  },
  {
    name: 'VITE_ENVIRONMENT',
    required: false,
    description: 'Environment name (development, production, staging)',
  },
];

interface ValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
}

/**
 * Validate environment variables
 */
export function validateEnv(): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  ENV_VARS.forEach(({ name, required, description, validate }) => {
    const value = import.meta.env[name];

    // Check if required variable is missing
    if (required && !value) {
      errors.push(
        `❌ Missing required environment variable: ${name}\n   Description: ${description}`
      );
      return;
    }

    // Check if optional variable is missing
    if (!required && !value) {
      warnings.push(
        `⚠️  Optional environment variable not set: ${name}\n   Description: ${description}`
      );
      return;
    }

    // Validate value format if validator is provided
    if (value && validate && !validate(value)) {
      errors.push(
        `❌ Invalid value for ${name}\n   Description: ${description}\n   Please check your .env file`
      );
    }
  });

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}

/**
 * Validate and fail fast if errors are found
 */
export function validateEnvOrThrow(): void {
  const result = validateEnv();

  // Log warnings
  if (result.warnings.length > 0) {
    console.warn('\n⚠️  Environment Variable Warnings:\n');
    result.warnings.forEach((warning) => console.warn(warning + '\n'));
  }

  // Throw on errors
  if (!result.valid) {
    console.error('\n🚨 Environment Variable Errors:\n');
    result.errors.forEach((error) => console.error(error + '\n'));
    console.error('\n📝 To fix this:');
    console.error('   1. Copy .env.example to .env');
    console.error('   2. Fill in the required values');
    console.error('   3. Restart the application\n');

    throw new Error('Environment validation failed - missing required variables');
  }

  // Success message in development
  if (import.meta.env.DEV) {
    console.log('✅ Environment variables validated successfully');
  }
}

/**
 * Get environment info for debugging
 */
export function getEnvInfo() {
  return {
    mode: import.meta.env.MODE,
    dev: import.meta.env.DEV,
    prod: import.meta.env.PROD,
    environment: import.meta.env.VITE_ENVIRONMENT || 'unknown',
  };
}
