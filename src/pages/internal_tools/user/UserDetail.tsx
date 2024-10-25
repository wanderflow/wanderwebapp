import { getUserExpressions } from "@/api";
import { ChatHistory } from "@/types";
import { timeFormat } from "@/utils";
import { useQuery } from "@tanstack/react-query";
import { Table, Timeline } from "antd";
import { useEffect, useState } from "react";
import { UserOutlined, MessageOutlined } from "@ant-design/icons";
import { useParams, useSearchParams } from "react-router-dom";

const ChatHistoryRender = ({
  chatHistoires,
}: {
  chatHistoires: ChatHistory[];
}) => {
  return (
    <div className="flex gap-2 flex-col">
      {
        <Timeline
          items={chatHistoires.map((c) => ({
            children: (
              <div className="flex gap-2 flex-col">
                <div>{c.content}</div>

                {c.expression_media && (
                  <audio controls>
                    <source
                      src={c.expression_media.audioUrl}
                      type="audio/wav"
                    />
                  </audio>
                )}
              </div>
            ),
            dot: c.role === "ai" ? <MessageOutlined /> : <UserOutlined />,
          }))}
        />
      }
    </div>
  );
  // return "as";
};

const fetchData = async (userId: string) => {
  const res = await getUserExpressions({ user: `user#${userId}` });
  return res as any;
};
function UserDetail() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { userId } = useParams();
  const initialPage = parseInt(searchParams.get("page") || "1");
  const initialPageSize = parseInt(searchParams.get("page_size") || "10");
  const [page, setPage] = useState(initialPage);

  const [page_size, setPageSize] = useState(initialPageSize);
  const {
    data = [],
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["answer"],
    queryFn: () => fetchData(userId as string),
  });
  useEffect(() => {
    setSearchParams(
      {
        page: `${page}`,
        page_size: `${page_size}`,
      },
      { replace: true }
    );
  }, [page, page_size]);
  const columns = [
    {
      title: "Question",
      dataIndex: "express_question",
    },
    {
      title: "Answer",
      dataIndex: "expression_answer",
    },
    {
      title: "Chat history",
      dataIndex: "chat_history",
      render: (chatHistoires: ChatHistory[]) =>
        chatHistoires &&
        chatHistoires.length > 1 && (
          <ChatHistoryRender
            chatHistoires={chatHistoires.filter(
              (c) => typeof c.content == "string"
            )}
          />
        ),
    },
    {
      title: "Created At",
      dataIndex: "created_at",
      render: (text: string) => timeFormat(parseInt(text) * 1000),
    },
  ];
  if (error) return <p>Error fetching data</p>;

  const handleTableChange = (pagination: any) => {
    setPage(pagination.current);
    setPageSize(pagination.pageSize);
  };

  return (
    <div>
      <div className="flex mb-4 justify-between"></div>
      <Table
        columns={columns as any}
        dataSource={data || []}
        loading={isLoading}
        rowKey="SK"
        pagination={{
          current: page,
          pageSize: page_size,
          total: data?.length, // Total number of records (from API)
          showSizeChanger: true,
          pageSizeOptions: ["10", "20", "50", "1000"],
          showTotal: (total) => `Total: ${total}`,
        }}
        onChange={handleTableChange}
      />
    </div>
  );
}

export default UserDetail;
