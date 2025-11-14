// src/app/RequireAuth.jsx
import { Navigate, useLocation } from "react-router-dom";
import { useMe } from "../../../../queries/useMe";

export default function RequireAuth({ children }) {
  const { isLoading, isError } = useMe();
  const location = useLocation();

  if (isLoading)
    return (<div className="p-6 text-center">로그인 확인 중…</div>);
  if (isError)
    return (<Navigate to="/login" replace state={{ from: location }} />);
  return (children);
}
