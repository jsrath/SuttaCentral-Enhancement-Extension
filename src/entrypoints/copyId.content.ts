// Clicking segment id copies the link to the clipboard

import showToastNotification from "./functions/showToastNotification";

export default defineContentScript({
  matches: ["*://suttacentral.net/*"],
  main() {
    // Check the setting before running the script
    chrome.storage.sync.get("clickSegmentNumbersToCopyUrl", data => {
      const isEnabled = data["clickSegmentNumbersToCopyUrl"] === "true"; // Convert to boolean

      if (!isEnabled) {
        return; // Exit if the setting is not enabled
      }

      document.addEventListener("click", event => {
        const target = event.target as HTMLElement;

        // Check if the clicked element is an `a` element within a `.reference` element
        if (target.tagName === "A" && target.closest(".reference")) {
          // Get the ID of the clicked anchor
          const anchorId = (target as HTMLAnchorElement).getAttribute("href");

          // Copy the updated URL to the clipboard after the default navigation occurs
          setTimeout(() => {
            navigator.clipboard
              .writeText(window.location.href)
              .then(() => {
                showToastNotification("URL with segment number copied to clipboard.");
              })
              .catch(err => {
                console.error("Failed to copy URL:", err);
              });
          }, 10); // Use setTimeout to wait for the default action to complete
        }
      });
    });
  },
});
