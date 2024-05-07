import ErrorType from "@/types/error"
class BaseService {
    protected checkResponseNotOk(res: Response) {
        if (res.status < 200 || res.status >= 300) {
            return res.json().then(response => { 
                throw response as ErrorType
            })
        }
    }

    protected getResponseData<T>(res: Response) {
        return res.json() as T
    }
}

export default BaseService
