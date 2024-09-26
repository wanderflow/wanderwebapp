import { useState, useEffect } from "react";
import { Table, Button, Modal, notification } from "antd";
import { useQuery } from "@tanstack/react-query";
// import axios from "axios";
import { deleteExpression, expressionsExpress } from "@/api";
import { useSearchParams } from "react-router-dom";
import { ExclamationCircleFilled } from "@ant-design/icons";

const fetchData: any = async (params: any) => {
  const response = await expressionsExpress(params);
  console.log(response);
  return response;
};

const ExpressionTable = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { confirm } = Modal;
  // Initialize page and pageSize from URL or default to 1 and 5
  const initialPage = parseInt(searchParams.get("page") || "1");
  const initialPageSize = parseInt(searchParams.get("page_size") || "10");

  const [page, setPage] = useState(initialPage);
  const [page_size, setPageSize] = useState(initialPageSize);
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["expressions", { page, page_size }],
    queryFn: () => fetchData({ page, page_size }),
  });
  useEffect(() => {
    // Update URL search params when page or pageSize changes
    setSearchParams({ page: `${page}`, page_size: `${page_size}` });
  }, [page, page_size, setSearchParams]);
  if (error) return <p>Error fetching data</p>;

  const columns = [
    {
      title: "Question",
      dataIndex: "express_question",
      key: "express_question",
    },
    {
      title: "Answer",
      dataIndex: "expression_answer",
      key: "expression_answer",
    },
    {
      title: "Created By AI",
      dataIndex: "type",
      key: "type",
      render: (text?: string) => (
        <div className={text ? "text-sky-500" : "text-rose-500"}>
          {text ? "YES" : "NO"}
        </div>
      ),
    },
    {
      title: "Creator",
      dataIndex: "creator",
      key: "creator",
      render: (text: string, { user_name }: any) => (
        <div>
          <div className="text-xs font-bold">{user_name}</div>
          <div className="text-xs">{text}</div>
        </div>
      ),
    },
    {
      title: "College",
      dataIndex: "college",
      key: "college",
    },
    {
      title: "Tag",
      dataIndex: "tag",
      key: "tag",
    },
    {
      title: "Created At",
      dataIndex: "created_at",
      key: "created_at",
      render: (text: string) =>
        new Date(parseInt(text) * 1000).toLocaleString(),
    },
    {
      title: "Actions",
      dataIndex: "action",
      key: "action",
      render: (text: string, { PK_x, SK_x, express_question }: any) => (
        <div className="flex">
          <Button
            size="small"
            type="link"
            danger
            onClick={() => {
              confirm({
                title: `Do you want to delete this answer?`,
                icon: <ExclamationCircleFilled />,
                content: express_question,
                onOk: async () => {
                  try {
                    const res = await deleteExpression({
                      expression_pk: PK_x,
                      expression_sk: SK_x,
                    });

                    notification.success({
                      message: "Success",
                      description: "Success",
                    });
                    refetch();
                  } catch (e) {
                    notification.warning({
                      message: "Failed",
                      description: (e as any).msg,
                    });
                  }
                },
                onCancel() {
                  console.log("Cancel");
                },
              });
            }}
          >
            Delete
          </Button>
        </div>
      ),
    },
  ];
  const handleTableChange = (pagination: any) => {
    setPage(pagination.current);
    setPageSize(pagination.pageSize);
  };

  return (
    <div>
      <Table
        columns={columns}
        loading={isLoading}
        dataSource={data?.data || []}
        rowKey="PK_x"
        pagination={{
          current: page,
          pageSize: page_size,
          total: data?.total_items || 0, // Total number of records (from API)
          showSizeChanger: true,
          pageSizeOptions: ["10", "20", "50"],
        }}
        onChange={handleTableChange}
      />
    </div>
  );
};

export default ExpressionTable;
