import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { fetchPods } from "@/redux/slices/podSlice";

export default function PodList() {
    const dispatch = useDispatch();
    const { pods, loading } = useSelector((state) => state.pods);

    useEffect(() => {
        dispatch(fetchPods());
    }, [dispatch]);

    if (loading) return <div>Loading...</div>;

    return (
        <table className="w-full border-collapse border border-gray-300">
            <thead>
            <tr>
                <th className="border border-gray-300">No</th>
                <th className="border border-gray-300">제목</th>
                <th className="border border-gray-300">활동 인원</th>
                <th className="border border-gray-300">누적 인원</th>
                <th className="border border-gray-300">상태</th>
            </tr>
            </thead>
            <tbody>
            {pods.map((pod, index) => (
                <tr key={pod.id}>
                    <td className="border border-gray-300">{index + 1}</td>
                    <td className="border border-gray-300">{pod.title}</td>
                    <td className="border border-gray-300">{pod.activeMembers}</td>
                    <td className="border border-gray-300">{pod.totalMembers}</td>
                    <td className="border border-gray-300">{pod.status}</td>
                </tr>
            ))}
            </tbody>
        </table>
    );
}