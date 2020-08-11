import dotenv from 'dotenv';
import fs from 'fs';

dotenv.config({ path: '.env' });

export const ENVIRONMENT = process.env.NODE_ENV;
const prod = ENVIRONMENT === 'production';
