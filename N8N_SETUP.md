# n8n Automation Setup Guide (Full Automation Version)

This is the **fully automated** version of the workflow. You no longer need to manually paste tokens or hardcode email addresses. Every time this workflow runs, it logs itself in, gets its own fresh token, fetches the report (which includes the recipient emails from the database), sends the email, and logs the result — all automatically.

---

## The Full Workflow (5 Nodes)

```
Schedule Trigger → Login → Fetch Report → Code → Gmail → Log Result
```

---

## Node 1: Schedule Trigger

1. Add a **Schedule Trigger** node.
2. Set **Trigger Interval** to `Weeks`.
3. Set the time to **Monday at 9:00 AM** (or whatever you prefer).

---

## Node 2: Login (HTTP Request)

This node logs in as the admin automatically and gets a fresh token. No more manual copy-pasting!

1. Add an **HTTP Request** node. Name it `Login`.
2. **Method**: `POST`
3. **URL**: `https://automation-production-cc6c.up.railway.app/api/auth/login`
4. **Body Content Type**: `JSON`
5. **Specify Body**: `Using JSON`
6. **Body**:
```json
{
  "email": "admin@company.com",
  "password": "password123"
}
```
7. **No authentication needed on this node** — it's the login endpoint itself.

> 💡 **What this returns:** A JSON object with `data.token` — the fresh JWT token the next nodes will use.

---

## Node 3: Fetch Report (HTTP Request)

1. Add an **HTTP Request** node. Name it `Fetch Report`.
2. **Method**: `GET`
3. **URL**: `https://automation-production-cc6c.up.railway.app/api/reports/weekly`
4. **Authentication**: `Generic Credential Type` → `Header Auth`
5. Create a **new credential**:
   - **Name**: `Authorization`
   - **Value**: (Leave blank for now — we will override it with an expression)
6. After saving, go back to the node and look for **"Send Headers"** or **"Header Parameters"** option. Switch to **"Specify Headers"** → **"Using Fields"**.
7. Add one header:
   - **Name**: `Authorization`
   - **Value**: (click the gears ⚙️ → Expression) `Bearer {{ $node['Login'].json.data.token }}`

> 💡 **What this returns:** The full weekly report, now including `data.adminEmails` — an array of all admin email addresses from your database!

---

## Node 4: Code

1. Add a **Code** node. Name it `Code`.
2. Paste in this JavaScript exactly:

```javascript
const data = $input.item.json.data;

let html = `
  <h2 style="font-family:sans-serif;">📋 Weekly Compliance Report</h2>
  <p style="font-family:sans-serif;"><strong>Period:</strong> ${new Date(data.period.start).toLocaleDateString()} to ${new Date(data.period.end).toLocaleDateString()}</p>
  <ul style="font-family:sans-serif;">
    <li>📊 Total Records: ${data.stats.total}</li>
    <li>✅ Completed: ${data.stats.completed}</li>
    <li>⏳ Pending: ${data.stats.pending}</li>
    <li style="color:red;">🚨 Overdue: ${data.stats.overdue}</li>
  </ul>
  <table border="1" cellpadding="8" cellspacing="0" style="font-family:sans-serif;border-collapse:collapse;width:100%">
    <tr style="background:#f0f0f0;">
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
      <td style="color:${color};font-weight:bold;">${r.status}</td>
      <td>${new Date(r.dueDate).toLocaleDateString()}</td>
    </tr>
  `;
});

html += `</table>`;

return {
  htmlContent: html,
  // Join all admin emails into one comma-separated string for the Gmail "To" field
  toEmails: data.adminEmails.join(', '),
  weekStart: data.period.start,
  weekEnd: data.period.end
};
```

---

## Node 5: Gmail

1. Add a **Gmail** node.
2. **Resource**: `Message`
3. **Operation**: `Send`
4. **To** field: click the gears ⚙️ → Expression → `{{ $node['Code'].json.toEmails }}`
5. **Subject**: `Weekly Compliance Report`
6. **Message**: click the gears ⚙️ → Expression → `{{ $node['Code'].json.htmlContent }}`
7. Tick the **"HTML"** toggle to `true` so the email renders as HTML.

> 💡 The `toEmails` value comes directly from your database. Register a new admin user and they are automatically on the mailing list!

---

## Node 6: Log Result (HTTP Request)

1. Add a final **HTTP Request** node. Name it `Log Result`.
2. **Method**: `POST`
3. **URL**: `https://automation-production-cc6c.up.railway.app/api/emaillogs`
4. **Specify Headers** → Add one:
   - **Name**: `Authorization`
   - **Value** (Expression): `Bearer {{ $node['Login'].json.data.token }}`
5. **Body Content Type**: `JSON`
6. **Specify Body**: `Using JSON`
7. **Body**:
```json
{
  "weekStart": "{{ $node['Code'].json.weekStart }}",
  "weekEnd": "{{ $node['Code'].json.weekEnd }}",
  "recipient": "{{ $node['Code'].json.toEmails }}",
  "subject": "Weekly Compliance Report",
  "status": "SENT"
}
```

---

## Registering Your Own Account

Hit this endpoint in **Postman** to create your personal account:

- **URL**: `https://automation-production-cc6c.up.railway.app/api/auth/register`
- **Method**: `POST`
- **Body (JSON)**:
```json
{
  "name": "Your Name",
  "email": "nielcruz035@gmail.com",
  "password": "YourChosenPassword",
  "role": "ADMIN"
}
```

Once registered, your email (`nielcruz035@gmail.com`) will automatically appear in the `adminEmails` array returned by the report. The next time the n8n workflow runs, it will send the report to your Gmail with **zero manual configuration**.

---

## Step 7: Activate!

Toggle the workflow to **Active** in the top-right corner. You're done! 🎉
