import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { getColor } from '@/lib/utils';
import { useAppStore } from '@/store';
import { HOST } from '@/utils/constants';
import { RiCloseFill } from 'react-icons/ri';
import { format, isToday, isYesterday, differenceInDays } from 'date-fns';

const ChatHeader = () => {
    const { closeChat, selectedChatData, selectedChatType, onlineUsers } = useAppStore();
    let userStatus = null;
    if (
        selectedChatType === "contact" &&
        selectedChatData &&
        selectedChatData._id &&
        Array.isArray(onlineUsers)
    ) {
        userStatus = onlineUsers.find(user => user._id === selectedChatData._id);
    }
    const isOnline = userStatus?.isOnline;
    const lastSeen = userStatus?.lastSeen;

    let lastSeenString = "Offline";

    if (!isOnline && lastSeen) {
        const lastSeenDate = new Date(lastSeen);

        if (isToday(lastSeenDate)) {
            lastSeenString = `at ${format(lastSeenDate, "hh:mm a")}`;
        } else if (isYesterday(lastSeenDate)) {
            lastSeenString = `yesterday at ${format(lastSeenDate, "hh:mm a")}`;
        } else if (differenceInDays(new Date(), lastSeenDate) < 365) {
            lastSeenString = `${format(lastSeenDate, "MMM d")} at ${format(lastSeenDate, "hh:mm a")}`;
        } else {
            lastSeenString = `${format(lastSeenDate, "dd/MM/yyyy")} at ${format(lastSeenDate, "hh:mm a")}`;
        }

        lastSeenString = `Last seen ${lastSeenString}`;
    }


    return (
        <div className="h-[10vh] border-b-2 border-[#2f303b] flex items-center justify-between px-20 below500:px-[16px]">
            <div className="flex gap-5 items-center w-full justify-between">
                <div className="flex gap-3 items-center justify-center">
                    <div className="h-12 w-12 relative">
                        {
                            selectedChatType === "contact" ? (
                                <div>
                                    <Avatar className="w-12 h-12 rounded-full overflow-hidden">
                                        {
                                            selectedChatData.image ? (
                                                <AvatarImage
                                                    src={`${HOST}/${selectedChatData.image}`}
                                                    alt="Profile Pic"
                                                    className="object-cover w-full h-full bg-black"
                                                />
                                            ) : (
                                                <div className={`uppercase w-12 h-12 text-lg border-[1px] flex items-center justify-center rounded-full ${getColor(selectedChatData.color)}`}>
                                                    {selectedChatData.firstName ? selectedChatData.firstName.split("").shift() : selectedChatData.email.split("").shift()}
                                                </div>
                                            )
                                        }
                                    </Avatar>
                                    <span className={`absolute right-0 bottom-0 w-3 h-3 rounded-full border-2 border-black 
                                    ${isOnline ? "bg-green-500" : "hidden"}`}
                                    ></span>
                                </div>
                            ) : (
                                <div className="bg-purple-500/20 border-[1px] border-purple-500 text-purple-500 h-10 w-10 flex items-center justify-center rounded-full">
                                    {selectedChatData.name.split("").shift()}
                                </div>
                            )
                        }

                    </div>
                    <div>
                        {
                            selectedChatType === "channel" && selectedChatData.name
                        }
                        {
                            selectedChatData && selectedChatType === "contact" && selectedChatData.firstName
                                ? (
                                    <div className='flex flex-col gap-1'>
                                        {selectedChatData.firstName} {selectedChatData.lastName}
                                        <span className={`ml-1 text-xs text-gray-400 ${isOnline ? "text-green-500" : "text-gray-500"}`}>
                                            {isOnline
                                                ? "Online" : lastSeenString}
                                        </span>
                                    </div>
                                ) : (
                                    selectedChatData.email
                                )
                        }
                    </div>
                </div>
                <div className="flex gap-3 items-center justify-center">
                    <button
                        className='text-neutral-500 focus:border-none focus:outline-none focus:text-white duration-300 transition-all'
                        onClick={closeChat}
                    >
                        <RiCloseFill className='text-3xl' />
                    </button>
                </div>
            </div>
        </div >
    )
}

export default ChatHeader