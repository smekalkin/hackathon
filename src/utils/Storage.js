class Storage {

    /**
     * Set item to localStorage
     * @param {string} key 
     * @param {mixed} value 
     * @param {int} ttl 
     */
    setItem(key, value, ttl) {
        if (value) {
            ttl = ttl || 1000 * 60 * 60 * 24 * 30 // month

            const now = new Date()

            // `item` is an object which contains the original value
            // as well as the time when it's supposed to expire
            const item = {
                value: value,
                expiry: now.getTime() + ttl,
            }
            localStorage.setItem(key, JSON.stringify(item))
        } else {
            localStorage.removeItem(key);
        }
    }

    /**
     * Get item from localStorage
     * @param {string} key 
     * @returns 
     */
    getItem(key) {
        const itemStr = localStorage.getItem(key)
        // if the item doesn't exist, return null
        if (!itemStr) {
            return null
        }

        try {
            const item = JSON.parse(itemStr)

            const now = new Date()
            // compare the expiry time of the item with the current time
            if (now.getTime() > item.expiry) {
                // If the item is expired, delete the item from storage
                // and return null
                localStorage.removeItem(key)
                return null
            }
            return item.value
        } catch (e) {
            return null
        }
    }
}

export default new Storage();