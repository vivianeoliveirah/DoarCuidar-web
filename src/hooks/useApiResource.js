import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { getErrorMessage } from "../services/api";

export function useApiResource(fetcher, options = {}) {
  const {
    enabled = true,
    initialData = null,
    onSuccess,
    onError,
    select,
    deps = [],
  } = options;

  const mountedRef = useRef(false);
  const fetcherRef = useRef(fetcher);
  const initialDataRef = useRef(initialData);
  const onErrorRef = useRef(onError);
  const onSuccessRef = useRef(onSuccess);
  const selectRef = useRef(select);
  const [data, setData] = useState(initialData);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(enabled);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetcherRef.current = fetcher;
    initialDataRef.current = initialData;
    onErrorRef.current = onError;
    onSuccessRef.current = onSuccess;
    selectRef.current = select;
  });

  const load = useCallback(
    async ({ silent = false } = {}) => {
      if (!enabled) return initialDataRef.current;

      if (silent) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setError(null);

      try {
        const response = await fetcherRef.current();
        const nextData = selectRef.current ? selectRef.current(response) : response;

        if (mountedRef.current) {
          setData(nextData);
          onSuccessRef.current?.(nextData);
        }

        return nextData;
      } catch (err) {
        const message = getErrorMessage(err);

        if (mountedRef.current) {
          setError(message);
          onErrorRef.current?.(err);
        }

        return initialDataRef.current;
      } finally {
        if (mountedRef.current) {
          setLoading(false);
          setRefreshing(false);
        }
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [enabled, ...deps]
  );

  useEffect(() => {
    mountedRef.current = true;

    if (enabled) {
      load();
    }

    return () => {
      mountedRef.current = false;
    };
  }, [enabled, load]);

  return useMemo(
    () => ({
      data,
      error,
      loading,
      refreshing,
      refetch: () => load({ silent: true }),
      reload: () => load(),
    }),
    [data, error, loading, refreshing, load]
  );
}
