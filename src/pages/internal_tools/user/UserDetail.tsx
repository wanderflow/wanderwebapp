import { deleteExpression, getUserExpressions } from "@/api";
import { ChatHistory } from "@/types";
import { timeFormat } from "@/utils";
import { useQuery } from "@tanstack/react-query";
import { Button, Modal, notification, Table, TableProps, Timeline } from "antd";
import { useEffect, useState } from "react";
import {
  UserOutlined,
  MessageOutlined,
  ExclamationCircleFilled,
} from "@ant-design/icons";
import { useParams, useSearchParams } from "react-router-dom";
import { useAuth } from "@/pages/AuthContext";

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
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

  const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
    console.log("selectedRowKeys changed: ", newSelectedRowKeys);
    setSelectedRowKeys(newSelectedRowKeys);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };
  const { confirm } = Modal;
  const { readonly } = useAuth();
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
  const batchDelete = () => {
    // console.log(selectedRowKeys);
    confirm({
      title: `Do you want to delete these answers?`,
      icon: <ExclamationCircleFilled />,
      content: `Total selecte:  ${selectedRowKeys.length}`,
      onOk: async () => {
        const res = await Promise.all(
          selectedRowKeys.map(async (key: any) => {
            const [expression_pk, expression_sk] = key.split(":");
            try {
              await deleteExpression({
                expression_pk,
                expression_sk,
              });
              return true;
            } catch (e) {
              return false;
            }
          })
        );
        let successCount = res.reduce((a, c) => a + (c ? 1 : 0), 0);
        if (successCount === 0) {
          notification.warning({
            message: "Failed",
            description: "Failed",
          });
        } else {
          notification.success({
            message: "Success",
            description: `Succeed: ${successCount}; \nFailed: ${
              res.length - successCount
            }`,
          });
        }
        setSelectedRowKeys([]);
        refetch();
      },
    });
  };

  return (
    <div>
      <div className="flex mb-4 justify-between">
        <div />
        {!readonly && (
          <Button
            danger
            type="primary"
            onClick={batchDelete}
            disabled={selectedRowKeys.length == 0}
          >
            Delete
          </Button>
        )}
      </div>
      <Table
        columns={columns as any}
        dataSource={data || []}
        rowSelection={readonly ? undefined : rowSelection}
        loading={isLoading}
        rowKey={({ expression_pk, expression_sk }) =>
          `${expression_pk}:${expression_sk}`
        }
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
