/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/common.ts":
/*!***********************!*\
  !*** ./src/common.ts ***!
  \***********************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.setBadgeText = setBadgeText;
function setBadgeText(enabled) {
    const text = enabled ? "ON" : "OFF";
    void chrome.action.setBadgeText({ text: text });
}


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry needs to be wrapped in an IIFE because it needs to be isolated against other modules in the chunk.
(() => {
var exports = __webpack_exports__;
/*!**********************!*\
  !*** ./src/popup.ts ***!
  \**********************/

Object.defineProperty(exports, "__esModule", ({ value: true }));
const common_1 = __webpack_require__(/*! ./common */ "./src/common.ts");
// Set the extension to always be enabled
(0, common_1.setBadgeText)(true); // Set badge to "ON"
console.log("Hello, world from popup!");
// Handle the input field (we keep this logic)
const input = document.getElementById("item");
chrome.storage.sync.get("item", (data) => {
    input.value = data.item || "";
});
input.addEventListener("change", (event) => {
    if (event.target instanceof HTMLInputElement) {
        void chrome.storage.sync.set({ "item": event.target.value });
    }
});
// Generate password button logic
const generatePasswordButton = document.getElementById("generate-password");
const passwordDisplay = document.getElementById("password-display");
const generatedPasswordInput = document.getElementById("generated-password");
// Check if elements exist before using them
if (generatePasswordButton && passwordDisplay) {
    generatePasswordButton.addEventListener("click", () => {
        // Send message to background to generate a password
        chrome.runtime.sendMessage({ action: "generate_password" }, (response) => {
            if (response.password) {
                generatedPasswordInput.value = response.password; // Autofill the second input field
            }
            else if (response.error) {
                passwordDisplay.textContent = "Failed to generate password.";
            }
        });
    });
}
else {
    console.error("Elements not found: generatePasswordButton or passwordDisplay.");
}

})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicG9wdXAuanMiLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7O0FBQUEsb0NBR0M7QUFIRCxTQUFnQixZQUFZLENBQUMsT0FBZ0I7SUFDekMsTUFBTSxJQUFJLEdBQUcsT0FBTyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEtBQUs7SUFDbkMsS0FBSyxNQUFNLENBQUMsTUFBTSxDQUFDLFlBQVksQ0FBQyxFQUFDLElBQUksRUFBRSxJQUFJLEVBQUMsQ0FBQztBQUNqRCxDQUFDOzs7Ozs7O1VDSEQ7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTs7VUFFQTtVQUNBOztVQUVBO1VBQ0E7VUFDQTs7Ozs7Ozs7Ozs7O0FDdEJBLHdFQUFxQztBQUVyQyx5Q0FBeUM7QUFDekMseUJBQVksRUFBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLG9CQUFvQjtBQUV4QyxPQUFPLENBQUMsR0FBRyxDQUFDLDBCQUEwQixDQUFDLENBQUM7QUFFeEMsOENBQThDO0FBQzlDLE1BQU0sS0FBSyxHQUFHLFFBQVEsQ0FBQyxjQUFjLENBQUMsTUFBTSxDQUFxQixDQUFDO0FBQ2xFLE1BQU0sQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxJQUFJLEVBQUUsRUFBRTtJQUNyQyxLQUFLLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQyxJQUFJLElBQUksRUFBRSxDQUFDO0FBQ2xDLENBQUMsQ0FBQyxDQUFDO0FBRUgsS0FBSyxDQUFDLGdCQUFnQixDQUFDLFFBQVEsRUFBRSxDQUFDLEtBQUssRUFBRSxFQUFFO0lBQ3ZDLElBQUksS0FBSyxDQUFDLE1BQU0sWUFBWSxnQkFBZ0IsRUFBRSxDQUFDO1FBQzNDLEtBQUssTUFBTSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsTUFBTSxFQUFFLEtBQUssQ0FBQyxNQUFNLENBQUMsS0FBSyxFQUFFLENBQUMsQ0FBQztJQUNqRSxDQUFDO0FBQ0wsQ0FBQyxDQUFDLENBQUM7QUFFSCxpQ0FBaUM7QUFDakMsTUFBTSxzQkFBc0IsR0FBRyxRQUFRLENBQUMsY0FBYyxDQUFDLG1CQUFtQixDQUFDLENBQUM7QUFDNUUsTUFBTSxlQUFlLEdBQUcsUUFBUSxDQUFDLGNBQWMsQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDO0FBRXBFLE1BQU0sc0JBQXNCLEdBQUcsUUFBUSxDQUFDLGNBQWMsQ0FBQyxvQkFBb0IsQ0FBcUIsQ0FBQztBQUVqRyw0Q0FBNEM7QUFDNUMsSUFBSSxzQkFBc0IsSUFBSSxlQUFlLEVBQUUsQ0FBQztJQUM1QyxzQkFBc0IsQ0FBQyxnQkFBZ0IsQ0FBQyxPQUFPLEVBQUUsR0FBRyxFQUFFO1FBQ2xELG9EQUFvRDtRQUNwRCxNQUFNLENBQUMsT0FBTyxDQUFDLFdBQVcsQ0FDdEIsRUFBRSxNQUFNLEVBQUUsbUJBQW1CLEVBQUUsRUFDL0IsQ0FBQyxRQUFRLEVBQUUsRUFBRTtZQUNULElBQUksUUFBUSxDQUFDLFFBQVEsRUFBRSxDQUFDO2dCQUNwQixzQkFBc0IsQ0FBQyxLQUFLLEdBQUcsUUFBUSxDQUFDLFFBQVEsQ0FBQyxDQUFDLGtDQUFrQztZQUN4RixDQUFDO2lCQUFNLElBQUksUUFBUSxDQUFDLEtBQUssRUFBRSxDQUFDO2dCQUN4QixlQUFlLENBQUMsV0FBVyxHQUFHLDhCQUE4QixDQUFDO1lBQ2pFLENBQUM7UUFDTCxDQUFDLENBQ0osQ0FBQztJQUNOLENBQUMsQ0FBQyxDQUFDO0FBQ1AsQ0FBQztLQUFNLENBQUM7SUFDSixPQUFPLENBQUMsS0FBSyxDQUFDLGdFQUFnRSxDQUFDLENBQUM7QUFDcEYsQ0FBQyIsInNvdXJjZXMiOlsid2VicGFjazovL2Jyb3dzZXItZXh0ZW5zaW9uLy4vc3JjL2NvbW1vbi50cyIsIndlYnBhY2s6Ly9icm93c2VyLWV4dGVuc2lvbi93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly9icm93c2VyLWV4dGVuc2lvbi8uL3NyYy9wb3B1cC50cyJdLCJzb3VyY2VzQ29udGVudCI6WyJleHBvcnQgZnVuY3Rpb24gc2V0QmFkZ2VUZXh0KGVuYWJsZWQ6IGJvb2xlYW4pIHtcbiAgICBjb25zdCB0ZXh0ID0gZW5hYmxlZCA/IFwiT05cIiA6IFwiT0ZGXCJcbiAgICB2b2lkIGNocm9tZS5hY3Rpb24uc2V0QmFkZ2VUZXh0KHt0ZXh0OiB0ZXh0fSlcbn0iLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdKG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiaW1wb3J0IHtzZXRCYWRnZVRleHR9IGZyb20gXCIuL2NvbW1vblwiXG5cbi8vIFNldCB0aGUgZXh0ZW5zaW9uIHRvIGFsd2F5cyBiZSBlbmFibGVkXG5zZXRCYWRnZVRleHQodHJ1ZSk7IC8vIFNldCBiYWRnZSB0byBcIk9OXCJcblxuY29uc29sZS5sb2coXCJIZWxsbywgd29ybGQgZnJvbSBwb3B1cCFcIik7XG5cbi8vIEhhbmRsZSB0aGUgaW5wdXQgZmllbGQgKHdlIGtlZXAgdGhpcyBsb2dpYylcbmNvbnN0IGlucHV0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJpdGVtXCIpIGFzIEhUTUxJbnB1dEVsZW1lbnQ7XG5jaHJvbWUuc3RvcmFnZS5zeW5jLmdldChcIml0ZW1cIiwgKGRhdGEpID0+IHtcbiAgICBpbnB1dC52YWx1ZSA9IGRhdGEuaXRlbSB8fCBcIlwiO1xufSk7XG5cbmlucHV0LmFkZEV2ZW50TGlzdGVuZXIoXCJjaGFuZ2VcIiwgKGV2ZW50KSA9PiB7XG4gICAgaWYgKGV2ZW50LnRhcmdldCBpbnN0YW5jZW9mIEhUTUxJbnB1dEVsZW1lbnQpIHtcbiAgICAgICAgdm9pZCBjaHJvbWUuc3RvcmFnZS5zeW5jLnNldCh7IFwiaXRlbVwiOiBldmVudC50YXJnZXQudmFsdWUgfSk7XG4gICAgfVxufSk7XG5cbi8vIEdlbmVyYXRlIHBhc3N3b3JkIGJ1dHRvbiBsb2dpY1xuY29uc3QgZ2VuZXJhdGVQYXNzd29yZEJ1dHRvbiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiZ2VuZXJhdGUtcGFzc3dvcmRcIik7XG5jb25zdCBwYXNzd29yZERpc3BsYXkgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInBhc3N3b3JkLWRpc3BsYXlcIik7XG5cbmNvbnN0IGdlbmVyYXRlZFBhc3N3b3JkSW5wdXQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImdlbmVyYXRlZC1wYXNzd29yZFwiKSBhcyBIVE1MSW5wdXRFbGVtZW50O1xuXG4vLyBDaGVjayBpZiBlbGVtZW50cyBleGlzdCBiZWZvcmUgdXNpbmcgdGhlbVxuaWYgKGdlbmVyYXRlUGFzc3dvcmRCdXR0b24gJiYgcGFzc3dvcmREaXNwbGF5KSB7XG4gICAgZ2VuZXJhdGVQYXNzd29yZEJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKCkgPT4ge1xuICAgICAgICAvLyBTZW5kIG1lc3NhZ2UgdG8gYmFja2dyb3VuZCB0byBnZW5lcmF0ZSBhIHBhc3N3b3JkXG4gICAgICAgIGNocm9tZS5ydW50aW1lLnNlbmRNZXNzYWdlKFxuICAgICAgICAgICAgeyBhY3Rpb246IFwiZ2VuZXJhdGVfcGFzc3dvcmRcIiB9LFxuICAgICAgICAgICAgKHJlc3BvbnNlKSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKHJlc3BvbnNlLnBhc3N3b3JkKSB7XG4gICAgICAgICAgICAgICAgICAgIGdlbmVyYXRlZFBhc3N3b3JkSW5wdXQudmFsdWUgPSByZXNwb25zZS5wYXNzd29yZDsgLy8gQXV0b2ZpbGwgdGhlIHNlY29uZCBpbnB1dCBmaWVsZFxuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAocmVzcG9uc2UuZXJyb3IpIHtcbiAgICAgICAgICAgICAgICAgICAgcGFzc3dvcmREaXNwbGF5LnRleHRDb250ZW50ID0gXCJGYWlsZWQgdG8gZ2VuZXJhdGUgcGFzc3dvcmQuXCI7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICApO1xuICAgIH0pO1xufSBlbHNlIHtcbiAgICBjb25zb2xlLmVycm9yKFwiRWxlbWVudHMgbm90IGZvdW5kOiBnZW5lcmF0ZVBhc3N3b3JkQnV0dG9uIG9yIHBhc3N3b3JkRGlzcGxheS5cIik7XG59XG4iXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=