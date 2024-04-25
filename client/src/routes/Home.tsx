import { Link } from "react-router-dom";
import { Button, Flex, Input, Text } from "@mantine/core";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { modals } from "@mantine/modals";

const Home = () => {
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
  return (
    <Flex direction="column" align="center" gap={30}>
      <Button w={200} onClick={() => navigate("/poll/create")}>
        <Link
          style={{ textDecoration: "none", color: "white", width: "100%" }}
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
