// This file is compiled by the Figma plugin bundler.
// The actual UI HTML references the built output.
// For development, we define the UI component interface here.

// UI state:
// - userId: string
// - page: 'chat' | 'checkin'
// - messages: { content: string; role: string }[]
// - mood: number | null

export {}

// The actual UI.html is generated from this template:
// A minimal React app embedded via iframe, or plain HTML/JS.
// For simplicity, the Figma plugin uses a plain HTML UI
// that communicates via postMessage.

/*
Example UI (ui.html):
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Inter, sans-serif; background: #11111A; color: #fff; padding: 16px; }
    input, textarea, button { width: 100%; margin-bottom: 8px; padding: 8px; border-radius: 8px; background: #1A1A2A; border: 1px solid #2A2A3A; color: #fff; }
    button { background: #7C3AED; cursor: pointer; }
    .message { padding: 8px; margin: 4px 0; border-radius: 8px; }
    .user { background: #7C3AED33; text-align: right; }
    .bot { background: #1A1A2A; border-left: 3px solid #7C3AED; }
  </style>
</head>
<body>
  <div id="app"></div>
  <script>
    // Simple JS app using postMessage to Figma plugin main
  </script>
</body>
</html>
*/
