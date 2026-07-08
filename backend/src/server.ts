import app from "./app";

// 💡 What is this file?
// This is the entry point of our backend. It imports the configured 'app' and 
// actually starts the web server listening on a specific port.
// It's like turning on the "Open" sign at a store.

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
