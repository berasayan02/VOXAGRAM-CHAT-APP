import { useAppStore } from "@/store";
import { GET_ONLINE_USER_ROUTES, HOST } from "@/utils/constants";
import { io } from "socket.io-client";
import { createContext, useContext, useEffect, useRef, useState } from "react";
import { apiClient } from "@/lib/api-client";

const SocketContext = createContext(null);

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }) => {
    const socket = useRef(null);
    const { userInfo } = useAppStore();
    const [isSocketReady, setSocketReady] = useState(false);

    useEffect(() => {
        if (!userInfo) return;

        socket.current = io(HOST, {
            withCredentials: true,
            query: { userId: userInfo.id },
        });

        socket.current.on("connect", () => {
            console.log("✅ Connected to socket server");
            setSocketReady(true);
        });

        const fetchOnlineUsers = async () => {
            const { setOnlineUsers } = useAppStore.getState();
            try {
                const response = await apiClient.get(`${HOST}/${GET_ONLINE_USER_ROUTES}`, {
                    withCredentials: true,
                });
                const data = response.data;
                if (data.users) {
                    setOnlineUsers(data.users);
                }
            } catch (error) {
                console.error("❌ Failed to fetch online users:", error);
            }
        };

        const handleReceiveMessage = (message) => {
            const {
                selectedChatData,
                selectedChatType,
                addMessage,
                addContactsInDMContacts,
            } = useAppStore.getState();

            const isSameChat =
                selectedChatData &&
                (selectedChatData._id === message.sender._id ||
                    selectedChatData._id === message.recipient._id);

            if (selectedChatType === "contact" && isSameChat) {
                addMessage(message);
            }
            addContactsInDMContacts(message);
        };

        const handleReceiveChannelMessage = (message) => {
            const {
                selectedChatData,
                selectedChatType,
                addMessage,
                addChannelInChannelList,
            } = useAppStore.getState();

            const isSameChannel = selectedChatData && selectedChatData._id === message.channelId;

            if (selectedChatType === "channel" && isSameChannel) {
                addMessage(message);
            }
            addChannelInChannelList(message);
        };

        const handleUserOnline = (userId) => {
            const { updateUserStatus } = useAppStore.getState();
            updateUserStatus(userId, { isOnline: true, lastSeen: null });
        };

        const handleUserOffline = (userId) => {
            const { updateUserStatus } = useAppStore.getState();
            updateUserStatus(userId, {
                isOnline: false,
                lastSeen: new Date().toISOString(),
            });
        };

        fetchOnlineUsers();
        socket.current.on("receiveMessage", handleReceiveMessage);
        socket.current.on("receive-channel-message", handleReceiveChannelMessage);
        socket.current.on("user-online", handleUserOnline);
        socket.current.on("user-offline", handleUserOffline);

        return () => {
            socket.current?.disconnect();
            setSocketReady(false);
        };
    }, [userInfo]);

    return (
        <SocketContext.Provider value={isSocketReady ? socket.current : null}>
            {children}
        </SocketContext.Provider>
    );
};
