# Google Sheets Integration Setup Guide

This guide will walk you through setting up Google Sheets integration for the FOOM One Pulse Platform.

## Prerequisites

- Google Cloud Platform account
- Google Sheets with appropriate permissions
- Next.js application with the provided integration code

## Step 1: Create Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Note your Project ID for later use

## Step 2: Enable Google Sheets API

1. In the Google Cloud Console, navigate to "APIs & Services" > "Library"
2. Search for "Google Sheets API"
3. Click on it and press "Enable"

## Step 3: Create Service Account

1. Go to "APIs & Services" > "Credentials"
2. Click "Create Credentials" > "Service Account"
3. Fill in the service account details:
   - Name: `one-pulse-sheets-service`
   - Description: `Service account for One Pulse Google Sheets integration`
4. Click "Create and Continue"
5. Skip role assignment for now (we'll handle permissions at the sheet level)
6. Click "Done"

## Step 4: Generate Service Account Key

1. In the Credentials page, find your newly created service account
2. Click on the service account email
3. Go to the "Keys" tab
4. Click "Add Key" > "Create New Key"
5. Select "JSON" format
6. Download the key file and keep it secure

## Step 5: Extract Credentials

From the downloaded JSON file, extract the following values for your `.env` file:

\`\`\`json
{
  "type": "service_account",
  "project_id": "your-project-id",
  "private_key_id": "your-private-key-id",
  "private_key": "-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n",
  "client_email": "your-service-account@your-project.iam.gserviceaccount.com",
  "client_id": "your-client-id",
  ...
}
\`\`\`

## Step 6: Set Up Environment Variables

Create a `.env.local` file in your project root:

\`\`\`env
# Google Sheets API Configuration
GOOGLE_PROJECT_ID=your-project-id
GOOGLE_PRIVATE_KEY_ID=your-private-key-id
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour-Private-Key-Here\n-----END PRIVATE KEY-----\n"
GOOGLE_CLIENT_EMAIL=your-service-account@your-project.iam.gserviceaccount.com
GOOGLE_CLIENT_ID=your-client-id

# Google Sheets IDs for each team
NEXT_PUBLIC_BRAND_CREATIVE_SHEET_ID=1234567890abcdefghijklmnopqrstuvwxyz
NEXT_PUBLIC_DIGITAL_MARKETING_SHEET_ID=abcdefghijklmnopqrstuvwxyz1234567890
\`\`\`

## Step 7: Create Google Sheets

For each team, create a Google Sheet with the following structure:

### Projects Sheet Structure
| Column A | Column B | Column C | Column D | Column E | Column F | Column G | Column H | Column I | Column J |
|----------|----------|----------|----------|----------|----------|----------|----------|----------|----------|
| ID | Task | Priority | Owner | Status | Start Date | End Date | Progress | Milestone | Notes |

### Performance Sheet Structure
| Column A | Column B | Column C | Column D | Column E | Column F | Column G | Column H | Column I | Column J | Column K |
|----------|----------|----------|----------|----------|----------|----------|----------|----------|----------|----------|
| ID | KPI | Responsible | Accountable | Consult | Inform | Shared | Shared With | Status | Today Progress | Expected Target |

### Punctuality Sheet Structure
| Column A | Column B | Column C | Column D | Column E | Column F | Column G |
|----------|----------|----------|----------|----------|----------|----------|
| Date | Member1 | Member2 | Member3 | Member4 | Member5 | Member6 |

## Step 8: Share Sheets with Service Account

1. Open each Google Sheet
2. Click "Share" button
3. Add your service account email (from step 4)
4. Give "Editor" permissions
5. Uncheck "Notify people" 
6. Click "Share"

## Step 9: Get Sheet IDs

1. Open each Google Sheet
2. Copy the Sheet ID from the URL:
   \`\`\`
   https://docs.google.com/spreadsheets/d/[SHEET_ID]/edit#gid=0
   \`\`\`
3. Add these IDs to your environment variables

## Step 10: Configure Sheet Names

In your Google Sheets, ensure you have the following sheet tabs:
- `Projects` - for project tracking data
- `Performance` - for KPI/performance data  
- `Punctuality` - for team punctuality tracking

## Step 11: Test the Integration

1. Start your Next.js application:
   \`\`\`bash
   npm run dev
   \`\`\`

2. Navigate to the Team Huddles section
3. Check the Google Sheets status indicator
4. Try refreshing data to test the connection

## Troubleshooting

### Common Issues

1. **Authentication Error**
   - Verify all environment variables are set correctly
   - Ensure the private key includes proper line breaks (`\n`)
   - Check that the service account email is correct

2. **Permission Denied**
   - Verify the service account has been shared with each Google Sheet
   - Ensure "Editor" permissions are granted
   - Check that the Google Sheets API is enabled

3. **Sheet Not Found**
   - Verify the Sheet IDs in environment variables
   - Ensure the sheet names match the configuration (Projects, Performance, Punctuality)
   - Check that the sheets are not deleted or moved

4. **Data Mapping Errors**
   - Ensure your Google Sheets have the correct column structure
   - Verify that the first row contains headers
   - Check for empty rows that might cause parsing issues

### Testing API Endpoints

You can test the integration using the API endpoints:

\`\`\`bash
# Fetch data
curl "http://localhost:3000/api/sheets/sync?team=Brand%20%26%20Creative&type=projects"

# Sync data (POST request)
curl -X POST "http://localhost:3000/api/sheets/sync" \
  -H "Content-Type: application/json" \
  -d '{"teamName":"Brand & Creative","dataType":"projects","data":[...]}'
\`\`\`

## Security Considerations

1. **Environment Variables**
   - Never commit `.env` files to version control
   - Use secure environment variable management in production
   - Rotate service account keys regularly

2. **Sheet Permissions**
   - Only grant necessary permissions to the service account
   - Regularly audit who has access to your sheets
   - Consider using separate service accounts for different environments

3. **Data Validation**
   - The integration includes built-in data validation
   - Monitor for unusual data patterns or errors
   - Implement additional validation as needed for your use case

## Production Deployment

### Vercel Deployment

1. Add environment variables in Vercel dashboard:
   - Go to your project settings
   - Navigate to "Environment Variables"
   - Add all the Google Sheets configuration variables

2. Deploy your application:
   \`\`\`bash
   vercel --prod
   \`\`\`

### Other Platforms

For other deployment platforms, ensure:
- All environment variables are properly set
- The service account JSON key is securely stored
- Network access to Google APIs is allowed

## Maintenance

### Regular Tasks

1. **Monitor API Usage**
   - Check Google Cloud Console for API usage
   - Monitor for rate limiting or quota issues

2. **Update Dependencies**
   - Keep Google APIs libraries updated
   - Test integration after updates

3. **Backup Data**
   - Regularly backup your Google Sheets
   - Consider exporting data for additional redundancy

4. **Performance Monitoring**
   - Monitor sync times and error rates
   - Optimize data structures if needed

### Scaling Considerations

- **Rate Limits**: Google Sheets API has rate limits (100 requests per 100 seconds per user)
- **Data Size**: Large datasets may require pagination or chunking
- **Concurrent Users**: Consider implementing request queuing for multiple simultaneous users
- **Caching**: Implement caching strategies to reduce API calls

## Support

If you encounter issues:

1. Check the browser console for error messages
2. Review the server logs for detailed error information
3. Verify your Google Cloud Console for API usage and errors
4. Test individual API endpoints to isolate issues

For additional help, refer to:
- [Google Sheets API Documentation](https://developers.google.com/sheets/api)
- [Google Cloud Service Accounts](https://cloud.google.com/iam/docs/service-accounts)
- [Next.js Environment Variables](https://nextjs.org/docs/basic-features/environment-variables)
