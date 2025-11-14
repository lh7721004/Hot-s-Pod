import { useQuery } from "@tanstack/react-query";
import { api } from "../api/api";

const getPods = async ({ limit = 20, offset = 0 }) => {
  const res = await api.get("/pods", { params: { limit, offset } });
  return res.data;
};

export function usePods({ limit, offset }) {
  return useQuery({
    queryKey: ["pods", { limit, offset }],
    queryFn: () => getPods({ limit, offset }),
    staleTime: 10_000,
  });
}
