import { Paper, Box, Image, Text, Title, MediaQuery } from "@mantine/core";
import { useRecoilValue } from "recoil";
import { Navigate } from "react-router-dom";
import authState from "../atoms/authState";

function ProfilePage() {
  const auth = useRecoilValue(authState);

  if (auth.status != "authenticated") {
    return <Navigate to="/" />;
  }

  return (
    <MediaQuery smallerThan="xs" styles={{ flexDirection: "column" }}>
      <Paper
        w={"100%"}
        mx={30}
        mt={30}
        p="lg"
        sx={{ display: "flex", gap: 16 }}
        withBorder>
        <MediaQuery smallerThan="xs" styles={{ margin: "0 auto" }}>
          <Image
            width={150}
            src={`https://api.dicebear.com/6.x/bottts-neutral/svg?seed=${auth.username}`}
            alt={`${auth.username}-avatar`}
          />
        </MediaQuery>

        <MediaQuery smallerThan="xs" styles={{ textAlign: "center" }}>
          <Box>
            <Text>Signed In As</Text>
            <Title>{auth.username}</Title>
          </Box>
        </MediaQuery>
      </Paper>
    </MediaQuery>
  );
}

export default ProfilePage;
