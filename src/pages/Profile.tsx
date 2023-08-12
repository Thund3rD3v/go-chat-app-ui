import { Paper, Box, Image, Text, Title } from "@mantine/core";
import { useRecoilValue } from "recoil";
import { Navigate } from "react-router-dom";
import authState from "../atoms/authState";

function ProfilePage() {
  const auth = useRecoilValue(authState);

  if (auth.status != "authenticated") {
    return <Navigate to="/" />;
  }

  return (
    <Paper
      w={"100%"}
      mx={30}
      mt={30}
      p="lg"
      sx={{ display: "flex", gap: 16 }}
      withBorder>
      <Image
        width={120}
        src={`https://api.dicebear.com/6.x/bottts-neutral/svg?seed=${auth.username}`}
      />
      <Box>
        <Text>Signed In As</Text>
        <Title>{auth.username}</Title>
      </Box>
    </Paper>
  );
}

export default ProfilePage;
