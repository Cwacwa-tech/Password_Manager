const blurFilter = "blur(6px)"
let textToBlur = ""

// Search this DOM node for text to blur and blur the parent element if found.
function processNode(node: Node) {
    if (node.childNodes.length > 0) {
        Array.from(node.childNodes).forEach(processNode)
    }
    if (node.nodeType === Node.TEXT_NODE &&
        node.textContent !== null && node.textContent.trim().length > 0) {
        const parent = node.parentElement
        if (parent == null) {
            return
        }
        const parentStyle = window.getComputedStyle(parent);
        if (parent.tagName === 'SCRIPT' || parent.style.filter === blurFilter) {
            // Already blurred
            return
        }
        if (node.textContent.includes(textToBlur)) {
            blurElement(parent)
        }
    }
}

function blurElement(elem: HTMLElement) {
    elem.style.filter = blurFilter
    console.debug("blurred id:" + elem.id + " class:" + elem.className +
        " tag:" + elem.tagName + " text:" + elem.textContent)
}

// Create a MutationObserver to watch for changes to the DOM.
const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
        if (mutation.addedNodes.length > 0) {
            mutation.addedNodes.forEach(processNode)
        } else {
            processNode(mutation.target)
        }
    })
})


function observe(){
    // Only start observing the DOM if the extension is enabled and there is text to blur.
    if (textToBlur.trim().length > 0) {
        observer.observe(document, {
            attributes: false,
            characterData: true,
            childList: true,
            subtree: true,
        })
        // Loop through all elements on the page for initial processing.
        processNode(document)
    }
    else {
        observer.disconnect();
    }
}

chrome.storage.sync.get("item", (data) => {
    if (data.item) {
        textToBlur = data.item;
    }
    observe();
});

// Listen for messages from popup to update the text to blur.
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.item) {
        textToBlur = request.item;
        // Re-process the DOM with the new text to blur.
        processNode(document);
        sendResponse({ title: document.title, url: window.location.href });
    }
});
