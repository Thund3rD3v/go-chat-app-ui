import {
  Navbar,
  Center,
  Tooltip,
  UnstyledButton,
  createStyles,
  Stack,
  rem,
} from "@mantine/core";
import {
  IconLogout,
  IconMessageCircle2Filled,
  IconMoodHappyFilled,
} from "@tabler/icons-react";
import { MantineColor } from "@mantine/styles";
import { useResetRecoilState } from "recoil";
import authState from "../../atoms/authState";
import Logo from "./Logo";
import { useLocation, useNavigate } from "react-router-dom";

const useStyles = createStyles((theme) => ({
  link: {
    width: rem(50),
    height: rem(50),
    borderRadius: theme.radius.md,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color:
      theme.colorScheme === "dark"
        ? theme.colors.dark[0]
        : theme.colors.gray[7],

    "&:hover": {
      backgroundColor:
        theme.colorScheme === "dark"
          ? theme.colors.dark[5]
          : theme.colors.gray[0],
    },
  },

  active: {
    "&, &:hover": {
      backgroundColor: theme.fn.variant({
        variant: "light",
        color: theme.primaryColor,
      }).background,
      color: theme.fn.variant({ variant: "light", color: theme.primaryColor })
        .color,
    },
  },
}));

interface NavbarLinkProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  icon: React.FC<any>;
  label: string;
  color?: MantineColor;
  active?: boolean;
  onClick?(): void;
}

function NavbarLink({
  icon: Icon,
  label,
  color,
  active,
  onClick,
}: NavbarLinkProps) {
  const { classes, cx } = useStyles();
  return (
    <Tooltip
      color="dark"
      label={label}
      position="right"
      transitionProps={{ duration: 0 }}>
      <UnstyledButton
        onClick={onClick}
        className={cx(classes.link, { [classes.active]: active })}>
        <Icon color={color} size="1.2rem" stroke={1.5} />
      </UnstyledButton>
    </Tooltip>
  );
}

const mockdata = [
  { icon: IconMessageCircle2Filled, label: "Chat", pathname: "/" },
  { icon: IconMoodHappyFilled, label: "Profile", pathname: "/profile" },
];

function Nav() {
  const location = useLocation();
  const navigate = useNavigate();
  const resetAuth = useResetRecoilState(authState);

  function handleSignout() {
    resetAuth();
    navigate("/");
  }

  const links = mockdata.map((link) => (
    <NavbarLink
      {...link}
      key={link.label}
      active={location.pathname === link.pathname}
      onClick={() => {
        navigate(link.pathname);
      }}
    />
  ));

  return (
    <Navbar height="100vh" width={{ base: 80 }} p="md">
      <Center>
        <Logo />
      </Center>
      <Navbar.Section mt={36} grow>
        <Stack justify="center" spacing="xs">
          {links}
        </Stack>
      </Navbar.Section>
      <Navbar.Section>
        <Stack justify="center" spacing={0}>
          <NavbarLink
            onClick={handleSignout}
            icon={IconLogout}
            color="#fa5252"
            label="Sign Out"
          />
        </Stack>
      </Navbar.Section>
    </Navbar>
  );
}

export default Nav;
