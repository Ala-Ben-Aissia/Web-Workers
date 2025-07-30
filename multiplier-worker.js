// --- Advanced Concepts: Web Workers and Concurrency ---
// This worker file demonstrates how to offload expensive computation from the main thread.
// The code here runs in a separate thread, allowing true concurrency in JavaScript.
//
// Key Concepts:
// - Code in this file does NOT block the main UI thread; it runs in the background.
// - Expensive work (e.g., blocking loops) here will NOT freeze the UI.
// - If both main and worker threads block in parallel, the total delay is the maximum of the two (not the sum).
// - If blocking is sequential (main thread first, then worker), delays add up.
// - Use workers for heavy computation to keep the UI responsive and improve UX.

onmessage = (event) => {
  // --- Parallelism Demo ---
  // The following blocking loop simulates expensive work in the worker thread.
  // This does NOT affect the responsiveness of the main UI thread.
  // Try adjusting the duration or adding/removing blocking code in main.js to observe parallel vs sequential delays.
  const now = performance.now();
  while (performance.now() - now < 1000) {}

  const { type, payload } = event.data;
  // Log receipt of message from main thread
  console.log("[Worker] Received from main thread:", event.data);
  if (type === "multiply") {
    const { number1, number2 } = payload;
    // Perform the multiplication after simulated expensive work
    const workerResult = number1 * number2;
    console.log(
      `[Worker] Calculation done in worker thread: ${number1} * ${number2} = ${workerResult}`
    );
    // Send result back to main thread
    postMessage({ type: "result", payload: workerResult });
    console.log(
      `[Worker] Sent result back to main thread: { type: 'result', payload: ${workerResult} }`
    );
  }
};
