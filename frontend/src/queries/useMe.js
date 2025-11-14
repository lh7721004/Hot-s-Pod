import { useQuery } from "@tanstack/react-query";
import { api } from "../api/api";

async function fetchMe({ signal }) {
  const res = await api.get("/users/me", { signal });
  return res.data; // { user_id, username, ... }
}

export function useMe() {
  return useQuery({
    queryKey: ["me"],
    queryFn: fetchMe,
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    refetchOnWindowFocus: false,
    retry: false, // 401 재시도는 인터셉터가 담당
    onSuccess: (data) => {
      alert("[useMe] /users/me =>", data);
    },
  });
}
