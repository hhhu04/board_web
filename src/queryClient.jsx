import {QueryClient} from "@tanstack/react-query";

const queryClient = new QueryClient( {
    defaultOptions : {
        queries : {
            staleTime : 1000 * 60 * 3,  // 3분.
            retryDelay : 1000 * 2,      // 2초
            gcTime : 1000 * 60 * 5    // 5분
        }
    }
})

export default queryClient