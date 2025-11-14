import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../api/api";

async function createPod(payload) {
  const { data } = await api.post("/pods", payload); // 쿠키로 인증
  return data;
}

export function useCreatePod() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: createPod,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["pods"] });
    },
  });
}
