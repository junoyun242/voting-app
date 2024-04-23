import { FC } from "react";
import { IComment } from "../../types/comment.types";
import { Paper, Text, Grid } from "@mantine/core";
import dayjs from "dayjs";

interface PropTypes {
  comment: IComment;
}

const Comment: FC<PropTypes> = ({ comment }) => {
  return (
    <Paper key={comment.id} shadow="xs" p="md" radius="lg" mb={10}>
      <Grid gutter="md">
        <Grid.Col span={10}>
          <div
            style={{ display: "flex", alignItems: "center", marginBottom: 10 }}
          >
            <Text size="sm" style={{ marginRight: 10, fontWeight: 500 }}>
              {comment.nickname}
            </Text>
            <Text size="xs" color="dimGray">
              {dayjs(comment.createdAt).format("YYYY-MM-DD HH:mm")}
            </Text>
          </div>
          <Text size="md" style={{ whiteSpace: "pre-wrap" }}>
            {comment.content}
          </Text>
        </Grid.Col>
      </Grid>
    </Paper>
  );
};

export default Comment;
