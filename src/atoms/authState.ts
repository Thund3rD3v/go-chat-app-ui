import { notifications } from "@mantine/notifications";
import { atom } from "recoil";
import { nprogress } from "@mantine/nprogress";

type TAuthState =
  | {
      status: "authenticated";
      username: string;
      token: string;
    }
  | {
      status: "unauthenticated";
    }
  | {
      status: "loading";
    };

const authState = atom<TAuthState>({
  key: "authState",
  default: {
    status: "loading",
  },
  effects: [
    ({ setSelf, onSet }) => {
      const token = localStorage.getItem("token");

      const fetchUserData = async (token: string) => {
        try {
          const res = await fetch(
            `${import.meta.env.VITE_SERVER_URL}/users/me`,
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: token,
              },
            }
          );

          const data = await res.json();

          if (res.ok) {
            setSelf({
              status: "authenticated",
              username: data.username,
              token,
            });
            nprogress.complete();
          } else {
            setSelf({
              status: "unauthenticated",
            });
            localStorage.removeItem("token");
            notifications.show({
              color: "red",
              title: "Error",
              message: data.message,
            });
          }
        } catch (err) {
          console.error(err);
          notifications.show({
            color: "red",
            title: "Error",
            message: "Uh oh, there was internal server error",
          });
          setSelf({ status: "unauthenticated" });
        }
      };

      if (token) {
        fetchUserData(token);
      } else {
        setSelf({ status: "unauthenticated" });
      }

      onSet((newValue, _, isReset) => {
        if (isReset) {
          localStorage.removeItem("token");
          setSelf({ status: "unauthenticated" });
          notifications.show({
            color: "teal",
            title: "Signed Out",
            message: "Signed out successfully",
          });
        } else {
          if (newValue.status === "authenticated") {
            localStorage.setItem("token", newValue.token);
          }
        }
      });
    },
  ],
});

export default authState;
