import { useState, useEffect } from "react";
import { Table, Button, Modal, notification } from "antd";
import { useQuery } from "@tanstack/react-query";
// import axios from "axios";
import { ExclamationCircleFilled } from "@ant-design/icons";

import {
  dailyExpressList,
  deleteExpress,
  expressionsExpress,
  expressList,
  updateDailyList,
} from "@/api";
import {
  createSearchParams,
  useNavigate,
  useSearchParams,
} from "react-router-dom";

const fetchData: any = async (params: any) => {
  const response = await dailyExpressList(params);
  console.log(response);
  return response;
};

const DailyExpressList = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { confirm } = Modal;

  // Initialize page and pageSize from URL or default to 1 and 5
  const initialPage = parseInt(searchParams.get("page") || "1");
  const initialPageSize = parseInt(searchParams.get("page_size") || "10");

  const navigate = useNavigate();
  const [page, setPage] = useState(initialPage);
  const [page_size, setPageSize] = useState(initialPageSize);
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["dailyExpress"],
    queryFn: () => fetchData({}),
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
      title: "Type",
      dataIndex: "type",
      key: "type",
    },
    {
      title: "Topic",
      dataIndex: "topic",
      key: "topic",
    },
    {
      title: "Created At",
      dataIndex: "created_at",
      key: "created_at",
      render: (text: string) =>
        new Date(parseInt(text) * 1000).toLocaleString(),
    },
    {
      title: "Updated At",
      dataIndex: "updated_at",
      key: "updated_at",
      render: (text: string) =>
        new Date(parseInt(text) * 1000).toLocaleString(),
    },
    {
      title: "Creator",
      dataIndex: "creator",
      key: "creator",
      render: (text: string, { user_name }: any) => (
        <div>
          <div className="text-xs">{text}</div>
        </div>
      ),
    },
    {
      title: "Actions",
      dataIndex: "action",
      key: "action",
      render: (text: string, { PK, SK, express_question }: any) => (
        <div className="flex">
          <Button
            size="small"
            type="link"
            onClick={async () => {
              try {
                const newList = (data as any)
                  .map((d: any) => d.PK)
                  .filter((key: string) => key !== PK);
                await updateDailyList({
                  today_list: newList,
                });
                refetch();
                notification.success({
                  message: "Success",
                  description: "Success",
                });
              } catch (e) {
                notification.warning({
                  message: "Failed",
                  description: (e as any).msg,
                });
              }
            }}
          >
            Remove from daily
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
        dataSource={data || []}
        rowKey="PK"
        pagination={{
          current: page,
          pageSize: page_size,
          total: data?.length, // Total number of records (from API)
          showSizeChanger: true,
          pageSizeOptions: ["10", "20", "50", "1000"],
        }}
        onChange={handleTableChange}
      />
    </div>
  );
};

export default DailyExpressList;
