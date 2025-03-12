import { useState } from "react";

const useLocalStorage = <T>(key: string, defaultValue: T): [T, (valueOrFn: T | ((prevState: T) => T)) => void, () => void] => {
    const [localStorageValue, setLocalStorageValue] = useState<T>(() => {
        try {
            const value = localStorage.getItem(key);
            if (value) {
                return JSON.parse(value) as T;
            } else {
                localStorage.setItem(key, JSON.stringify(defaultValue));
                return defaultValue;
            }
        } catch (error) {
            console.error("Error reading localStorage key “" + key + "”: ", error);
            localStorage.setItem(key, JSON.stringify(defaultValue));
            return defaultValue;
        }
    });

    const setLocalStorageStateValue = (valueOrFn: T | ((prevState: T) => T)) => {
        let newValue: T;
        if (typeof valueOrFn === 'function') {
            const fn = valueOrFn as (prevState: T) => T;
            newValue = fn(localStorageValue);
        } else {
            newValue = valueOrFn;
        }

        // Only update localStorage if the value has changed
        if (newValue !== localStorageValue) {
            localStorage.setItem(key, JSON.stringify(newValue));
            setLocalStorageValue(newValue);
        }
    };

    const removeLocalStorageValue = () => {
        localStorage.removeItem(key);
        setLocalStorageValue(defaultValue); // Reset state to default value
    };

    return [localStorageValue, setLocalStorageStateValue, removeLocalStorageValue];
}

export default useLocalStorage;