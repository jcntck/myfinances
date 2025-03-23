import React from 'react';

export function useFetch<T>() {
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<unknown | null>(null);

  const fetchData = async (path: string): Promise<T | undefined> => {
    try {
      setIsLoading(true);
      const response = await fetch(path);
      const data = await response.json();
      setIsLoading(false);
      return data;
    } catch (error) {
      console.error(error);
      setError(error);
    }
  };

  return { isLoading, error, fetchData };
}
