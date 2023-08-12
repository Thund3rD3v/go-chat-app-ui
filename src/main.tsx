import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { MantineProvider } from "@mantine/core";
import { Notifications } from "@mantine/notifications";
import { RecoilRoot } from "recoil";
import { NavigationProgress } from "@mantine/nprogress";
import { BrowserRouter } from "react-router-dom";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <RecoilRoot>
      <MantineProvider
        theme={{ colorScheme: "dark" }}
        withGlobalStyles
        withNormalizeCSS>
        <NavigationProgress />
        <Notifications />
        <App />
      </MantineProvider>
    </RecoilRoot>
  </BrowserRouter>
);
