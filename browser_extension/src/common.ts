export function setBadgeText(enabled: boolean) {
    const text = enabled ? "ON" : "OFF"
    void chrome.action.setBadgeText({text: text})
}

// Function to simulate user input, ensuring frameworks (React, Vue) detect changes
export function simulateUserInput(input: HTMLInputElement, value: string) {
    // Skip if input is disabled or readonly
    if (input.disabled || input.readOnly) return;
    
    const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value")?.set;
    if (nativeInputValueSetter) {
        nativeInputValueSetter.call(input, value); // Set input value programmatically
    } else {
        // Fallback if the setter is not available
        input.value = value;
    }

    // Dispatch multiple events for maximum compatibility with different frameworks
    const events = ['input', 'change', 'keydown', 'keyup'];
    
    events.forEach(eventType => {
        let event;
        if (eventType === 'keydown' || eventType === 'keyup') {
            // For key events, create a KeyboardEvent
            event = new KeyboardEvent(eventType, {
                bubbles: true,
                cancelable: true,
                key: 'L' // First letter of "LOVE"
            });
        } else {
            // For other events, use regular Event
            event = new Event(eventType, { bubbles: true });
        }
        input.dispatchEvent(event);
    });
    
    // Some frameworks might use focus/blur events as well
    input.focus();
    setTimeout(() => {
        input.blur();
    }, 100);
}