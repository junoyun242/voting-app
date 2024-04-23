/* eslint-disable react-hooks/exhaustive-deps */
import { useForm } from "@mantine/form";
import {
  Flex,
  TextInput,
  Textarea,
  Button,
  Text,
  LoadingOverlay,
} from "@mantine/core";
import { DateTimePicker } from "@mantine/dates";
import dayjs from "dayjs";
import "@mantine/dates/styles.css";
import { RefObject, useRef, useState } from "react";
import TokenAPI from "../../api/TokenAPI";
import PollAPI from "../../api/PollAPI";
import { useNavigate } from "react-router-dom";
import { modals } from "@mantine/modals";

const CreatePoll = () => {
  const navigate = useNavigate();
  const now = dayjs();
  const weekFromNow = dayjs().add(1, "week");
  const [options, setOptions] = useState<string[]>([]);
  const [option, setOption] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const optionInputRef: RefObject<HTMLInputElement> = useRef(null);

  const colors: string[] = [
    "dark",
    "red",
    "pink",
    "grape",
    "violet",
    "indigo",
    "blue",
    "cyan",
    "green",
    "lime",
    "yellow",
    "orange",
    "teal",
  ];

  const form = useForm({
    mode: "uncontrolled",
    initialValues: {
      title: "",
      description: "",
      expirationDate: "",
    },

    validate: {
      title: (val) => (val.length >= 3 ? null : "Title too short"),
      description: (val) => (val.length >= 5 ? null : "Description too short"),
    },
  });
  type FormValues = typeof form.values;

  const addOption = () => {
    if (!option) return;
    setOptions((options) => [...options, option]);
    setOption("");
    optionInputRef.current?.focus();
  };

  const deleteOption = (index: number) => {
    const option = options[index];
    modals.openConfirmModal({
      title: `Delete ${option}?`,
      centered: true,
      labels: { confirm: "Delete", cancel: "Cancel" },
      confirmProps: { color: "red" },
      onConfirm: () => {
        const newOptions = options.filter((_, idx) => idx !== index);
        setOptions(newOptions);
      },
    });
  };

  const submit = async (values: FormValues) => {
    if (options.length < 2) {
      modals.open({
        title: "Error",
        children: <Text c="red">Options should be at least two</Text>,
        centered: true,
      });
      optionInputRef.current?.focus();
      return;
    }
    setIsLoading(true);
    const { title, description } = values;
    const newExpirationDate = values.expirationDate
      ? dayjs(values.expirationDate).format("YYYY-MM-DD HH:mm")
      : undefined;

    try {
      const token = (await TokenAPI.issueToken()).token;
      await PollAPI.createPoll({
        title,
        description,
        options,
        expirationDate: newExpirationDate,
        token,
      });
      navigate(`/poll/${token}`);
    } catch (err) {
      modals.open({
        title: "Error",
        children: <Text c="red">{String(err)}</Text>,
        centered: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading)
    return (
      <LoadingOverlay
        visible={true}
        zIndex={1000}
        overlayProps={{ radius: "sm", blur: 2 }}
      />
    );

  return (
    <form onSubmit={form.onSubmit(submit)}>
      <Flex direction="column" w="100%" gap={15}>
        <TextInput
          withAsterisk
          label="Title"
          placeholder="Title of the poll"
          {...form.getInputProps("title")}
        />
        <Textarea
          withAsterisk
          label="Description"
          placeholder="Description of the poll"
          autosize
          minRows={3}
          {...form.getInputProps("description")}
        />
        <DateTimePicker
          clearable={true}
          valueFormat="YYYY-MM-DD HH:mm"
          dropdownType="modal"
          label="Pick date and time"
          defaultValue={weekFromNow.toDate()}
          minDate={now.toDate()}
          {...form.getInputProps("expirationDate")}
        />
        <Flex w="100%" direction="column" gap={10}>
          <TextInput
            withAsterisk
            label="Options"
            placeholder="Options of the poll"
            ref={optionInputRef}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                addOption();
              }
            }}
            onChange={(e) => setOption(e.target.value)}
            value={option}
          />
          <Button w={150} mr={0} onClick={addOption} type="button">
            Add Option
          </Button>
        </Flex>
        {options.length > 0 && (
          <Flex gap={10} wrap="wrap" bg="gray" p={10}>
            {options.map((option, idx) => (
              <Button
                bg={colors[idx]}
                onClick={() => deleteOption(idx)}
                key={`${option}-${idx}`}
              >
                {option}
              </Button>
            ))}
          </Flex>
        )}
        <Button type="submit">Submit</Button>
      </Flex>
    </form>
  );
};

export default CreatePoll;
