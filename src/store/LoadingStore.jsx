import { create } from 'zustand';

const useLoadingStore = create((set, get) => ({
    requestCount: 0,
    isLoading: false,

    startLoading: () => {
        const currentCount = get().requestCount;
        const newCount = currentCount + 1;
        
        set({ 
            requestCount: newCount,
            isLoading: true 
        });
    },

    stopLoading: () => {
        const currentCount = get().requestCount;
        const newCount = Math.max(0, currentCount - 1);
        
        set({ 
            requestCount: newCount,
            isLoading: newCount > 0 
        });
    },

    forceStopLoading: () => {
        set({ 
            requestCount: 0,
            isLoading: false 
        });
    }
}));

export default useLoadingStore;