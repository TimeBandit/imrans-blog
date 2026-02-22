---
title: How to call Google Apps Script Functions from a HTML Frontend
author: "Imran Nazir"
description: How to call Google Apps Script Functions from Your HTML Frontend
image:
  url: "../../assets/images/calling-functions-from-appscript.svg"
  alt: "How to call Google Apps Script Functions from Your HTML Frontend"
pubDate: 2026-02-22
tags: [tutorial, appscripts, google]
---

When building a Google Workspace Add-on, you may find the set of UI components Apps Script gives you limiting. To get around this, Google permits you to create your desired UI using HTML/CSS/JS in an index.html file. Therefore, you have your UI defined in HTML, and your logic living in Google's server-side .gs files.

The challenge? HTML files served by Google Apps Script are "sandboxed." They don't run on the same server as your script logic. To bridge this gap, Google provides a powerful asynchronous API: 

```js
google.script.run
```

Here's a guide on how to connect your index.html UI to your Apps Script backend.

## The Server-Side: Exposing a Function
First, you need a function in your Apps Script (.gs) file that you want to call. Let's imagine a backend function that handles a piece of state.

Code.gs (Server-side)

```js
function setRecordingState(isRecording) {
  // Logic to handle the recording state, perhaps logging to a Doc or Drive
  Logger.log("Recording state set to: " + isRecording);
  
  // You can return data back to the client
  return {
    status: "OK",
    timestamp: new Date().toString()
  };
}
```

**Note:** Private functions (ending with an underscore) cannot be called from the client.

## The Client-Side: google.script.run

In your index.html, you cannot simply call setRecordingState(). Instead, you use the global google.script.run object.

Inside your HTML file logic, the call looks like this: 

```js
google.script.run.setRecordingState(true);
```

## Handling Asynchronous Responses

Because the server-side execution takes time, google.script.run is asynchronous. It doesn't return the value immediately. Instead, you must chain "handlers" to process the result or catch errors.

```js
withSuccessHandler(function)
```
This runs when the server function completes successfully.

```js
withFailureHandler(function)
```
This runs if the server function throws an error.

Here's how you might implement this to update a #statusText element in your index.html:

```js
function toggleRecording() {
  const isRecording = true; // derived from your UI state

  google.script.run
    .withSuccessHandler(onSuccess)
    .withFailureHandler(onError)
    .setRecordingState(isRecording);
}

function onSuccess(response) {
  console.log("Server responded:", response);
  // Update the UI based on success
  const statusText = document.getElementById('statusText');
  statusText.textContent = "Recording Started";
  
  // Update the icon class
  const statusIcon = document.getElementById('statusIcon');
  statusIcon.classList.remove('ready');
  statusIcon.classList.add('recording');
}

function onError(error) {
  console.error("Failed to set state:", error);
  const statusText = document.getElementById('statusText');
  statusText.textContent = "Error: " + error.message;
}
```

## Real-World Example: The Toggle Button
Let's say that in your index.html, you have a button with the ID toggleButton. Here's how you would wire it up:

```js
const toggleButton = document.getElementById('toggleButton');

toggleButton.addEventListener('click', () => {
  const isCurrentlyStopped = toggleButton.classList.contains('stopped');
  const newState = isCurrentlyStopped; // If stopped, we want to start (true)
  
  // Visual feedback immediately (optimistic UI)
  document.getElementById('toggleText').textContent = newState ? "Stop Recording" : "Start Recording";

  // Call the server
  google.script.run
    .withSuccessHandler((result) => {
       // Confirm state change or update cost info
       console.log("State updated successfully");
    })
    .setRecordingState(newState);
});
```

## Summary
* Define the function in a .gs file.
* Call it using `google.script.run.myFunction()` in your HTML/JS.
* Use `.withSuccessHandler(callback)` to get data back.
* Ensure your build process inlines the JS if you are using external modules.