import { Routes, Route, useLocation } from "react-router-dom";
import { useRecoilValue } from "recoil";
import SignInPage from "./pages/SignIn";
import authState from "./atoms/authState";
import Nav from "./components/ui/Nav";
import ProfilePage from "./pages/Profile";
import { Box } from "@mantine/core";
import SignUpPage from "./pages/SignUp";
import ChatPage from "./pages/Chat";

function App() {
  const auth = useRecoilValue(authState);
  const location = useLocation();

  return (
    <Routes location={location} key={location.pathname}>
      <Route
        path="*"
        element={
          auth.status === "authenticated" ? (
            <Box
              sx={{
                display: "flex",
                alignItems: "start",
                justifyContent: "start",
              }}>
              <Nav />
              <Routes>
                <Route path="/" element={<ChatPage />} />
                <Route path="/profile" element={<ProfilePage />} />
              </Routes>
            </Box>
          ) : (
            <Routes>
              <Route path="/" element={<SignInPage />} />
              <Route path="/signup" element={<SignUpPage />} />
            </Routes>
          )
        }
      />
    </Routes>
  );
}

export default App;
