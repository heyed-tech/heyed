# Document Processing Scripts

## Setting up documents

1. Download the official PDFs and place them in the `/documents` folder:
   - KCSiE 2024: https://www.gov.uk/government/publications/keeping-children-safe-in-education--2
   - EYFS Framework: https://www.gov.uk/government/publications/early-years-foundation-stage-framework--2
   - Save them as `kcsie-2024.pdf` and `eyfs-framework.pdf`

2. Make sure your `.env.local` file contains:
   ```
   OPENAI_API_KEY=sk-...
   NEXT_PUBLIC_SUPABASE_URL=...
   NEXT_PUBLIC_SUPABASE_ANON_KEY=...
   ```

3. Run the processing script:
   ```bash
   npx tsx scripts/process-documents.ts
   ```

This will:
- Parse the PDFs
- Split them into chunks
- Generate embeddings
- Store everything in Supabase

The process may take 5-10 minutes depending on document size.