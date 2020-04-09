import {useCallback} from "react"

export const useMessage = () => { // - hook 
    return useCallback((text)=>{ // - return callBack 
        if (window.M && text) {
            window.M.toast({ html:text })
        }
    }, [])
}