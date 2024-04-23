import { useNavigate, useParams } from "react-router-dom";
import {
  Flex,
  LoadingOverlay,
  Text,
  Title,
  Radio,
  Button,
} from "@mantine/core";
import { useMutation, useQuery } from "@tanstack/react-query";
import PollAPI from "../../api/PollAPI";
import { modals } from "@mantine/modals";
import { useState } from "react";
import dayjs from "dayjs";
import useVoteDisabledStore from "../../stores/VoteDisabledStore";
import { BarChart } from "@mantine/charts";
import "@mantine/charts/styles.css";
import { CiShare1 } from "react-icons/ci";

const Poll = () => {
  const navigate = useNavigate();
  const { token } = useParams();
  const [selected, setSelected] = useState<number | null>(null);
  const disabledList = useVoteDisabledStore((state) => state.disabled);
  const setDisabledList = useVoteDisabledStore((state) => state.setDisabled);
  const votesList = useVoteDisabledStore((state) => state.votes);
  const setVotesList = useVoteDisabledStore((state) => state.setVotes);
  const disabled = disabledList?.includes(token || "");
  const myVote = votesList?.find((vote) => vote.token === token);

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["readPoll", token],
    queryFn: () => {
      if (!token) return null;
      return PollAPI.readPoll(token);
    },

    refetchInterval: 3000,
  });

  const expired = data?.poll.expirationDate
    ? dayjs(data.poll.expirationDate).isBefore(dayjs())
      ? true
      : false
    : false;

  const voteData = data?.options.map((option) => ({
    Option: option.option,
    count: data.votes.filter((vote) => vote.optionID === option.id).length,
  }));

  const castVote = async () => {
    if (!setDisabledList || !setVotesList) return;
    if (!token) return;
    if (!selected) {
      modals.open({
        title: "Error",
        children: <Text c="red">Select your pick</Text>,
        centered: true,
      });
      return;
    }
    try {
      await PollAPI.castVote(selected);
      setDisabledList(token);
      setVotesList(token, selected);
      modals.open({
        title: "Vote Cast!",
        centered: true,
      });
      refetch();
    } catch (err) {
      modals.open({
        title: "Error",
        children: <Text c="red">{String(err)}</Text>,
        centered: true,
      });
    }
  };

  const mutation = useMutation({
    mutationFn: castVote,
  });

  const shareLink = async () => {
    const shareData = {
      title: `Voting App`,
      url: window.location.href,
    };

    if ("share" in navigator) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.error(err);
      }
    } else {
      modals.open({
        title: "Error",
        children: <Text c="red">Can't share on this device</Text>,
        centered: true,
      });
    }
  };

  if (isError) {
    modals.open({
      title: "Error",
      children: <Text c="red">Server error</Text>,
      centered: true,
    });
    navigate("/");
  }

  if (isLoading || !data || !token || mutation.isPending)
    return (
      <LoadingOverlay
        visible={true}
        zIndex={1000}
        overlayProps={{ radius: "sm", blur: 2 }}
      />
    );

  return (
    <Flex direction="column" gap={20}>
      <Flex align="center" gap={5}>
        <Title order={3}>{data?.poll.title}</Title>
        <Text c="blue" onClick={shareLink}>
          <CiShare1 />
        </Text>
      </Flex>
      <Text>{data.poll.description}</Text>
      <Title order={5}>Choose your pick!</Title>
      <Flex gap={20} wrap="wrap">
        {data.options.map((option) => (
          <Radio
            key={option.id}
            checked={option.id === selected || myVote?.optionID === option.id}
            onChange={() => setSelected(option.id)}
            label={option.option}
            disabled={disabled || expired}
            value={option.option}
          />
        ))}
      </Flex>
      <Button
        style={{ alignSelf: "end" }}
        w={100}
        onClick={() => mutation.mutate()}
        disabled={disabled || expired}
      >
        {disabled || expired ? "Done" : "Vote"}
      </Button>
      {data.poll.expirationDate && (
        <Text style={{ alignSelf: "end" }} c="blue">
          {expired
            ? `Expired at ${dayjs(data.poll.expirationDate).format(
                "YYYY-MM-DD HH:mm"
              )}`
            : `Expires at:
          ${dayjs(data.poll.expirationDate).format("YYYY-MM-DD HH:mm")}`}
        </Text>
      )}
      {voteData && (
        <BarChart
          h={200}
          data={voteData}
          dataKey="Option"
          orientation="vertical"
          yAxisProps={{ width: 80 }}
          barProps={{ radius: 10 }}
          series={[{ name: "count", color: "blue.6" }]}
          barChartProps={{ syncId: "tech" }}
        />
      )}
    </Flex>
  );
};

export default Poll;
