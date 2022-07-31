import { createRoot } from "react-dom/client";

import { App } from "./presentation/pages/app";

const container = document.getElementById("root");
const root = createRoot(container as HTMLDivElement);

root.render(<App />);

/**
 * Requirements:
 * should work with any method
 *
 */

// TestCases
// Should return error on request
// Shoud return successful result

//Todo:
// Allow to pass custom payload to request
// Allow to retry request
// Allow to programatically request, instead of
// Allow to extend reducer, (state reducer maybe?)
