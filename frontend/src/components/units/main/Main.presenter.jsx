import dayjs from "dayjs";
import Calendar from '../../common/calendar';

export default function MainUI({announcements, pods, isLoggedIn, onLogout, onOpenPodModal, onViewAllPods, onPodClick}) {
    
    // 로그인 후 화면
    if (isLoggedIn) {
        return (
            <div className="flex flex-col w-full min-h-screen bg-[#F6F7F8]">
                {/* 헤더 */}
                <div className="flex flex-row justify-between items-center p-4 bg-white shadow-sm">
                    <div className="flex flex-row gap-4 items-center">
                        <div className="w-12 h-12 bg-red-700 rounded-lg"></div>
                        <span className="font-bold text-xl">Hotspod</span>
                    </div>
                    <div className="flex flex-row gap-2">
                        <button 
                            onClick={onOpenPodModal}
                            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                        >
                            POD 생성
                        </button>
                        <button 
                            onClick={onLogout}
                            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                        >
                            로그아웃
                        </button>
                    </div>
                </div>

                {/* 메인 컨텐츠 */}
                <div className="flex flex-col p-8 gap-8">
                    <div className="text-3xl font-bold text-center">
                        🎉 로그인 성공! 환영합니다! 🎉
                    </div>
                    
                    {/* 공지사항 */}
                    <div className="flex flex-col gap-4">
                        <h2 className="text-2xl font-bold">📢 공지사항</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {announcements.map((item, idx) => (
                                <div key={idx} className="bg-white p-4 rounded-lg shadow">
                                    <div className="font-bold">{item.title}</div>
                                    <div className="text-sm text-gray-600 truncate">{item.content}</div>
                                    <div className="text-xs text-gray-400 mt-2">{item.date}</div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* POD 목록 */}
                    <div className="flex flex-col gap-4">
                        <div className="flex flex-row justify-between items-center">
                            <h2 className="text-2xl font-bold">🔥 인기 POD</h2>
                            <button 
                                onClick={onViewAllPods}
                                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                            >
                                전체 보기
                            </button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {pods.map((pod, idx) => (
                                <div 
                                    key={idx} 
                                    onClick={() => onPodClick && onPodClick(idx + 1)}
                                    className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow cursor-pointer"
                                >
                                    <div className="font-bold text-lg">{pod.title}</div>
                                    <div className="text-gray-600 mt-2">{pod.content}</div>
                                    <div className="text-sm text-gray-400 mt-4">{pod.date}</div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* 달력 추가 */}
                    <div className="flex flex-col gap-4">
                        <h2 className="text-2xl font-bold">📅 이달의 일정</h2>
                        <div className="bg-white p-6 rounded-lg shadow">
                            <Calendar />
                        </div>
                    </div>
                </div>
            </div>
        );
    }
    
    // 로그인 전 화면 (랜딩 페이지)
    return (
        <div className="flex flex-col w-full justify-center">
            <div className="flex flex-col justify-center bg-[#F6F7F8] pb-48">
                <div className="flex flex-row h-full gap-4 w-full flex-grow-0">
                    <div className="w-16 h-16 bg-red-700"></div>
                    <div className="flex flex-col justify-center">
                        <span className="h-fit font-bold text-lg">Hotspod</span>
                    </div>
                </div>
                <div className="flex flex-col gap-4 min-h-fit bg-[radial-gradient(175.4%_138.8%_at_0%_1.22%,#DA6D25_19.71%,#174C53_70.67%)] py-32">
                    <div className="flex flex-col">
                        <div className="text-3xl font-bold text-center text-[#FAFAFA]">
                            함께하고 싶은 모든 순간,
                        </div>
                        <div className="text-3xl font-bold text-center text-[#FAFAFA]">
                            Hotspod
                        </div>
                    </div>
                    <div className="flex flex-col">
                        <div className="text-base text-center text-[#FAFAFA]">
                            Hotspod은 스터디, 취미, 택시 등 다양한 오프라인
                        </div>
                        <div className="text-base text-center text-[#FAFAFA]">
                            소모임을 위한 플랫폼입니다.
                        </div>
                    </div>
                    <div className="flex flex-row justify-center">
                        <a 
                            href="http://localhost:8000/oauth/kakao/login"
                            className="flex flex-row bg-[#FEE500] rounded-2xl px-6 py-3 w-fit cursor-pointer hover:bg-[#FDD835] transition-colors no-underline items-center gap-2"
                        >
                            <span className="text-2xl">💬</span>
                            <div className="text-[#391B1B] font-bold">카카오로 3초만에 시작하기</div>
                        </a>
                    </div>
                </div>
                <div className="flex flex-col pt-16 pb-8 bg-[#F6F7F8] gap-4">
                    <div className="text-3xl font-bold text-center text-[#0A0A0A]">
                            Hotspod의 주요 기능
                    </div>
                    <div className="flex flex-col">
                        <div className="text-base text-center text-[#5E5E5E]">
                            Hotspod은 여러분의 모임을
                        </div>
                        <div className="text-base text-center text-[#5E5E5E]">
                            더욱 쉽고 즐겁게 만들어줍니다.
                        </div>
                    </div>
                </div>
                <div className="flex flex-row w-full p-4 justify-center">
                    <div className="flex flex-col w-full max-w-md">
                        <div className="bg-[#FFFFFF] flex flex-col py-8 rounded-2xl">
                            <div className="flex flex-row justify-center pb-4">
                                <div className="flex flex-row justify-center rounded-full bg-[#FFE5D4] w-20 h-20">
                                </div>
                            </div>
                            <div className="text-center font-bold">
                                간편한 모임 개설
                            </div>
                            <div className="text-center text-[#5E5E5E] text-xs">
                                원하는 모임을 누구나 쉽게 만들 수 있습니다.
                            </div>
                        </div>
                    </div>
                </div>
                <div className="flex flex-row w-full p-4 justify-center">
                    <div className="flex flex-col w-full max-w-md">
                        <div className="bg-[#FFFFFF] flex flex-col py-8 rounded-2xl">
                            <div className="flex flex-row justify-center pb-4">
                                <div className="flex flex-row justify-center rounded-full bg-[#FFE5D4] w-20 h-20">
                                </div>
                            </div>
                            <div className="text-center font-bold">
                                다양한 관심사 연결
                            </div>
                            <div className="text-center text-[#5E5E5E] text-xs">
                                스터디, 운동, 게임 등
                                다양한 카테고리의 모임에 참여해보세요.
                            </div>
                        </div>
                    </div>
                </div>
                <div className="flex flex-row w-full p-4 justify-center">
                    <div className="flex flex-col w-full max-w-md">
                        <div className="bg-[#FFFFFF] flex flex-col py-8 rounded-2xl">
                            <div className="flex flex-row justify-center pb-4">
                                <div className="flex flex-row justify-center rounded-full bg-[#FFE5D4] w-20 h-20">
                                </div>
                            </div>
                            <div className="text-center font-bold">
                                신뢰 기반 커뮤니티
                            </div>
                            <div className="text-center text-[#5E5E5E] text-xs">
                                소셜 로그인을 통해 신뢰할 수 있는 사용자 환경을 제공합니다.
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="flex flex-col"></div>
         </div>
    )
}