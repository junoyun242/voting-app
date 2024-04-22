import { Flex, Button } from "@mantine/core";
import { useNavigate } from "react-router-dom";
const Header = () => {
  const navigate = useNavigate();
  return (
    <Flex justify="center" align="center" h="100%">
      <Button bg="transparent" onClick={() => navigate("/")}>
        Voting App
      </Button>
    </Flex>
  );
};

export default Header;
