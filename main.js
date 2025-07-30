// --- Advanced Concepts: Web Workers, Concurrency, and UX ---
// This file demonstrates how to use Web Workers for parallel computation in JavaScript.
// JavaScript is single-threaded by default; heavy computation blocks the UI and degrades user experience (UX).
// Web Workers allow true concurrency: expensive work runs in a separate thread, keeping the UI responsive.
//
// Key Concepts:
// - Blocking the main thread (e.g., with a while loop) freezes the UI.
// - Blocking in the worker thread does NOT freeze the UI; computation happens in the background.
// - If both threads block in parallel, the total delay is the maximum of the two (not the sum).
// - If blocking is sequential (main thread first, then worker), delays add up.
// - Always offload expensive work to workers for best UX.

const input1 = document.getElementById("number1");
const input2 = document.getElementById("number2");
const result = document.getElementsByClassName("result")[0];

(() => {
  // Check for Web Worker support
  if (!window.Worker) {
    return console.error("Your browser doesn't support web workers");
  }
  // Create a new worker thread for multiplication
  const multiplierWorker = new Worker("multiplier-worker.js");

  // This function is called when either input changes
  function handleOnChange() {
    // Prepare a structured message for the worker
    const message = {
      type: "multiply",
      payload: {
        number1: Number(input1.value),
        number2: Number(input2.value),
      },
    };

    // --- Parallelism Demo ---
    // The following blocking loop simulates expensive work in the main thread.
    // If you also block in the worker, both delays run in parallel and the total delay is the maximum of the two.
    // If you block in the main thread BEFORE sending the message, and then block in the worker, delays are sequential and add up.
    // Try moving this loop before or after postMessage, or inside the worker, to observe different behaviors.
    multiplierWorker.postMessage(message); // Send message to worker (starts parallel computation)
    const now = performance.now();
    while (performance.now() - now < 1000) {} // Simulate blocking main thread for 1 second
    console.log(
      "[Main] Sent to worker (requesting multiplication in separate thread):",
      message
    );
  }

  // Attach change listeners to both inputs
  [input1, input2].forEach((element) => {
    element.addEventListener("change", handleOnChange);
  });

  // Handle messages from the worker
  multiplierWorker.onmessage = (event) => {
    const { type, payload } = event.data;
    // The worker thread has completed its calculation and sent the result back
    console.log(
      "[Main] Received from worker (worker has completed calculation in separate thread):",
      event.data
    );
    if (type === "result") {
      result.textContent = `Result: ${payload}`;
      console.log(`[Main] Displayed result from worker thread: ${payload}`);
    }
  };
})();
