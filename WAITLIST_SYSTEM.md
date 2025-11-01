# Automated Waitlist System Documentation

## Overview

The waitlist system automatically promotes students when spots become available and sends email notifications with 24-hour confirmation windows.

## How It Works

### 1. **When a Student Drops a Course**

When a registered student drops a course:
1. A seat becomes available
2. The system checks for waitlisted students
3. The oldest waitlisted student (first-come-first-serve) is promoted
4. Their status changes to `PENDING_CONFIRMATION`
5. A 24-hour expiration timer is set
6. An email is sent with an acceptance link

### 2. **Email Notification**

The email contains:
- Course details
- 24-hour deadline reminder
- Direct link to accept: `/waitlist/accept/[registrationId]`
- Instructions

### 3. **Accepting the Spot**

When student clicks the link:
1. System checks if confirmation hasn't expired
2. Updates status to `REGISTERED`
3. Decrements remaining seats
4. Sends confirmation email
5. Updates dashboard in real-time

### 4. **Expired Confirmations**

A cron job runs every hour:
1. Finds all `PENDING_CONFIRMATION` registrations that expired
2. Deletes the expired registration
3. Promotes the next person on waitlist (if any)
4. Sends email to the next person
5. If no waitlist, returns the seat to the course

## API Endpoints

### Accept Waitlist Spot
```
POST /api/waitlist/accept/[registrationId]
```
- No authentication required (link-based)
- Validates expiration time
- Confirms enrollment

### Expire Waitlist (Cron Job)
```
POST /api/waitlist/expire
Headers: Authorization: Bearer [CRON_SECRET]
```
- Should be called by a cron service
- Runs every hour
- Processes expired confirmations

## Environment Variables

Add these to your `.env` file:

```env
# Email Configuration
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_USER="your-email@gmail.com"
SMTP_PASS="your-app-password"
SMTP_FROM="ElectiveHub <noreply@electivehub.com>"

# Base URL for email links
NEXT_PUBLIC_BASE_URL="http://localhost:3000"  # Change to your domain in production

# Cron Secret (for security)
CRON_SECRET="your-secret-key-here"
```

## Email Setup

### Gmail Setup
1. Go to Google Account Settings
2. Enable 2-Factor Authentication
3. Generate an App Password
4. Use the app password in `SMTP_PASS`

### SendGrid Setup
```env
SMTP_HOST="smtp.sendgrid.net"
SMTP_PORT="587"
SMTP_USER="apikey"
SMTP_PASS="your-sendgrid-api-key"
```

### Resend Setup
Use Resend's SMTP credentials from their dashboard.

## Cron Job Setup

### Option 1: Vercel Cron (Recommended for Vercel deployments)

The `vercel.json` file is already configured. Vercel will automatically run:
- Path: `/api/waitlist/expire`
- Schedule: Every hour (`0 * * * *`)

Make sure to set `CRON_SECRET` in Vercel environment variables.

### Option 2: External Cron Service

Use services like:
- **cron-job.org**: Free cron service
- **EasyCron**: Cron scheduling service
- **Railway Cron**: If deploying on Railway

Configure to hit: `https://your-domain.com/api/waitlist/expire`
With header: `Authorization: Bearer [CRON_SECRET]`
Schedule: Every hour

### Option 3: Manual Testing

For development, you can manually call:
```bash
curl -X POST http://localhost:3000/api/waitlist/expire \
  -H "Authorization: Bearer your-cron-secret"
```

## Testing the Waitlist System

### Test Scenario 1: Basic Promotion
1. Create a course with 1 seat
2. Student A registers (fills the course)
3. Student B tries to register → joins waitlist
4. Student A drops the course
5. Check email for Student B → should receive promotion email
6. Student B clicks link → enrolled successfully

### Test Scenario 2: Expiration
1. Follow steps 1-4 from Scenario 1
2. Don't accept the promotion
3. Wait 24 hours (or manually set `confirmation_expires_at` to past date)
4. Call `/api/waitlist/expire`
5. Student B's registration should be deleted
6. Next person on waitlist should be promoted (or seat returned if no waitlist)

### Test Scenario 3: Multiple Waitlist
1. Course with 1 seat, 3 students on waitlist
2. Student A drops → Student B promoted
3. Student B doesn't accept → expires → Student C promoted
4. Student C accepts → enrolled
5. Student D remains on waitlist

## Dashboard Features

### Pending Confirmations Section
- Shows courses requiring action
- Displays hours remaining
- Direct "Accept Spot Now" button
- Decline option

### Waitlisted Section
- Shows courses you're waitlisted for
- Position in queue (if needed)
- Remove from waitlist option

## Security Notes

1. **Cron Secret**: Always protect `/api/waitlist/expire` with a secret
2. **Email Links**: Links contain registration IDs (UUIDs) - reasonably secure
3. **Expiration Check**: Always validates expiration time before accepting
4. **Transaction Safety**: All operations use database transactions

## Troubleshooting

### Emails Not Sending
- Check SMTP credentials in `.env`
- Verify SMTP service allows your IP
- Check spam folder
- Review server logs for email errors

### Cron Not Running
- Verify `vercel.json` configuration (for Vercel)
- Check external cron service logs
- Ensure `CRON_SECRET` is set correctly
- Test manually with curl

### Confirmations Not Expiring
- Check if cron job is running
- Verify `confirmation_expires_at` is set correctly
- Check database timezone settings

## Future Enhancements

- Email reminders at 12 hours and 6 hours before expiration
- SMS notifications (Twilio integration)
- Position in waitlist display
- Automatic retry for failed emails
- Admin dashboard for monitoring waitlists

