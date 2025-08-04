import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';

interface UseAPIOptions {
  immediate?: boolean;
  onSuccess?: (data: any) => void;
  onError?: (error: Error) => void;
}

export function useAPI<T = any>(
  apiFunction: () => Promise<any>,
  options: UseAPIOptions = {}
) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const { immediate = true, onSuccess, onError } = options;

  const execute = async (...args: any[]) => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('🔄 API call executing...', apiFunction.name);
      const result = await apiFunction(...args);
      const responseData = result.data || result;
      
      console.log('✅ API call successful:', responseData);
      setData(responseData);
      
      if (onSuccess) {
        onSuccess(responseData);
      }
      
      return responseData;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('An error occurred');
      console.error('❌ API call failed:', error);
      setError(error);
      
      if (onError) {
        onError(error);
      } else {
        toast.error(error.message);
      }
      
      throw error;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (immediate) {
      console.log('🚀 Auto-executing API call on mount');
      execute();
    }
  }, [immediate]);

  return {
    data,
    loading,
    error,
    execute,
    refetch: execute,
  };
}

export function useMutation<T = any>(
  apiFunction: (...args: any[]) => Promise<any>,
  options: UseAPIOptions = {}
) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const { onSuccess, onError } = options;

  const mutate = async (...args: any[]) => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('🔄 Mutation executing...', apiFunction.name);
      const result = await apiFunction(...args);
      const responseData = result.data || result;
      
      console.log('✅ Mutation successful:', responseData);
      if (onSuccess) {
        onSuccess(responseData);
      }
      
      return responseData;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('An error occurred');
      console.error('❌ Mutation failed:', error);
      setError(error);
      
      if (onError) {
        onError(error);
      } else {
        toast.error(error.message);
      }
      
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    mutate,
    loading,
    error,
  };
}