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
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import CreateComment from "../../components/comments/CreateComment";
import CommentAPI from "../../api/CommentAPI";
import { useDisclosure } from "@mantine/hooks";
import Comment from "../../components/comments/Comment";
import { useQueryClient } from "@tanstack/react-query";

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.tz.guess();

const Poll = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { token } = useParams();
  const [selected, setSelected] = useState<number | null>(null);
  const [opened, { open, close }] = useDisclosure(false);
  const disabledList = useVoteDisabledStore((state) => state.disabled);
  const setDisabledList = useVoteDisabledStore((state) => state.setDisabled);
  const votesList = useVoteDisabledStore((state) => state.votes);
  const setVotesList = useVoteDisabledStore((state) => state.setVotes);
  const disabled = disabledList?.includes(token || "");
  const myVote = votesList?.find((vote) => vote.token === token);

  const {
    data: pollData,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["readPoll", token],
    queryFn: () => {
      if (!token) return null;
      return PollAPI.readPoll(token);
    },
    refetchInterval: 3000,
  });

  const { data: commentData, isLoading: commentsIsLoading } = useQuery({
    queryKey: ["readComments", pollData?.poll.id],
    queryFn: () => {
      if (!pollData?.poll.id) return null;
      return CommentAPI.readComments(pollData.poll.id);
    },
    refetchInterval: 3000,
  });

  const expired = pollData?.poll.expirationDate
    ? dayjs(pollData.poll.expirationDate).isBefore(dayjs())
      ? true
      : false
    : false;

  const voteData = pollData?.options.map((option) => ({
    Option: option.option,
    count: pollData.votes.filter((vote) => vote.optionID === option.id).length,
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

  const pollMutation = useMutation({
    mutationFn: castVote,
  });

  const commentMutation = useMutation({
    mutationFn: (val: { pollID: number; content: string; nickname: string }) =>
      CommentAPI.createComment(val.pollID, val.content, val.nickname),
    onSuccess() {
      queryClient.invalidateQueries({ queryKey: ["readComments"] });
    },
  });

  const newComment = async (content: string, nickname: string) => {
    if (!pollData?.poll.id) return;
    await commentMutation.mutateAsync({
      pollID: pollData.poll.id,
      content,
      nickname,
    });
    close();
  };

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
    return <></>;
  }

  if (
    isLoading ||
    !pollData ||
    !token ||
    pollMutation.isPending ||
    commentMutation.isPending ||
    commentsIsLoading
  )
    return (
      <LoadingOverlay
        visible={true}
        zIndex={1000}
        overlayProps={{ radius: "sm", blur: 2 }}
      />
    );

  if (!pollData) {
    navigate("/");
    return <></>;
  }

  return (
    <Flex direction="column" gap={20}>
      <Flex align="center" gap={5}>
        <Title order={3}>{pollData?.poll.title}</Title>
        <Text c="blue" onClick={shareLink}>
          <CiShare1 />
        </Text>
      </Flex>
      <Text>{pollData.poll.description}</Text>
      <Title order={5}>Choose your pick!</Title>
      <Flex gap={20} wrap="wrap">
        {pollData.options.map((option) => (
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
        onClick={() => pollMutation.mutate()}
        disabled={disabled || expired}
      >
        {disabled || expired ? "Done" : "Vote"}
      </Button>
      {pollData.poll.expirationDate && (
        <Text style={{ alignSelf: "end" }} c="blue">
          {expired
            ? `Expired at ${dayjs(pollData.poll.expirationDate).format(
                "YYYY-MM-DD HH:mm"
              )}`
            : `Expires at:
          ${dayjs(pollData.poll.expirationDate).format("YYYY-MM-DD HH:mm")}`}
        </Text>
      )}
      <Text style={{ alignSelf: "end" }} c="green">
        Total Votes: {pollData.votes.length}
      </Text>
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
      <Flex direction="column" mb={50} gap={10}>
        <Title order={4}>Comments</Title>
        <Button w={150} style={{ alignSelf: "end" }} onClick={open}>
          New Comment
        </Button>
        <CreateComment opened={opened} mutationFn={newComment} close={close} />
      </Flex>
      <Flex direction="column">
        {commentData?.data.map((comment) => (
          <Comment comment={comment} key={comment.id} />
        ))}
      </Flex>
    </Flex>
  );
};

export default Poll;
