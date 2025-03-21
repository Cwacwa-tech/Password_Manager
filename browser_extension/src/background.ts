import {setBadgeText} from "./common"
// Set the badge text to "ON" when the background script starts.
setBadgeText(true);

/**
 * Retrieves authentication token from Chrome storage
 * @param {Object} options - Configuration options
 * @param {boolean} options.autoRefresh - Whether to attempt token refresh if expired (default: false)
 * @param {number} options.retryCount - Number of retries on failure (default: 0)
 * @param {number} options.retryDelay - Delay between retries in ms (default: 500)
 * @returns {Promise<string>} The authentication token
 */
/**
 * Options for the getAuthToken function
 */
interface AuthTokenOptions {
    /** Whether to attempt token refresh if expired */
    autoRefresh?: boolean;
    /** Number of retries on failure */
    retryCount?: number;
    /** Delay between retries in ms */
    retryDelay?: number;
  }
  
  /**
   * Retrieves authentication token from Chrome storage
   * @param options - Configuration options
   * @returns The authentication token
   */
  function getAuthToken(options: AuthTokenOptions = {}): Promise<string> {
    const {
      autoRefresh = false,
      retryCount = 0,
      retryDelay = 500
    } = options;
    
    let attempts = 0;
  
    const attemptGetToken = (): Promise<string> => {
      return new Promise((resolve, reject) => {
        chrome.storage.local.get(['authData'], (result) => {
          // Handle Chrome runtime errors
          if (chrome.runtime.lastError) {
            console.error('Chrome runtime error:', chrome.runtime.lastError.message);
            reject(new Error(chrome.runtime.lastError.message));
            return;
          }
  
          // Validate auth data exists and has required structure
          if (!result || typeof result !== 'object') {
            reject(new Error('Invalid storage data format'));
            return;
          }
  
          const authData = result.authData;
          
          // Check if auth data exists
          if (!authData) {
            reject(new Error('No authentication data found'));
            return;
          }
  
          // Check if token exists
          if (!authData.token || typeof authData.token !== 'string') {
            reject(new Error('No valid authentication token found'));
            return;
          }
  
          // Check if token is expired
          const isExpired = authData.expires && typeof authData.expires === 'number' && 
                            Date.now() > authData.expires;
          
          // Handle expired token
          if (isExpired) {
            if (autoRefresh && typeof authData.refreshToken === 'string') {
              // Here you would implement refresh token logic
              console.log('Token expired, attempting refresh');
              // This is a placeholder - actual refresh implementation would go here
              // refreshAuthToken(authData.refreshToken).then(resolve).catch(reject);
              reject(new Error('Token expired - refresh not implemented'));
            } else {
              reject(new Error('Authentication token has expired'));
            }
            return;
          }
  
          // Success - return valid token
          resolve(authData.token);
        });
      });
    };
  
    // Function for handling retries
    const executeWithRetry = (): Promise<string> => {
      return attemptGetToken().catch(error => {
        attempts++;
        if (attempts <= retryCount) {
          console.log(`Retry attempt ${attempts}/${retryCount} after error: ${error.message}`);
          return new Promise(resolve => setTimeout(resolve, retryDelay))
            .then(executeWithRetry);
        }
        throw error; // If all retries fail, propagate the error
      });
    };
  
    return executeWithRetry();
  }

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "generate_password") {
        // Send the request to the backend to generate a password
        fetch('http://localhost:8000/password/generate', {
            method: 'GET',  // Or POST if necessary, depending on your backend setup
            headers: {
                'Content-Type': 'application/json',
            },
        })
            .then((response) => response.json())  // Assuming the backend returns a JSON response
            .then((data) => {
                if (data.password) {
                    // Send the generated password to the popup
                    sendResponse({ password: data.password });
                } else {
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

    if (message.action === "login") {
        // Forward the login request to the Backend
        const loginData = new URLSearchParams();
        loginData.append("username", message.email);
        loginData.append("password", message.masterPassword);

        fetch('http://localhost:8000/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: loginData.toString(),
        })
        .then(response => response.json())
        .then(data => {
            if (data.access_token) {
                // Store the token in chrome storage for later use
                const expiresIn = data.expires_in || 3600; // Default to 1 hour if not provided
                chrome.storage.local.set({ 
                    authData: {
                        token: data.access_token,
                        expires: Date.now() + (expiresIn * 1000),
                        refreshToken: data.refresh_token || null
                    }
                }, () => {
                    console.log("Token stored successfully.");
                });

                sendResponse({ success: true, token: data.access_token });
            } else {
                sendResponse({ success: false, error: data.detail || "Login failed" });
            }
        })
        .catch(error => {
            console.error("Login error:", error);
            sendResponse({ success: false, error: "Failed to contact backend" });
        });

        return true; // Keep response channel open
    }
    if (message.action === 'saveCredentials') {
        // Get the credentials from the message
        const credentials = message.data;
        
        // First get the token, then use it in the fetch request
        getAuthToken()
            .then(token => {
                // Send to your backend with the token
                return fetch('http://localhost:8000/vault/passwords', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + token
                    },
                    body: JSON.stringify(credentials)
                });
            })
            .then(response => {
                // Check if response is OK before parsing JSON
                if (!response.ok && response.status !== 200) {
                    throw new Error(`Server returned ${response.status}: ${response.statusText}`);
                }
                return response.json();
            })
            .then(data => {
                // Check if the response contains a duplicate message
                if (data.message === "Password already saved!") {
                    sendResponse({ 
                        success: true, 
                        message: 'Password already saved!' 
                    });
                } else {
                    sendResponse({ 
                        success: true, 
                        message: 'Credentials saved successfully' 
                    });
                }
            })
            .catch(error => {
                console.error('Error saving credentials:', error);
                sendResponse({ 
                    success: false, 
                    message: 'Failed to save credentials' 
                });
            });
        
        // Required for async response
        return true;
    }

    if (message.action === "getCredentials") {
        const site = message.site;
        
        // Get auth token first, then fetch credentials
        getAuthToken()
          .then(token => {
            return fetch(`http://localhost:8000/vault/passwords?site=${encodeURIComponent(site)}`, {
              method: 'GET',
              headers: {
                'Authorization': `Bearer ${token}`
              }
            });
          })
          .then(response => {
            if (!response.ok) {
              throw new Error(`Server returned ${response.status}: ${response.statusText}`);
            }
            return response.json();
          })
          .then(data => {
            sendResponse({ 
              success: true, 
              credentials: data 
            });
          })
          .catch(error => {
            console.error("Error fetching credentials:", error);
            sendResponse({ 
              success: false, 
              error: error.message 
            });
          });
        
        return true; // Keep channel open for async response
      }
});