import {
  ActionIcon,
  Box,
  TextInput,
  useMantineTheme,
  LoadingOverlay,
} from "@mantine/core";
import { useRecoilValue } from "recoil";
import { Navigate } from "react-router-dom";
import authState from "../atoms/authState";
import { IconSend } from "@tabler/icons-react";
import { FormEvent, UIEvent, useEffect, useState } from "react";
import { TMessage } from "../types/main";
import useWebSocket from "react-use-websocket";
import MessagesContainer from "../components/MessagesContainer";

function ChatPage() {
  const theme = useMantineTheme();
  const auth = useRecoilValue(authState);

  const [messages, setMessages] = useState<TMessage[]>([]);
  const [message, setMessage] = useState("");

  const [isLoading, setIsLoading] = useState(false);

  const { sendJsonMessage, lastMessage, readyState } = useWebSocket(
    `${import.meta.env.VITE_WS_URL}/chat/ws?token=${
      auth.status == "authenticated" && auth.token
    }`
  );

  async function getMessages(offset: number) {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_SERVER_URL}/chat/messages?offset=${offset}`,
        {
          headers: {
            Authorization: auth.token || "",
          },
        }
      );
      const data: TMessage[] = await res.json();

      if (data.length > 0) {
        setMessages((prev) => [...prev, ...data]);
      }
    } catch (err) {
      console.error(err);
    }
  }

  async function getNextMessages() {
    try {
      setIsLoading(true);
      const res = await fetch(
        `${import.meta.env.VITE_SERVER_URL}/chat/messages?offset=${
          messages.length
        }`,
        {
          headers: {
            Authorization: auth.token || "",
          },
        }
      );
      const data: TMessage[] = await res.json();

      if (data.length > 0) {
        setMessages((prev) => [...data, ...prev]);
      }
      setIsLoading(false);
    } catch (err) {
      console.error(err);
      setIsLoading(false);
    }
  }

  function handleScroll(ev: UIEvent<HTMLDivElement, globalThis.UIEvent>) {
    const target = ev.currentTarget;
    if (target.scrollTop <= 0) {
      getNextMessages();
    }
  }

  function sendMessage(ev: FormEvent<HTMLFormElement>) {
    ev.preventDefault();
    setMessage("");
    sendJsonMessage({ eventType: "message", value: message });
  }

  useEffect(() => {
    getMessages(0);
  }, []);

  // When message received
  useEffect(() => {
    if (lastMessage !== null) {
      const data: { eventType: string; message: TMessage } = JSON.parse(
        lastMessage.data
      );
      switch (data.eventType) {
        case "message":
          setMessages((prev) => [...prev, data.message]);
          break;
      }
    }
  }, [lastMessage, setMessages]);

  if (auth.status != "authenticated") {
    return <Navigate to="/" />;
  }

  return (
    <Box
      onScroll={handleScroll}
      sx={{
        width: "100%",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        overflowX: "hidden",
        overflowY: readyState == 0 ? "clip" : "auto",
        position: "relative",
      }}
      p="md">
      <LoadingOverlay visible={readyState == 0} overlayBlur={1} />

      <MessagesContainer
        messages={messages}
        readyState={readyState}
        isLoading={isLoading}
      />
      <form
        style={{
          position: "sticky",
          width: "100%",
          bottom: 10,
        }}
        onSubmit={sendMessage}>
        <TextInput
          width="100%"
          value={message}
          onChange={(ev) => {
            setMessage(ev.target.value);
          }}
          rightSection={
            <ActionIcon type="submit" size={24} color={theme.primaryColor}>
              <IconSend size="1.1rem" stroke={1.5} />
            </ActionIcon>
          }
          placeholder="Your message for the world"
          rightSectionWidth={42}
        />
      </form>
    </Box>
  );
}

export default ChatPage;
