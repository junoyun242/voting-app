import { Accordion, Title, Text } from "@mantine/core";

const HowToUseThisApp = () => {
  return (
    <>
      <Title order={2} mb={10}>
        FAQ
      </Title>
      <Accordion>
        <Accordion.Item value="create">
          <Accordion.Control p={0}>How To Create a Poll</Accordion.Control>
          <Accordion.Panel>
            You can create a new poll by clicking the{" "}
            <Text display="inline" fw="bold" c="blue">
              button
            </Text>{" "}
            above.
          </Accordion.Panel>
        </Accordion.Item>
        <Accordion.Item value="join">
          <Accordion.Control p={0}>How To Join a Poll</Accordion.Control>
          <Accordion.Panel>
            You can join an existing poll by inserting the poll token in the{" "}
            <Text display="inline" fw="bold" c="blue">
              input field
            </Text>{" "}
            above.
          </Accordion.Panel>
        </Accordion.Item>
        <Accordion.Item value="customize">
          <Accordion.Control p={0}>
            What's an expiration date?
          </Accordion.Control>
          <Accordion.Panel>
            You can set an{" "}
            <Text display="inline" fw="bold" c="blue">
              expiration date
            </Text>{" "}
            so that the poll ends on your desired date.
          </Accordion.Panel>
        </Accordion.Item>
        <Accordion.Item value="share">
          <Accordion.Control p={0}>How to share it?</Accordion.Control>
          <Accordion.Panel>
            Once you create your poll, you can share the{" "}
            <Text display="inline" fw="bold" c="blue">
              URL of the poll
            </Text>{" "}
            to your friends. They votes will be updated in real-time.
          </Accordion.Panel>
        </Accordion.Item>
        <Accordion.Item value="caution">
          <Accordion.Control p={0}>
            <Text c="red">Precautions</Text>
          </Accordion.Control>
          <Accordion.Panel>
            Although this app's client blocks you from casting more than one
            vote, there are ways to get around this.{" "}
            <Text c="red" display="inline">
              Don't use this app for something that should be 100% fair.
            </Text>
          </Accordion.Panel>
        </Accordion.Item>
      </Accordion>
    </>
  );
};

export default HowToUseThisApp;
