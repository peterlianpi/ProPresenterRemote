import { useState, useEffect } from "react";

type FetchState<T> = {
  data: T | null;
  loading: boolean;
  error: string | null;
  fetchData: (
    method?: "GET" | "POST" | "PATCH" | "DELETE",
    body?: any,
    customUrl?: string
  ) => Promise<void>;
};

const useFetch = <T>(url: string, options: RequestInit = {}): FetchState<T> => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async (
    method: "GET" | "POST" | "PATCH" | "DELETE" = "GET",
    body?: any,
    customUrl?: string
  ) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(customUrl || url, {
        method,
        headers: { "Content-Type": "application/json", ...options.headers },
        body: body ? JSON.stringify(body) : undefined,
        ...options,
      });

      if (!response.ok)
        throw new Error(`Request failed with status ${response.status}`);

      setData(method === "GET" ? await response.json() : null);
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!options.method || options.method === "GET") fetchData();
  }, [url]);

  return { data, loading, error, fetchData };
};

export default useFetch;
