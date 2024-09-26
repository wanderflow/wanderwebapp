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
  const response = await expressList(params);
  console.log(response);
  return response;
};

const ExpressList = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { confirm } = Modal;
  const [dailyMap, setDailyMap] = useState<{ [key: string]: boolean }>({});

  const initialPage = parseInt(searchParams.get("page") || "1");
  const initialPageSize = parseInt(searchParams.get("page_size") || "10");
  const [dailyLoading, setDailyLoading] = useState(true);

  const navigate = useNavigate();
  const [page, setPage] = useState(initialPage);
  const [page_size, setPageSize] = useState(initialPageSize);
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["express"],
    queryFn: () => fetchData({}),
  });
  useEffect(() => {
    // Update URL search params when page or pageSize changes
    setSearchParams({ page: `${page}`, page_size: `${page_size}` });
  }, [page, page_size, setSearchParams]);
  const fetchDailyExpress = async () => {
    try {
      const data: any = await dailyExpressList();
      setDailyMap(
        data.reduce((acc: any, cur: any) => {
          acc[cur.PK] = true;
          return acc;
        }, {})
      );
    } catch (e) {}
    setDailyLoading(false);
  };
  useEffect(() => {
    fetchDailyExpress();
  }, []);
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
            onClick={() => {
              navigate({
                pathname: "/internal/editExpress",
                search: `?${createSearchParams({
                  express_pk: PK,
                  express_sk: SK,
                  new_express: express_question,
                })}`,
              });
            }}
          >
            Edit
          </Button>
          {PK && !dailyMap[PK] && (
            <Button
              size="small"
              type="link"
              onClick={async () => {
                try {
                  const newList = Object.keys(dailyMap).concat(PK);
                  await updateDailyList({
                    today_list: newList,
                  });
                  setDailyMap((state) => ({ ...state, [PK]: true }));
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
              Add to daily
            </Button>
          )}
          <Button
            size="small"
            type="link"
            danger
            onClick={() => {
              confirm({
                title: `Do you want to delete this question?`,
                icon: <ExclamationCircleFilled />,
                content: express_question,
                onOk: async () => {
                  try {
                    const res = await deleteExpress({
                      express_sk: SK,
                      express_pk: PK,
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
      <div className="flex mb-4 justify-end">
        <Button
          type="primary"
          onClick={() => {
            navigate("/internal/newExpress");
          }}
        >
          Create new Question
        </Button>
      </div>
      <Table
        columns={columns}
        loading={isLoading || dailyLoading}
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

export default ExpressList;
