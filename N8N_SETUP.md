# n8n Automation Setup Guide

As your instructor, I'm going to walk you through how to connect our new Node.js backend to your self-hosted n8n instance. 

Our goal is to create a workflow that runs every week, fetches the compliance report from our backend, formats it nicely, emails it via Gmail, and then logs the result back to our backend.

## Step 1: Create a New Workflow in n8n

1. Log into your n8n instance.
2. Click **Add Workflow** on the top right.
3. Name it "Weekly Compliance Report".

## Step 2: The Trigger (Cron Node)

We want this to run automatically every week.
1. Add a **Schedule Trigger** node.
2. Set the **Trigger Interval** to `Weeks`.
3. Set the time to something like Monday at 9:00 AM.
4. This node will start the whole process!

## Step 3: Fetch the Report (HTTP Request Node)

We need to get the data from our backend (`/api/reports/weekly`).
1. Add an **HTTP Request** node.
2. **Method**: `GET`
3. **URL**: `https://your-railway-url.app/api/reports/weekly` (Replace with your actual Railway URL once deployed, or `http://localhost:3000/api/reports/weekly` for local testing).
4. **Authentication**: 
   - We secured this endpoint with `requireAdmin`. You will need to pass an Admin's JWT token.
   - Go to "Authentication" -> "Generic Credential Type" -> "Header Auth".
   - Name: `Authorization`
   - Value: `Bearer <your_admin_jwt_token>` (You can get this by logging in via Postman).

## Step 4: Format the Data (Code Node)

The data comes back as JSON, but we want a beautiful HTML email.
1. Add a **Code** node (JavaScript).
2. Use this script to convert the JSON data into an HTML table:

```javascript
const data = $input.item.json.data;

let html = `
  <h2>Weekly Compliance Report</h2>
  <p><strong>Period:</strong> ${data.period.start} to ${data.period.end}</p>
  <ul>
    <li>Total Records: ${data.stats.total}</li>
    <li>Completed: ${data.stats.completed}</li>
    <li>Pending: ${data.stats.pending}</li>
    <li style="color:red;">Overdue: ${data.stats.overdue}</li>
  </ul>
  <table border="1" cellpadding="5" cellspacing="0">
    <tr>
      <th>Title</th>
      <th>Department</th>
      <th>Assignee</th>
      <th>Status</th>
      <th>Due Date</th>
    </tr>
`;

data.records.forEach(r => {
  const color = r.status === 'OVERDUE' ? 'red' : (r.status === 'COMPLETED' ? 'green' : 'orange');
  html += `
    <tr>
      <td>${r.title}</td>
      <td>${r.department}</td>
      <td>${r.assignee}</td>
      <td style="color:${color}">${r.status}</td>
      <td>${new Date(r.dueDate).toLocaleDateString()}</td>
    </tr>
  `;
});

html += `</table>`;

return {
  htmlContent: html,
  weekStart: data.period.start,
  weekEnd: data.period.end
};
```

## Step 5: Send the Email (Gmail Node)

1. Add the **Gmail** node.
2. **Resource**: Message
3. **Operation**: Send
4. **Credential**: You will need to create a Gmail OAuth2 credential in n8n. Follow the n8n docs to connect your Google Cloud Console to n8n.
5. **To Email**: Enter the recipient email (e.g., the manager's email).
6. **Subject**: `Weekly Compliance Report`
7. **Message**: Click the gear icon, set "Is HTML" to `true`.
8. Bind the Message field to the output of our Code node: `{{ $json.htmlContent }}`.

## Step 6: Log the Result (HTTP Request Node)

We want our backend to know if the email succeeded.
1. Add another **HTTP Request** node.
2. **Method**: `POST`
3. **URL**: `https://your-railway-url.app/api/emaillogs`
4. **Authentication**: Use the same Header Auth (Admin Token) as before.
5. **Send Body**: `true`
6. **Body Content Type**: `JSON`
7. In the Body Parameters, pass:
   - `weekStart`: `{{ $node["Code"].json.weekStart }}`
   - `weekEnd`: `{{ $node["Code"].json.weekEnd }}`
   - `recipient`: The manager's email you used.
   - `subject`: `Weekly Compliance Report`
   - `status`: `SENT` (You can also add an Error Trigger node to catch errors and log `FAILED`).

## Step 7: Activate!

Toggle the workflow to **Active** (top right corner). You're all set!
