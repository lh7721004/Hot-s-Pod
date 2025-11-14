import { useQuery } from "@tanstack/react-query";
import { api } from "../lib/axios";

const getPods = async ({ page = 1, q = "" }) => {
  const res = await api.get("/pods", { params: { page, q } });
  return res.data;
};

export function usePods({ page, q }) {
  return useQuery({
    queryKey: ["pods", { page, q }],
    queryFn: () => getPods({ page, q }),
    staleTime: 10_000,
  });
}
