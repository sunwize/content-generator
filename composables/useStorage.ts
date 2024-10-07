import { ref } from "vue";

const LOCAL_STORAGE_KEY = "state";

const storage = reactive<Record<string, unknown>>({});

export const loadStorage = () => {
    if (import.meta.client) {
        const storedData = localStorage.getItem(LOCAL_STORAGE_KEY) ?? "{}";

        try {
            const storedSate = JSON.parse(storedData);

            for (const [key] of Object.entries(storedSate)) {
                storage[key] = storedSate[key];
            }
        } catch { /* empty */ }
    }
};

export const saveStorage = () => {
    if (import.meta.client) {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(storage));
    }
};

export const useStorage = <T>(key: string, defaultValue: T) => {
    const data = ref<T>(defaultValue);

    storage[key] = defaultValue;

    watch(data, () => {
        if (data.value !== storage[key]) {
            storage[key] = data.value;
        }
    }, { deep: true });

    watch(storage, () => {
        if (storage[key] !== data.value) {
            data.value = storage[key] as T;
        }
    }, { deep: true });

    return data;
};

export const useStorageLoader = (callback?: () => void) => {
    onMounted(() => {
        loadStorage();
        window.addEventListener("beforeunload", saveStorage);

        watch(storage, () => {
            saveStorage();
        }, { deep: true });

        nextTick(() => {
            callback?.();
        });
    });
};