import * as dotenv from 'dotenv'
import path from 'path'

console.log('Current directory:', __dirname)
console.log('Env file path:', path.join(__dirname, '../.env.local'))

const result = dotenv.config({ path: path.join(__dirname, '../.env.local') })

console.log('Dotenv result:', result)
console.log('NEXT_PUBLIC_SUPABASE_URL:', process.env.NEXT_PUBLIC_SUPABASE_URL)
console.log('OPENAI_API_KEY exists:', !!process.env.OPENAI_API_KEY)