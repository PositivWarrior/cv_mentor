# CV Mentor

CV Mentor is an AI-powered resume builder that helps users create professional resumes quickly and easily. Built with Next.js, this application provides a user-friendly interface for creating, editing, and managing resumes.

## Features

-   **AI-Assisted Resume Creation**: Generate professional resume content with AI assistance
-   **Customizable Templates**: Personalize your resume with different styles and colors
-   **User Authentication**: Secure user authentication powered by Clerk
-   **Responsive Design**: Create and view resumes on any device
-   **Data Persistence**: Store resume data securely with PostgreSQL
-   **Subscription Management**: Premium features with Stripe integration

## Tech Stack

-   **Frontend**: Next.js, React, Tailwind CSS, Shadcn UI
-   **Backend**: Next.js API routes
-   **Database**: PostgreSQL with Prisma ORM
-   **Authentication**: Clerk
-   **AI Integration**: OpenAI
-   **Payment Processing**: Stripe
-   **Styling**: Tailwind CSS with class-variance-authority
-   **State Management**: Zustand
-   **Form Handling**: React Hook Form with Zod validation

## Getting Started

### Prerequisites

-   Node.js 18.x or later
-   PostgreSQL database
-   Clerk account for authentication
-   OpenAI API key
-   Stripe account for payments

### Installation

1. Clone the repository

```bash
git clone https://github.com/yourusername/cv_mentor.git
cd cv_mentor
```

2. Install dependencies

```bash
npm install
```

3. Set up environment variables
   Create a `.env` file in the root directory with the following variables:

```
DATABASE_URL=your_postgresql_connection_string
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key
OPENAI_API_KEY=your_openai_api_key
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret
```

4. Run database migrations

```bash
npx prisma migrate dev
```

5. Start the development server

```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

## Deployment

The application can be easily deployed on Vercel:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fyourusername%2Fcv_mentor)

## License

This project is licensed under the MIT License - see the LICENSE file for details.
