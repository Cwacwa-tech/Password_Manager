export class ChromeStorageService {
    private storageKey = 'password_vault_data';
  
    async get<T>(key?: string): Promise<T | undefined> {
        return new Promise((resolve, reject) => {
            chrome.storage.local.get(key ? [key] : [this.storageKey], (result) => {
                if (chrome.runtime.lastError) {
                    reject(chrome.runtime.lastError);
                } else {
                    resolve(key ? result[key] : result[this.storageKey]);
                }
            });
        });
    }
  
    async set(data: any, key?: string): Promise<void> {
        return new Promise((resolve, reject) => {
            const storageData = key ? { [key]: data } : { [this.storageKey]: data };
            chrome.storage.local.set(storageData, () => {
                if (chrome.runtime.lastError) {
                    reject(chrome.runtime.lastError);
                } else {
                    resolve();
                }
            });
        });
    }
  
    async update(updateFn: (currentData: any) => any, key?: string): Promise<void> {
        const currentData = await this.get(key) || {};
        const updatedData = updateFn(currentData);
        return this.set(updatedData, key);
    }
  
    async remove(key: string): Promise<void> {
        return new Promise((resolve, reject) => {
            chrome.storage.local.remove(key, () => {
                if (chrome.runtime.lastError) {
                    reject(chrome.runtime.lastError);
                } else {
                    resolve();
                }
            });
        });
    }
  }