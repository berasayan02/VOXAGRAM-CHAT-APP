import { useAppStore } from '@/store';
import { Avatar, AvatarImage } from './ui/avatar';
import { HOST } from '@/utils/constants';
import { getColor } from '@/lib/utils';

const ContactList = ({ contacts, isChannel = false }) => {

    const {
        selectedChatData,
        setSelectedChatData,
        selectedChatType,
        setSelectedChatType,
        setSelectedChatMessages,
        onlineUsers,
    } = useAppStore();

    const handleClick = (contact) => {
        if (isChannel) setSelectedChatType("channel");
        else setSelectedChatType("contact");

        setSelectedChatData(contact);

        if (selectedChatData && selectedChatData._id !== contact._id) {
            setSelectedChatMessages([]);
        }
    };

    return (
        <div className="mt-5">
            {
                contacts.map((contact) => (
                    <div key={contact._id}
                        className={`pl-10 py-2 transition-all duration-300 cursor-pointer 
                            ${selectedChatData && selectedChatData._id === contact._id
                                ? "bg-[#8417ff] hover:bg-[#8417ff]"
                                : "hover:bg-[#f1f1f111]"
                            }`
                        }
                        onClick={() => handleClick(contact)}
                    >
                        <div className="flex gap-5 items-center justify-start text-neutral-300">
                            {
                                !isChannel && (
                                    <div className='relative'>
                                        <Avatar className="w-10 h-10 rounded-full overflow-hidden">
                                            {
                                                contact.image ? (
                                                    <AvatarImage
                                                        src={`${HOST}/${contact.image}`}
                                                        alt="Profile Pic"
                                                        className="object-cover w-full h-full bg-black"
                                                    />
                                                ) : (
                                                    <div className={`
                                                    ${selectedChatData &&
                                                            selectedChatData._id === contact._id
                                                            ? "bg-[#ffffff22] border border-white/60 "
                                                            : getColor(contact.color)
                                                        }
                                                uppercase w-10 h-10 text-lg border-[1px] flex items-center justify-center rounded-full
                                                `}>
                                                        {contact.firstName ? contact.firstName.split("").shift() : contact.email.split("").shift()}
                                                    </div>
                                                )
                                            }
                                        </Avatar>
                                        <span className={`absolute right-0 bottom-0 w-3 h-3 rounded-full border-2 border-black 
                                                    ${onlineUsers.find(user => user._id === contact._id)?.isOnline ? "bg-green-500" : "hidden"}`}
                                        ></span>
                                    </div>
                                )
                            }
                            {
                                isChannel && (
                                    <div className={`${selectedChatData &&
                                        selectedChatData._id === contact._id
                                        ? "bg-[#ffffff22] border border-white/60 "
                                        : "bg-purple-500/20 border-purple-500 text-purple-500"
                                        }
                                    uppercase h-10 w-10 flex items-center justify-center rounded-full border-[1px]`}>
                                        {contact.name.split("").shift()}
                                    </div>
                                )
                            }
                            {
                                isChannel ? (
                                    <span>{contact.name}</span>
                                ) : (
                                    <span>
                                        {
                                            contact.firstName ? (
                                                `${contact.firstName} ${contact.lastName}`
                                            ) : (
                                                contact.email
                                            )
                                        }
                                    </span>
                                )
                            }
                        </div>
                    </div>
                ))
            }
        </div>
    )
}

export default ContactList