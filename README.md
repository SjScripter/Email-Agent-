# School Outreach - Bulk Email Sender

A production-quality web application for sending personalized outreach emails to recipients uploaded via CSV or Excel. Built with Next.js 15, TypeScript, Tailwind CSS, and Resend.

## Features

- Upload CSV/XLSX/XLS files (max 100 recipients)
- Automatic column detection with manual mapping support
- Email validation, duplicate removal, and recipient selection
- Email composer with variable support (`{{name}}`, `{{school_name}}`)
- HTML email generation with promotional image support
- Email preview with recipient switching
- Test email functionality
- Bulk sending with individual personalized emails
- Password-protected access
- Progress tracking and failed recipients download
- No database - all processing in memory

## Prerequisites

- Node.js 18+ or 20+
- npm or yarn
- Resend account ([resend.com](https://resend.com))

## Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd school-outreach
```

2. Install dependencies:
```bash
npm install
```

3. Create environment variables:
```bash
cp .env.example .env.local
```

4. Configure your environment variables (see below)

5. Run the development server:
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser

## Environment Variables

Create a `.env.local` file with the following variables:

| Variable | Required | Description | Example |
|----------|----------|-------------|---------|
| `RESEND_API_KEY` | Yes | Your Resend API key | `re_xxxxxxxxx` |
| `EMAIL_FROM` | Yes | Email address to send from | `outreach@example.com` |
| `EMAIL_FROM_NAME` | Yes | Display name for sender | `Sarthak` |
| `APP_PASSWORD` | Yes | Password to access the application | `your-secure-password` |

## Resend Setup

### 1. Create a Resend Account
1. Go to [resend.com](https://resend.com) and sign up
2. Verify your email

### 2. Create an API Key
1. Go to [API Keys](https://resend.com/api-keys) in Resend dashboard
2. Click "Create API Key"
3. Give it a name (e.g., "School Outreach")
4. Select permissions (Full access or Send access)
5. Copy the API key and add to `RESEND_API_KEY` in `.env.local`

### 3. Verify a Sending Domain (Recommended for Production)
For production, you should verify your own domain:

1. Go to [Domains](https://resend.com/domains) in Resend dashboard
2. Click "Add Domain"
3. Enter your domain (e.g., `example.com`)
4. Add the DNS records shown to your domain provider (TXT, MX, CNAME)
5. Wait for verification (usually a few minutes)
6. Set `EMAIL_FROM` to use your verified domain (e.g., `outreach@yourdomain.com`)

**For testing:** You can use Resend's test domain `onboarding@resend.dev`, but you can only send to your own email address in some cases. Better to verify your domain.

### 4. Configure DNS
Add the following records as provided by Resend:
- SPF (TXT record)
- DKIM (TXT/CNAME records)
- DMARC (TXT record, optional but recommended)

## Local Setup Commands

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linting
npm run lint

# Type checking
npm run typecheck
```

## Testing with Sample CSV

A sample CSV is provided at `sample-recipients.csv`:

```csv
name,school_name,email
Rajesh Sharma,Delhi Public School,rajesh@example.com
Priya Mehta,Modern School,priya@example.com
Amit Kumar,Doon International School,amit@example.com
```

**Note:** These are dummy addresses and should never be sent to automatically. Use your own test email addresses.

## Deployment to Vercel

### 1. Push to GitHub
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin <your-github-repo-url>
git push -u origin main
```

### 2. Deploy to Vercel
1. Go to [vercel.com](https://vercel.com) and sign in
2. Click "Add New Project"
3. Import your GitHub repository
4. Configure project settings (Next.js should be auto-detected)
5. Add environment variables (see below)
6. Click "Deploy"

### 3. Add Environment Variables in Vercel
In your Vercel project settings, go to "Environment Variables" and add:

- `RESEND_API_KEY`
- `EMAIL_FROM`
- `EMAIL_FROM_NAME`
- `APP_PASSWORD`

Make sure to add them for Production, Preview, and Development environments as needed.

## Troubleshooting Common Resend Errors

| Error | Cause | Solution |
|-------|-------|----------|
| `API key is invalid` | Wrong or missing API key | Check `RESEND_API_KEY` in environment variables |
| `The from address is not verified` | Using unverified domain/email | Verify your domain in Resend or use a verified sender |
| `Rate limit exceeded` | Too many emails sent quickly | Resend has rate limits; wait and retry or upgrade plan |
| `Invalid recipient` | Malformed email address | Check recipient email addresses are valid |
| `Domain not found` | DNS not configured properly | Check DNS records in your domain provider |

## Email Sending Architecture

1. **Client-side**: User uploads CSV/XLSX, composes email, previews, confirms
2. **Server-side API routes**: All email sending goes through Next.js API routes
3. **Authentication**: Password-protected with HTTP-only session cookie
4. **Validation**: All inputs validated with Zod on server
5. **Processing**: Files parsed in browser, data sent to server for sending
6. **Resend**: Individual emails sent via Resend API (one email per recipient)
7. **No persistence**: No database, all data processed in memory

## How Recipient Personalization Works

1. Template variables `{{name}}` and `{{school_name}}` are replaced using a simple string replacement
2. Personalization is applied per recipient before sending
3. Each recipient receives a completely individualized email
4. Variables work in both subject and body
5. Missing values are replaced with empty strings

## Security Protections

- **Authentication**: Password-protected access with secure session cookie
- **API Protection**: All email sending endpoints require authentication
- **Server-side only**: Resend API key never exposed to browser
- **Input validation**: All payloads validated with Zod
- **No data persistence**: Files not saved, no recipient storage
- **Individual sends**: Recipients never see other recipients
- **Rate limiting consideration**: Controlled concurrency, max 100 recipients
- **Secure headers**: HTTP-only cookies, secure in production

## Limitations

### Resend Plan Limitations
- **Free tier**: Limited emails per month (check current Resend pricing)
- **Rate limits**: Vary by plan
- **Domain verification**: Required for production use with custom domains
- **Sending to unverified emails**: May have restrictions on free tier

### Application Limitations
- **Max 100 recipients** per send
- **No database**: Data lost on page refresh
- **No email history**: No tracking of sent emails
- **In-memory processing**: Large files not supported beyond limits
- **Simple auth**: Single password, no user management

## License

MIT
