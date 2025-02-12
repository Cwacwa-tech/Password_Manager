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
/*!***************************!*\
  !*** ./src/background.ts ***!
  \***************************/

Object.defineProperty(exports, "__esModule", ({ value: true }));
const common_1 = __webpack_require__(/*! ./common */ "./src/common.ts");
// Set the badge text to "ON" when the background script starts.
(0, common_1.setBadgeText)(true);
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "generate_password") {
        // Send the request to the backend to generate a password
        fetch('http://localhost:8000/password/generate', {
            method: 'GET', // Or POST if necessary, depending on your backend setup
            headers: {
                'Content-Type': 'application/json',
            },
        })
            .then((response) => response.json()) // Assuming the backend returns a JSON response
            .then((data) => {
            if (data.password) {
                // Send the generated password to the popup
                sendResponse({ password: data.password });
            }
            else {
                sendResponse({ error: 'Failed to generate password' });
            }
        })
            .catch((error) => {
            console.error('Error generating password:', error);
            sendResponse({ error: 'Failed to contact backend' });
        });
        // Keep the response channel open until the async operation finishes
        return true;
    }
});

})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYmFja2dyb3VuZC5qcyIsIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7QUFBQSxvQ0FHQztBQUhELFNBQWdCLFlBQVksQ0FBQyxPQUFnQjtJQUN6QyxNQUFNLElBQUksR0FBRyxPQUFPLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsS0FBSztJQUNuQyxLQUFLLE1BQU0sQ0FBQyxNQUFNLENBQUMsWUFBWSxDQUFDLEVBQUMsSUFBSSxFQUFFLElBQUksRUFBQyxDQUFDO0FBQ2pELENBQUM7Ozs7Ozs7VUNIRDtVQUNBOztVQUVBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBOztVQUVBO1VBQ0E7O1VBRUE7VUFDQTtVQUNBOzs7Ozs7Ozs7Ozs7QUN0QkEsd0VBQXFDO0FBQ3JDLGdFQUFnRTtBQUNoRSx5QkFBWSxFQUFDLElBQUksQ0FBQyxDQUFDO0FBRW5CLE1BQU0sQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDLFdBQVcsQ0FBQyxDQUFDLE9BQU8sRUFBRSxNQUFNLEVBQUUsWUFBWSxFQUFFLEVBQUU7SUFDbkUsSUFBSSxPQUFPLENBQUMsTUFBTSxLQUFLLG1CQUFtQixFQUFFLENBQUM7UUFDekMseURBQXlEO1FBQ3pELEtBQUssQ0FBQyx5Q0FBeUMsRUFBRTtZQUM3QyxNQUFNLEVBQUUsS0FBSyxFQUFHLHdEQUF3RDtZQUN4RSxPQUFPLEVBQUU7Z0JBQ0wsY0FBYyxFQUFFLGtCQUFrQjthQUNyQztTQUNKLENBQUM7YUFDRyxJQUFJLENBQUMsQ0FBQyxRQUFRLEVBQUUsRUFBRSxDQUFDLFFBQVEsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFFLCtDQUErQzthQUNwRixJQUFJLENBQUMsQ0FBQyxJQUFJLEVBQUUsRUFBRTtZQUNYLElBQUksSUFBSSxDQUFDLFFBQVEsRUFBRSxDQUFDO2dCQUNoQiwyQ0FBMkM7Z0JBQzNDLFlBQVksQ0FBQyxFQUFFLFFBQVEsRUFBRSxJQUFJLENBQUMsUUFBUSxFQUFFLENBQUMsQ0FBQztZQUM5QyxDQUFDO2lCQUFNLENBQUM7Z0JBQ0osWUFBWSxDQUFDLEVBQUUsS0FBSyxFQUFFLDZCQUE2QixFQUFFLENBQUMsQ0FBQztZQUMzRCxDQUFDO1FBQ0wsQ0FBQyxDQUFDO2FBQ0QsS0FBSyxDQUFDLENBQUMsS0FBSyxFQUFFLEVBQUU7WUFDYixPQUFPLENBQUMsS0FBSyxDQUFDLDRCQUE0QixFQUFFLEtBQUssQ0FBQyxDQUFDO1lBQ25ELFlBQVksQ0FBQyxFQUFFLEtBQUssRUFBRSwyQkFBMkIsRUFBRSxDQUFDLENBQUM7UUFDekQsQ0FBQyxDQUFDLENBQUM7UUFFUCxvRUFBb0U7UUFDcEUsT0FBTyxJQUFJLENBQUM7SUFDaEIsQ0FBQztBQUNMLENBQUMsQ0FBQyxDQUFDIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vYnJvd3Nlci1leHRlbnNpb24vLi9zcmMvY29tbW9uLnRzIiwid2VicGFjazovL2Jyb3dzZXItZXh0ZW5zaW9uL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL2Jyb3dzZXItZXh0ZW5zaW9uLy4vc3JjL2JhY2tncm91bmQudHMiXSwic291cmNlc0NvbnRlbnQiOlsiZXhwb3J0IGZ1bmN0aW9uIHNldEJhZGdlVGV4dChlbmFibGVkOiBib29sZWFuKSB7XG4gICAgY29uc3QgdGV4dCA9IGVuYWJsZWQgPyBcIk9OXCIgOiBcIk9GRlwiXG4gICAgdm9pZCBjaHJvbWUuYWN0aW9uLnNldEJhZGdlVGV4dCh7dGV4dDogdGV4dH0pXG59IiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXShtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsImltcG9ydCB7c2V0QmFkZ2VUZXh0fSBmcm9tIFwiLi9jb21tb25cIlxuLy8gU2V0IHRoZSBiYWRnZSB0ZXh0IHRvIFwiT05cIiB3aGVuIHRoZSBiYWNrZ3JvdW5kIHNjcmlwdCBzdGFydHMuXG5zZXRCYWRnZVRleHQodHJ1ZSk7XG5cbmNocm9tZS5ydW50aW1lLm9uTWVzc2FnZS5hZGRMaXN0ZW5lcigobWVzc2FnZSwgc2VuZGVyLCBzZW5kUmVzcG9uc2UpID0+IHtcbiAgICBpZiAobWVzc2FnZS5hY3Rpb24gPT09IFwiZ2VuZXJhdGVfcGFzc3dvcmRcIikge1xuICAgICAgICAvLyBTZW5kIHRoZSByZXF1ZXN0IHRvIHRoZSBiYWNrZW5kIHRvIGdlbmVyYXRlIGEgcGFzc3dvcmRcbiAgICAgICAgZmV0Y2goJ2h0dHA6Ly9sb2NhbGhvc3Q6ODAwMC9wYXNzd29yZC9nZW5lcmF0ZScsIHtcbiAgICAgICAgICAgIG1ldGhvZDogJ0dFVCcsICAvLyBPciBQT1NUIGlmIG5lY2Vzc2FyeSwgZGVwZW5kaW5nIG9uIHlvdXIgYmFja2VuZCBzZXR1cFxuICAgICAgICAgICAgaGVhZGVyczoge1xuICAgICAgICAgICAgICAgICdDb250ZW50LVR5cGUnOiAnYXBwbGljYXRpb24vanNvbicsXG4gICAgICAgICAgICB9LFxuICAgICAgICB9KVxuICAgICAgICAgICAgLnRoZW4oKHJlc3BvbnNlKSA9PiByZXNwb25zZS5qc29uKCkpICAvLyBBc3N1bWluZyB0aGUgYmFja2VuZCByZXR1cm5zIGEgSlNPTiByZXNwb25zZVxuICAgICAgICAgICAgLnRoZW4oKGRhdGEpID0+IHtcbiAgICAgICAgICAgICAgICBpZiAoZGF0YS5wYXNzd29yZCkge1xuICAgICAgICAgICAgICAgICAgICAvLyBTZW5kIHRoZSBnZW5lcmF0ZWQgcGFzc3dvcmQgdG8gdGhlIHBvcHVwXG4gICAgICAgICAgICAgICAgICAgIHNlbmRSZXNwb25zZSh7IHBhc3N3b3JkOiBkYXRhLnBhc3N3b3JkIH0pO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHNlbmRSZXNwb25zZSh7IGVycm9yOiAnRmFpbGVkIHRvIGdlbmVyYXRlIHBhc3N3b3JkJyB9KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgLmNhdGNoKChlcnJvcikgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoJ0Vycm9yIGdlbmVyYXRpbmcgcGFzc3dvcmQ6JywgZXJyb3IpO1xuICAgICAgICAgICAgICAgIHNlbmRSZXNwb25zZSh7IGVycm9yOiAnRmFpbGVkIHRvIGNvbnRhY3QgYmFja2VuZCcgfSk7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAvLyBLZWVwIHRoZSByZXNwb25zZSBjaGFubmVsIG9wZW4gdW50aWwgdGhlIGFzeW5jIG9wZXJhdGlvbiBmaW5pc2hlc1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG59KTsiXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=