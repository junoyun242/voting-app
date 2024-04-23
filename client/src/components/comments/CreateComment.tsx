import { Button, Modal, Flex, Textarea, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { FC } from "react";

interface PropTypes {
  opened: boolean;
  mutationFn: (content: string, nickname: string) => void;
  close: () => void;
}

const CreateComment: FC<PropTypes> = ({ opened, mutationFn, close }) => {
  const form = useForm({
    mode: "uncontrolled",
    initialValues: {
      comment: "",
      nickname: "",
    },

    validate: {
      comment: (val) => (val.length >= 5 ? null : "Comment too short"),
      nickname: (val) => (val.length >= 3 ? null : "Nickname too short"),
    },
  });

  type FormValues = typeof form.values;

  const submit = async (values: FormValues) => {
    mutationFn(values.comment, values.nickname);
    close();
  };
  return (
    <Modal opened={opened} onClose={close} title="New comment" centered>
      <form style={{ marginTop: "10px" }} onSubmit={form.onSubmit(submit)}>
        <Flex direction="column" gap={20}>
          <TextInput
            withAsterisk
            placeholder="Your nickname"
            label="Nickname"
            {...form.getInputProps("nickname")}
          />
          <Textarea
            withAsterisk
            placeholder="Your comment"
            label="Comment"
            {...form.getInputProps("comment")}
          />
          <Button w={100} style={{ alignSelf: "end" }} type="submit">
            Submit
          </Button>
        </Flex>
      </form>
    </Modal>
  );
};

export default CreateComment;
