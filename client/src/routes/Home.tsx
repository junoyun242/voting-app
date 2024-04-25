import { Link } from "react-router-dom";
import { Button, Flex, Input, Text } from "@mantine/core";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { modals } from "@mantine/modals";
import { useOs } from "@mantine/hooks";
import "@mantine/notifications/styles.css";
import { notifications } from "@mantine/notifications";

const Home = () => {
  const os = useOs();
  const navigate = useNavigate();
  const [pollToken, setPollToken] = useState<string>("");

  const goToPoll = () => {
    if (!pollToken) {
      modals.open({
        title: "Error",
        children: <Text c="red">Token empty</Text>,
        centered: true,
      });
      return;
    }
    navigate(`/poll/${pollToken}`);
  };

  useEffect(() => {
    if (os === "undetermined") return;
    if (os !== "ios" && os !== "android") {
      notifications.show({
        title: "This app is designed for mobile",
        message: `It looks like you're using ${os}. Use your phone for the best experience`,
        color: "red",
      });
    }
  }, [os]);
  return (
    <Flex direction="column" align="center" gap={30}>
      <Button w={200}>
        <Link
          style={{ textDecoration: "none", color: "white" }}
          to="/poll/create"
        >
          Create A New Poll
        </Link>
      </Button>
      <Flex direction="column" gap={10}>
        <Input
          w={200}
          placeholder="Insert your poll token"
          onChange={(e) => setPollToken(e.target.value)}
        />
        <Button w={200} onClick={goToPoll}>
          Go To A Poll
        </Button>
      </Flex>
    </Flex>
  );
};

export default Home;
