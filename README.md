# Ask-Data  


# In this repo only the front end side you can find the backend side of askdata in my other repo

Ask-Data is a web application designed using modern technologies such as FastAPI, Next.js, Langchain (leveraging the ChatGPT API), Docker, Python, MySQL, and TailwindCSS.  

This application operates similarly to ChatGPT, allowing users to ask natural language questions related to company data, such as:  
*"What was the total revenue from marketing campaigns during the last quarter?"*  

### How It Works:  
1. The user submits a question in natural language.  
2. The LLM model converts the question into an SQL query.  
3. The SQL query retrieves data from the company's database.  
4. The retrieved data is then transformed back into human-readable language.  

This application aims to simplify the process of exploring and understanding company data efficiently, without requiring users to have knowledge of SQL or database structures.  





This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.js`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
# askdata-frontend
