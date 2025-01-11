import axios, {AxiosResponse} from "axios"

class ApiService {
    private BasePath: string = "/api/v1";

    private baseApi = axios.create({
        baseURL: this.BasePath
    })

    public get<Response>(url: string, token: string | null = null):Promise<AxiosResponse<Response>> {
        if (token != null) return this.baseApi.get(url, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        return this.baseApi.get(url)
    }

    public post<Request, Response>(url: string, data: Request, token: string | null = null):Promise<AxiosResponse<Response>> {
        if (token != null) return this.baseApi.post(url, data, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        return this.baseApi.post(url, data)
    }

    public put<Request, Response>(url: string, data: Request, token: string | null = null):Promise<AxiosResponse<Response>> {
        if (token != null) return this.baseApi.put(url, data, {
            headers: {
                 Authorization: `Bearer ${token}`
            }
        })
        return this.baseApi.put(url, data)
    }

    public delete<Response>(url: string, token: string | null = null):Promise<AxiosResponse<Response>> {
        if (token != null) return this.baseApi.delete(url, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        return this.baseApi.delete(url)
    }

    public form<Request extends object, Response>(url: string, data: Request): Promise<AxiosResponse<Response>> {
        const formData = new FormData()

        for(const key of Object.keys(data) as (keyof Request)[]) {
            const value = data[key]
            if (value !== undefined && value !== null) {
                formData.append(key.toString(), value as string | Blob)
            }
        }

        return this.baseApi.post(url, formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            }
        })
    }
}

const apiService = new ApiService();
export { apiService };