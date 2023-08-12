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
import { notifications } from "@mantine/notifications";
import Logo from "../components/ui/Logo";
import { useNavigate } from "react-router-dom";

function SignUpPage() {
  const navigate = useNavigate();

  const form = useForm({
    initialValues: {
      username: "",
      password: "",
    },

    // prettier-ignore
    validate: {
        username: (value) => {
          if (/\s/g.test(value)) {
            return "Username is required"
          }

          if (value.length < 3) {
            return "Username is required to be longer than or equal to 3 characters"
          }

          
          if (value.length > 30) {
            return "Username is required to be shorter than or equal to 30 characters"
          }

          return null
        },
        password: (value) => {
          if (/\s/g.test(value)) {
            return "Password is required"
          }

          if (value.length < 3) {
            return "Password is required to be longer than or equal to 3 characters"
          }

          
          if (value.length > 30) {
            return "Password is required to be shorter than or equal to 30 characters"
          }

          return null
        }
      },
  });

  async function handleSignUp({
    username,
    password,
  }: {
    username: string;
    password: string;
  }) {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_SERVER_URL}/auth/signup`,
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
        notifications.show({
          color: "teal",
          title: "Success",
          message: data.message,
        });
        navigate("/");
      } else {
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
          Let's Get Started!
        </Title>
        <Text color="dimmed" size="sm" align="center" mt={5}>
          Already have an account?{" "}
          <Anchor onClick={() => navigate("/")} size="sm" component="button">
            Sign In
          </Anchor>
        </Text>
      </div>

      <Paper mt={30} p="lg" withBorder>
        <form
          // eslint-disable-next-line react-hooks/rules-of-hooks
          onSubmit={form.onSubmit((values) => void handleSignUp(values))}>
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
            Sign Up
          </Button>
        </form>
      </Paper>
    </Container>
  );
}

export default SignUpPage;
