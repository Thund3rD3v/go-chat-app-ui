import {
  Avatar,
  Flex,
  Loader,
  Stack,
  Text,
  Tooltip,
  useMantineTheme,
} from "@mantine/core";
import { useEffect, useRef } from "react";
import { useRecoilValue } from "recoil";
import authState from "../atoms/authState";
import { TMessage } from "../types/main";

type Props = {
  messages: TMessage[];
  readyState: number;
  isLoading: boolean;
};

function MessagesContainer({ messages, readyState, isLoading }: Props) {
  const theme = useMantineTheme();

  const auth = useRecoilValue(authState);
  const lastMessage = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (lastMessage.current && readyState != 0) {
      //lastMessage.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, readyState]);

  return (
    <Stack mb="4rem" spacing="sm">
      {isLoading && <Loader />}
      {messages.map((message, idx) => {
        return (
          <Flex
            ref={messages.length - 1 == idx ? lastMessage : null}
            direction={message.userId == auth.id ? "row-reverse" : "row"}
            gap={12}
            key={`message-${message.id}`}>
            <Tooltip
              label={message.user.username}
              color="dark"
              position="bottom">
              <Avatar
                src={`https://api.dicebear.com/6.x/bottts-neutral/svg?seed=${
                  message.user.username
                }&translateX=${message.userId == auth.id ? "-25" : "25"}`}
                alt={`${message.user.username}-avatar`}
              />
            </Tooltip>

            <Text
              c="white"
              align="start"
              sx={{
                background: theme.colors.blue[5],
                padding: theme.spacing.xs,
                borderRadius: theme.radius.md,
                overflowWrap: "break-word",
                maxWidth: "45%",
              }}>
              {message.value}
            </Text>
          </Flex>
        );
      })}
    </Stack>
  );
}

export default MessagesContainer;
