import {
  Paper,
  Container,
  Title,
  TextInput,
  Button,
  PasswordInput,
  Text,
  Anchor,
  Center,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useSetRecoilState } from "recoil";
import authState from "../atoms/authState";
import { notifications } from "@mantine/notifications";
import Logo from "../components/ui/Logo";
import { useNavigate } from "react-router-dom";

function SignInPage() {
  const setAuth = useSetRecoilState(authState);
  const navigate = useNavigate();

  const form = useForm({
    initialValues: {
      username: "",
      password: "",
    },

    // prettier-ignore
    validate: {
      username: (value) =>
      (!/\s/g.test(value)) ? null : "Username is required",
      password: (value) =>
      (!/\s/g.test(value)) ? null : "Password is required"
    },
  });

  async function handleSignIn({
    username,
    password,
  }: {
    username: string;
    password: string;
  }) {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_SERVER_URL}/auth/signin`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username,
            password,
          }),
        }
      );

      const data = await res.json();

      if (res.ok) {
        setAuth({ status: "authenticated", username, token: data.token });
      } else {
        console.log("E");
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
    }
  }

  return (
    <Container
      sx={{
        position: "absolute",
        width: "100vw",
        left: "50%",
        top: "40%",
        transform: "translate(-50%, -50%)",
      }}
      size="xs"
      my={40}>
      <div>
        <Center mb={16}>
          <Logo />
        </Center>
        <Title align="center" weight={900}>
          Welcome Back!
        </Title>
        <Text color="dimmed" size="sm" align="center" mt={5}>
          Do not have an account yet?{" "}
          <Anchor
            onClick={() => navigate("/signup")}
            size="sm"
            component="button">
            Sign Up
          </Anchor>
        </Text>
      </div>

      <Paper mt={30} p="lg" withBorder>
        <form
          // eslint-disable-next-line react-hooks/rules-of-hooks
          onSubmit={form.onSubmit((values) => void handleSignIn(values))}>
          <TextInput
            placeholder="Publicly visible username"
            label="Username"
            withAsterisk={false}
            required
            {...form.getInputProps("username")}
          />
          <PasswordInput
            placeholder="Super secret password"
            label="Password"
            withAsterisk={false}
            required
            {...form.getInputProps("password")}
          />
          <Button type="submit" mt={12} fullWidth>
            Sign In
          </Button>
        </form>
      </Paper>
    </Container>
  );
}

export default SignInPage;
