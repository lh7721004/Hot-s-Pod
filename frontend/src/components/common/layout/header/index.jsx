import { useSelector } from 'react-redux';
import { IconButton } from '@mui/material';
import NotificationsIcon from '@mui/icons-material/NotificationsNone';


export default function HeaderLayout(props) {
    // const userName = useSelector("");
    // const userName = useSelector((state) => state.user?.userName);
    const userName = "";
    return (
        <div className="flex items-center justify-end px-6 pt-3 w-full space-x-2">

            <div>
                <IconButton>
                    <a href="/notify">
                        <NotificationsIcon style={{ fontSize: "27px" }} className="text-[#4C545B]" />
                    </a>
                </IconButton>
            </div>


            <div>
                {userName ? (
                    <div className="w-10 h-10 bg-[#212121] flex items-center justify-center rounded-full text-[white] text-[13px] weight-600 select-none cursor-pointer">
                        {userName}
                    </div>
                ) : (
                    <a href="/login">
                        <button className="text-white bg-black px-4 py-2 rounded-md hover:bg-[#F4F4F4]">
                            로그인
                        </button>
                    </a>
                )}
            </div>
        </div>
    );
}