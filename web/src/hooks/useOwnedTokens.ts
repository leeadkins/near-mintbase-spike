import { useEffect, useState } from "react";
import { ownedTokens } from "@mintbase-js/data";
import { Token } from "@mintbase-js/data/lib/types";

interface OwnedNftsByStoreHookResult {
  data: Token[] | undefined;
  error: string | null;
  loading: boolean;
}

export const useOwnedTokens = (
  ownerId: string,
  // contractAddress: string,
  pagination: { limit: number; offset?: number }
): OwnedNftsByStoreHookResult => {
  const [loading, setLoading] = useState<boolean>(true);
  const [res, setData] = useState<Token[] | undefined>(undefined);
  const [errorMsg, setError] = useState<string | null>(null);

  // const contract = contractAddress;

  // const validParams = contract && ownerId && pagination.limit;

  useEffect(() => {
    let isCancelled = false;

    if (loading) {
      (async (): Promise<void> => {
        const { data, error } = await ownedTokens(ownerId, pagination);

        if (error) {
          setError(error as string);
          setLoading(false);
        } else if (data) {
          setData(data);
          setLoading(false);
        }
      })();
    }

    return (): void => {
      isCancelled = true;
    };
  }, [ownerId, pagination]);

  return { data: res, loading: loading, error: errorMsg };
};
