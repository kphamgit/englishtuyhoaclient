import { useState, useEffect } from "react";
import axios, { AxiosRequestConfig, AxiosError } from "axios";
import { useRootUrl } from "../contexts/root_url";

//axios.defaults.baseURL = "http://localhost:8080/api";

//const useAxios = <T>({ url, method = 'get', data, config }: UseAxiosOptions<T>): UseAxiosResult<T> => {
interface DataResponse<T> {
  data: T | null; 
  loading: boolean; 
  error: AxiosError | null
}
  
export const useAxiosFetch = <T>(props: {url: string, method: string, body? : {} }): DataResponse<T> => {

  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<AxiosError | null>(null);
   
  const { rootUrl } = useRootUrl();


  useEffect(() => {
    const config: AxiosRequestConfig = {
      url: props.url,
      method: props.method, // or 'POST', 'PUT', 'DELETE', etc.
      baseURL: rootUrl + '/api',
      data: props.body
    };
    const fetchData = async (): Promise<void> => {
      try {
          const response = await axios(config)
          //console.log("in useAxios fetch response data", response.data)
          setData(response.data)
        } catch (err) {
          if (axios.isAxiosError(err)) {
            setError(err);
          } else {
            setError(new AxiosError('An error occurred', undefined, undefined, undefined, undefined));
          }
        } finally {
          setLoading(false);
        }
    }
    fetchData();
  }, [props.method, props.url, props.body, rootUrl]);

  //return { data, error, loading } as const;
  return { data: data, loading, error };
};

