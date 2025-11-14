import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setUser } from "@redux/slices/userSlice";
import { useQueryClient } from "@tanstack/react-query";
import {api} from "../../src/api/api";

export default function OAuthCallback() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const qc = useQueryClient();

  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.get("/users/me");
        dispatch(setUser({ userName: data.username || data.nickname || "사용자" }));
        qc.invalidateQueries({ queryKey: ["me"] });
        navigate("/", { replace: true });
      } catch {
        navigate("/login", { replace: true });
      }
    })();
  }, [navigate, dispatch, qc]);

  return (
    <div className="w-full h-full bg-red-600">
        <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
            <div className="text-xl font-bold mb-4">로그인 처리 중...</div>
            <div className="text-gray-500">잠시만 기다려주세요.</div>
        </div>
        </div>
    </div>
  );
}
