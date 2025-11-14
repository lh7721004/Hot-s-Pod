import Calendar from '../../common/calendar';
import SizeComponent from "../../common/icon/SizeComponent";

import LocalFireDepartmentOutlinedIcon from '@mui/icons-material/LocalFireDepartmentOutlined';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import GroupsOutlinedIcon from '@mui/icons-material/GroupsOutlined';
import PermIdentityOutlinedIcon from '@mui/icons-material/PermIdentityOutlined';
export default function MainUI({announcements, pods, onOpenPodModal, onViewAllPods, onPodClick}) {
    return (
        <div className="flex flex-col w-full min-h-screen bg-[#F6F7F8]">
            {/* 헤더 */}
            <div className="flex flex-row justify-between items-center p-4 bg-white shadow-sm">
                <div className="flex flex-row gap-4 justify-center w-full">
                    <SizeComponent Component={LocalFireDepartmentOutlinedIcon} className="text-[#FF7C1C] text-[3red]" fontSize={"3rem"} />
                    <span className="font-bold text-xl">Hotspod</span>
                </div>
                <div className="flex flex-row gap-2">
                    <button 
                        onClick={onOpenPodModal}
                        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                    >
                        POD 생성
                    </button>
                </div>
            </div>

            {/* 메인 컨텐츠 */}
            <div className="flex flex-col p-8 gap-8">
                
                <div className='flex flex-row w-full justify-center text-2xl font-bold'>함께할 즐거움을 찾아보세요!</div>
                <div className='flex flex-row w-full justify-center'>
                    <div className='flex flex-row w-full max-w-fit justify-center bg-[#FFFFFF] p-2 rounded-lg'>
                        <div className='flex flex-col justify-center p-2'>
                            <SearchOutlinedIcon/>
                        </div>
                        <input type='text' placeholder='관심사, 지역, 키워드로 검색해보세요.' className='min-w-80 p-2'/>
                    </div>
                </div>
                <div className='flex flex-row w-full overflow-x-scroll scrollbar-hide gap-2'>
                    <div className='p-2 px-4 rounded-full bg-[#FF7A5A] text-[#FFFFFF] min-w-fit'>전체</div>
                    <div className='p-2 px-4 rounded-full bg-[#FFFFFF] text-[#000000] min-w-fit'>스터디</div>
                    <div className='p-2 px-4 rounded-full bg-[#FFFFFF] text-[#000000] min-w-fit'>취미</div>
                    <div className='p-2 px-4 rounded-full bg-[#FFFFFF] text-[#000000] min-w-fit'>여가</div>
                    <div className='p-2 px-4 rounded-full bg-[#FFFFFF] text-[#000000] min-w-fit'>운동</div>
                    <div className='p-2 px-4 rounded-full bg-[#FFFFFF] text-[#000000] min-w-fit'>이것</div>
                    <div className='p-2 px-4 rounded-full bg-[#FFFFFF] text-[#000000] min-w-fit'>저것</div>
                    <div className='p-2 px-4 rounded-full bg-[#FFFFFF] text-[#000000] min-w-fit'>등등</div>
                    <div className='p-2 px-4 rounded-full bg-[#FFFFFF] text-[#000000] min-w-fit'>등등</div>
                    <div className='p-2 px-4 rounded-full bg-[#FFFFFF] text-[#000000] min-w-fit'>등등</div>
                    <div className='p-2 px-4 rounded-full bg-[#FFFFFF] text-[#000000] min-w-fit'>등등</div>
                    <div className='p-2 px-4 rounded-full bg-[#FFFFFF] text-[#000000] min-w-fit'>등등</div>
                    <div className='p-2 px-4 rounded-full bg-[#FFFFFF] text-[#000000] min-w-fit'>등등</div>
                    <div className='p-2 px-4 rounded-full bg-[#FFFFFF] text-[#000000] min-w-fit'>등등</div>
                    <div className='p-2 px-4 rounded-full bg-[#FFFFFF] text-[#000000] min-w-fit'>등등</div>
                    <div className='p-2 px-4 rounded-full bg-[#FFFFFF] text-[#000000] min-w-fit'>등등</div>
                    <div className='p-2 px-4 rounded-full bg-[#FFFFFF] text-[#000000] min-w-fit'>등등</div>
                    <div className='p-2 px-4 rounded-full bg-[#FFFFFF] text-[#000000] min-w-fit'>등등</div>
                    <div className='p-2 px-4 rounded-full bg-[#FFFFFF] text-[#000000] min-w-fit'>등등</div>
                    <div className='p-2 px-4 rounded-full bg-[#FFFFFF] text-[#000000] min-w-fit'>등등</div>
                    <div className='p-2 px-4 rounded-full bg-[#FFFFFF] text-[#000000] min-w-fit'>등등</div>
                    <div className='p-2 px-4 rounded-full bg-[#FFFFFF] text-[#000000] min-w-fit'>등등</div>
                    <div className='p-2 px-4 rounded-full bg-[#FFFFFF] text-[#000000] min-w-fit'>등등</div>
                    <div className='p-2 px-4 rounded-full bg-[#FFFFFF] text-[#000000] min-w-fit'>등등</div>
                    <div className='p-2 px-4 rounded-full bg-[#FFFFFF] text-[#000000] min-w-fit'>등등</div>
                    <div className='p-2 px-4 rounded-full bg-[#FFFFFF] text-[#000000] min-w-fit'>등등</div>
                    <div className='p-2 px-4 rounded-full bg-[#FFFFFF] text-[#000000] min-w-fit'>등등</div>
                    <div className='p-2 px-4 rounded-full bg-[#FFFFFF] text-[#000000] min-w-fit'>등등</div>
                    <div className='p-2 px-4 rounded-full bg-[#FFFFFF] text-[#000000] min-w-fit'>등등</div>
                    <div className='p-2 px-4 rounded-full bg-[#FFFFFF] text-[#000000] min-w-fit'>등등</div>
                    <div className='p-2 px-4 rounded-full bg-[#FFFFFF] text-[#000000] min-w-fit'>등등</div>
                    <div className='p-2 px-4 rounded-full bg-[#FFFFFF] text-[#000000] min-w-fit'>등등</div>
                    <div className='p-2 px-4 rounded-full bg-[#FFFFFF] text-[#000000] min-w-fit'>등등</div>
                    <div className='p-2 px-4 rounded-full bg-[#FFFFFF] text-[#000000] min-w-fit'>등등</div>
                    <div className='p-2 px-4 rounded-full bg-[#FFFFFF] text-[#000000] min-w-fit'>등등</div>
                    <div className='p-2 px-4 rounded-full bg-[#FFFFFF] text-[#000000] min-w-fit'>등등</div>
                    <div className='p-2 px-4 rounded-full bg-[#FFFFFF] text-[#000000] min-w-fit'>등등</div>
                    <div className='p-2 px-4 rounded-full bg-[#FFFFFF] text-[#000000] min-w-fit'>등등</div>
                    <div className='p-2 px-4 rounded-full bg-[#FFFFFF] text-[#000000] min-w-fit'>등등</div>
                    <div className='p-2 px-4 rounded-full bg-[#FFFFFF] text-[#000000] min-w-fit'>등등</div>
                    <div className='p-2 px-4 rounded-full bg-[#FFFFFF] text-[#000000] min-w-fit'>등등</div>
                    <div className='p-2 px-4 rounded-full bg-[#FFFFFF] text-[#000000] min-w-fit'>등등</div>
                    <div className='p-2 px-4 rounded-full bg-[#FFFFFF] text-[#000000] min-w-fit'>등등</div>
                    <div className='p-2 px-4 rounded-full bg-[#FFFFFF] text-[#000000] min-w-fit'>등등</div>
                    <div className='p-2 px-4 rounded-full bg-[#FFFFFF] text-[#000000] min-w-fit'>등등</div>
                    <div className='p-2 px-4 rounded-full bg-[#FFFFFF] text-[#000000] min-w-fit'>등등</div>
                    <div className='p-2 px-4 rounded-full bg-[#FFFFFF] text-[#000000] min-w-fit'>등등</div>
                    <div className='p-2 px-4 rounded-full bg-[#FFFFFF] text-[#000000] min-w-fit'>등등</div>
                    <div className='p-2 px-4 rounded-full bg-[#FFFFFF] text-[#000000] min-w-fit'>등등</div>
                    <div className='p-2 px-4 rounded-full bg-[#FFFFFF] text-[#000000] min-w-fit'>등등</div>
                    <div className='p-2 px-4 rounded-full bg-[#FFFFFF] text-[#000000] min-w-fit'>등등</div>
                    <div className='p-2 px-4 rounded-full bg-[#FFFFFF] text-[#000000] min-w-fit'>등등</div>
                    <div className='p-2 px-4 rounded-full bg-[#FFFFFF] text-[#000000] min-w-fit'>등등</div>
                    <div className='p-2 px-4 rounded-full bg-[#FFFFFF] text-[#000000] min-w-fit'>등등</div>
                    <div className='p-2 px-4 rounded-full bg-[#FFFFFF] text-[#000000] min-w-fit'>등등</div>
                    <div className='p-2 px-4 rounded-full bg-[#FFFFFF] text-[#000000] min-w-fit'>등등</div>
                    <div className='p-2 px-4 rounded-full bg-[#FFFFFF] text-[#000000] min-w-fit'>등등</div>
                    <div className='p-2 px-4 rounded-full bg-[#FFFFFF] text-[#000000] min-w-fit'>등등</div>
                    <div className='p-2 px-4 rounded-full bg-[#FFFFFF] text-[#000000] min-w-fit'>등등</div>
                    <div className='p-2 px-4 rounded-full bg-[#FFFFFF] text-[#000000] min-w-fit'>등등</div>
                    <div className='p-2 px-4 rounded-full bg-[#FFFFFF] text-[#000000] min-w-fit'>등등</div>
                    <div className='p-2 px-4 rounded-full bg-[#FFFFFF] text-[#000000] min-w-fit'>등등</div>
                    <div className='p-2 px-4 rounded-full bg-[#FFFFFF] text-[#000000] min-w-fit'>등등</div>
                    <div className='p-2 px-4 rounded-full bg-[#FFFFFF] text-[#000000] min-w-fit'>등등</div>
                    <div className='p-2 px-4 rounded-full bg-[#FFFFFF] text-[#000000] min-w-fit'>등등</div>
                    <div className='p-2 px-4 rounded-full bg-[#FFFFFF] text-[#000000] min-w-fit'>등등</div>
                    <div className='p-2 px-4 rounded-full bg-[#FFFFFF] text-[#000000] min-w-fit'>등등</div>
                    <div className='p-2 px-4 rounded-full bg-[#FFFFFF] text-[#000000] min-w-fit'>등등</div>
                    <div className='p-2 px-4 rounded-full bg-[#FFFFFF] text-[#000000] min-w-fit'>등등</div>
                    <div className='p-2 px-4 rounded-full bg-[#FFFFFF] text-[#000000] min-w-fit'>등등</div>
                    <div className='p-2 px-4 rounded-full bg-[#FFFFFF] text-[#000000] min-w-fit'>등등</div>
                    <div className='p-2 px-4 rounded-full bg-[#FFFFFF] text-[#000000] min-w-fit'>등등</div>
                    <div className='p-2 px-4 rounded-full bg-[#FFFFFF] text-[#000000] min-w-fit'>등등</div>
                    <div className='p-2 px-4 rounded-full bg-[#FFFFFF] text-[#000000] min-w-fit'>등등</div>
                    <div className='p-2 px-4 rounded-full bg-[#FFFFFF] text-[#000000] min-w-fit'>등등</div>
                    <div className='p-2 px-4 rounded-full bg-[#FFFFFF] text-[#000000] min-w-fit'>등등</div>
                    <div className='p-2 px-4 rounded-full bg-[#FFFFFF] text-[#000000] min-w-fit'>등등</div>
                    <div className='p-2 px-4 rounded-full bg-[#FFFFFF] text-[#000000] min-w-fit'>등등</div>
                    <div className='p-2 px-4 rounded-full bg-[#FFFFFF] text-[#000000] min-w-fit'>등등</div>
                    <div className='p-2 px-4 rounded-full bg-[#FFFFFF] text-[#000000] min-w-fit'>등등</div>
                    <div className='p-2 px-4 rounded-full bg-[#FFFFFF] text-[#000000] min-w-fit'>등등</div>
                    <div className='p-2 px-4 rounded-full bg-[#FFFFFF] text-[#000000] min-w-fit'>등등</div>
                    <div className='p-2 px-4 rounded-full bg-[#FFFFFF] text-[#000000] min-w-fit'>등등</div>
                    <div className='p-2 px-4 rounded-full bg-[#FFFFFF] text-[#000000] min-w-fit'>등등</div>
                    <div className='p-2 px-4 rounded-full bg-[#FFFFFF] text-[#000000] min-w-fit'>등등</div>
                    <div className='p-2 px-4 rounded-full bg-[#FFFFFF] text-[#000000] min-w-fit'>등등</div>
                    <div className='p-2 px-4 rounded-full bg-[#FFFFFF] text-[#000000] min-w-fit'>등등</div>
                    <div className='p-2 px-4 rounded-full bg-[#FFFFFF] text-[#000000] min-w-fit'>등등</div>
                    <div className='p-2 px-4 rounded-full bg-[#FFFFFF] text-[#000000] min-w-fit'>등등</div>
                    <div className='p-2 px-4 rounded-full bg-[#FFFFFF] text-[#000000] min-w-fit'>등등</div>
                    <div className='p-2 px-4 rounded-full bg-[#FFFFFF] text-[#000000] min-w-fit'>등등</div>
                    <div className='p-2 px-4 rounded-full bg-[#FFFFFF] text-[#000000] min-w-fit'>등등</div>
                    <div className='p-2 px-4 rounded-full bg-[#FFFFFF] text-[#000000] min-w-fit'>등등</div>
                    <div className='p-2 px-4 rounded-full bg-[#FFFFFF] text-[#000000] min-w-fit'>등등</div>
                    <div className='p-2 px-4 rounded-full bg-[#FFFFFF] text-[#000000] min-w-fit'>등등</div>
                    <div className='p-2 px-4 rounded-full bg-[#FFFFFF] text-[#000000] min-w-fit'>등등</div>
                    <div className='p-2 px-4 rounded-full bg-[#FFFFFF] text-[#000000] min-w-fit'>등등</div>
                    <div className='p-2 px-4 rounded-full bg-[#FFFFFF] text-[#000000] min-w-fit'>등등</div>
                    <div className='p-2 px-4 rounded-full bg-[#FFFFFF] text-[#000000] min-w-fit'>등등</div>
                    <div className='p-2 px-4 rounded-full bg-[#FFFFFF] text-[#000000] min-w-fit'>등등</div>
                    <div className='p-2 px-4 rounded-full bg-[#FFFFFF] text-[#000000] min-w-fit'>등등</div>
                    <div className='p-2 px-4 rounded-full bg-[#FFFFFF] text-[#000000] min-w-fit'>등등</div>
                    <div className='p-2 px-4 rounded-full bg-[#FFFFFF] text-[#000000] min-w-fit'>등등</div>
                    <div className='p-2 px-4 rounded-full bg-[#FFFFFF] text-[#000000] min-w-fit'>등등</div>
                    <div className='p-2 px-4 rounded-full bg-[#FFFFFF] text-[#000000] min-w-fit'>등등</div>
                    <div className='p-2 px-4 rounded-full bg-[#FFFFFF] text-[#000000] min-w-fit'>등등</div>
                    <div className='p-2 px-4 rounded-full bg-[#FFFFFF] text-[#000000] min-w-fit'>등등</div>
                    <div className='p-2 px-4 rounded-full bg-[#FFFFFF] text-[#000000] min-w-fit'>등등</div>
                    <div className='p-2 px-4 rounded-full bg-[#FFFFFF] text-[#000000] min-w-fit'>등등</div>
                    <div className='p-2 px-4 rounded-full bg-[#FFFFFF] text-[#000000] min-w-fit'>등등</div>
                    <div className='p-2 px-4 rounded-full bg-[#FFFFFF] text-[#000000] min-w-fit'>등등</div>
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
            </div>

                <div className='flex flex-row w-full justify-between py-4'>
                    <div className='basis-1/4 flex flex-row justify-center'>
                        <div className='flex flex-col'>
                            <div className='flex flex-row w-full justify-center'>
                                <SizeComponent Component={HomeOutlinedIcon} className={`text-[#FF7C1C] text-[3red]`} fontSize={"3rem"} />
                            </div>
                            <div className='flex flex-row justify-center w-full text-[#FF7C1C]'>홈</div>
                        </div>
                    </div>
                    <div className='basis-1/4 flex flex-row justify-center'>
                        <div className='flex flex-col'>
                            <div className='flex flex-row w-full justify-center'>
                                <SizeComponent Component={SearchOutlinedIcon} className={`text-[#888888] text-[3red]`} fontSize={"3rem"} />
                            </div>
                            <div className='flex flex-row justify-center w-full text-[#888888]'>검색</div>
                        </div>
                    </div>
                    <div className='basis-1/4 flex flex-row justify-center'>
                        <div className='flex flex-col'>
                            <div className='flex flex-row w-full justify-center'>
                                <SizeComponent Component={GroupsOutlinedIcon} className={`text-[#888888] text-[3red]`} fontSize={"3rem"} />
                            </div>
                            <div className='flex flex-row justify-center w-full text-[#888888]'>내 모임</div>
                        </div>
                    </div>
                    <div className='basis-1/4 flex flex-row justify-center'>
                        <div className='flex flex-col'>
                            <div className='flex flex-row w-full justify-center'>
                                <SizeComponent Component={PermIdentityOutlinedIcon} className={`text-[#888888] text-[3red]`} fontSize={"3rem"} />
                            </div>
                            <div className='flex flex-row justify-center w-full text-[#888888]'>마이 페이지</div>
                        </div>
                    </div>

                </div>
        </div>
    );
    
    
}