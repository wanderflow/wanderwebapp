import { useState, useEffect } from "react";
import { Table, Button, Modal, notification, Input, Checkbox } from "antd";
import { useQuery } from "@tanstack/react-query";
// import axios from "axios";
import dayjs from "dayjs";
import { ExclamationCircleFilled } from "@ant-design/icons";
import Highlighter from "react-highlight-words";

import {
  dailyExpressList,
  deleteExpress,
  expressionsExpress,
  expressList,
  getCollegeList,
  updateCollegeDailyList,
  updateDailyList,
} from "@/api";
import {
  createSearchParams,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import { timeFormat } from "@/utils";

const fetchData: any = async (params: any) => {
  const response = await expressList(params);
  return response;
};

const ExpressList = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { confirm } = Modal;
  const [dailyMap, setDailyMap] = useState<{
    [key: string]: { [key: string]: boolean };
  }>({});

  const initialPage = parseInt(searchParams.get("page") || "1");
  const initialPageSize = parseInt(searchParams.get("page_size") || "10");
  const [dailyLoading, setDailyLoading] = useState(true);
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const navigate = useNavigate();
  const [page, setPage] = useState(initialPage);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentModalObj, setCurrentModalObj] = useState<{
    id: string;
    question: string;
  }>();

  const [page_size, setPageSize] = useState(initialPageSize);
  const {
    data = [],
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["express"],
    queryFn: () => fetchData({}),
  });
  useEffect(() => {
    // Update URL search params when page or pageSize changes
    setSearchParams({ page: `${page}`, page_size: `${page_size}`, search });
  }, [page, page_size, setSearchParams, search]);
  const fetchDailyExpress = async () => {
    try {
      const data: any = await dailyExpressList();
      setDailyMap((state) => ({
        ...state,
        GENERAL: data.reduce((acc: any, cur: any) => {
          acc[cur.PK] = true;
          return acc;
        }, {}),
      }));
    } catch (e) {}
  };

  const fetchDailyCollegeExpress = async () => {
    try {
      const data: any = await getCollegeList();
      const map = data.reduce((acc: any, cur: any) => {
        acc[cur.SK] = cur.today_list.reduce((acc: any, cur: any) => {
          acc[cur.PK] = true;
          return acc;
        }, {});
        return acc;
      }, {});
      setDailyMap((state) => ({ ...state, ...map }));
    } catch (e) {
      console.log(e);
    }
    setDailyLoading(false);
  };
  const init = async () => {
    await Promise.all([fetchDailyExpress(), fetchDailyCollegeExpress()]);
    setDailyLoading(false);
  };
  useEffect(() => {
    init();
  }, []);
  if (error) return <p>Error fetching data</p>;

  const columns = [
    {
      title: "Question",
      dataIndex: "express_question",
      key: "express_question",
      render: (text: string) => {
        if (search) {
          return (
            <Highlighter
              highlightStyle={{ backgroundColor: "#ffc069", padding: 0 }}
              searchWords={[search]}
              autoEscape
              textToHighlight={text ? text.toString() : ""}
            />
          );
        }
        return text;
      },
    },
    {
      title: "Type",
      dataIndex: "type",
      key: "type",
      filters: [...new Set(data.map((d: any) => d.type))].map((key) => ({
        text: key,
        value: key,
      })),
      onFilter: (value: any, record: any) => {
        return record.type === value;
      },
    },
    {
      title: "Topic",
      dataIndex: "topic",
      key: "topic",
      filters: [...new Set(data.map((d: any) => d.topic))].map((key) => ({
        text: key,
        value: key,
      })),
      onFilter: (value: any, record: any) => {
        return record.topic === value;
      },
    },
    {
      title: "Created At",
      dataIndex: "created_at",
      key: "created_at",
      sorter: (a: any, b: any) => {
        return dayjs(parseInt(a.created_at) * 1000).isBefore(
          parseInt(b.created_at) * 1000
        )
          ? -1
          : 1;
      },
      render: (text: string) => timeFormat(parseInt(text) * 1000),
    },
    {
      title: "Updated At",
      dataIndex: "updated_at",
      key: "updated_at",
      sorter: (a: any, b: any) => {
        return dayjs(parseInt(a.updated_at) * 1000).isBefore(
          parseInt(b.updated_at) * 1000
        )
          ? -1
          : 1;
      },
      render: (text: string) => timeFormat(parseInt(text) * 1000),
    },
    {
      title: "Creator",
      dataIndex: "creator",
      key: "creator",
      filters: [...new Set(data.map((d: any) => d.creator))].map((key) => ({
        text: key,
        value: key,
      })),
      render: (text: string) => (
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
          {PK && (
            <Button
              size="small"
              type="link"
              onClick={async () => {
                setIsModalOpen(true);
                setCurrentModalObj({
                  id: PK,
                  question: express_question,
                });
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
      <div className="flex mb-4 justify-between">
        <div className="w-1/5">
          <Input
            placeholder="Search for question"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
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
        columns={columns as any}
        loading={isLoading || dailyLoading}
        dataSource={(data || []).filter(({ express_question }: any) =>
          express_question
            .toLocaleLowerCase()
            .includes(search.toLocaleLowerCase())
        )}
        rowKey="PK"
        pagination={{
          current: page,
          pageSize: page_size,
          // total: data?.length, // Total number of records (from API)
          showSizeChanger: true,
          pageSizeOptions: ["10", "20", "50", "1000"],
        }}
        onChange={handleTableChange}
      />
      <Modal
        title="Add to daily question"
        open={isModalOpen}
        destroyOnClose
        footer={null}
        onCancel={() => {
          setIsModalOpen(false);
        }}
      >
        <EditDaily
          id={currentModalObj?.id}
          dailyMap={dailyMap}
          question={currentModalObj?.question}
          onSubmit={async (added: string[], removed: string[]) => {
            if (added.length != 0 || removed.length != 0) {
              const key = currentModalObj?.id || "";
              const addMap = added.reduce((acc: any, cur: any) => {
                acc[cur] = { ...dailyMap[cur], [key]: true };
                return acc;
              }, {});
              const removeMap = removed.reduce((acc: any, cur: any) => {
                let obj = { ...dailyMap[cur] };
                delete obj[key];
                acc[cur] = obj;
                return acc;
              }, {});
              const obj = { ...addMap, ...removeMap };
              try {
                await Promise.all(
                  Object.keys(obj).map(async (key) => {
                    if (key === "GENERAL") {
                      return await updateDailyList({
                        today_list: Object.keys(obj[key]),
                      });
                    } else {
                      return await updateCollegeDailyList({
                        today_list: Object.keys(obj[key]),
                        college: key,
                      });
                    }
                  })
                );
                setDailyMap((state) => ({ ...state, ...obj }));
                notification.success({
                  message: "Success",
                  description: "Success",
                });
                setIsModalOpen(false);
              } catch (e) {
                notification.warning({
                  message: "Failed",
                  description: (e as any).msg,
                });
              }

              // console.log(addMap, removeMap);
            }
          }}
        />
      </Modal>
    </div>
  );
};

const EditDaily = ({ id, dailyMap, question, onSubmit }: any) => {
  const options = Object.keys(dailyMap).map((key) => ({
    label: key.startsWith("#") ? key.slice(1) : key,
    value: key,
  }));
  const defaultValue = options
    .map((option) => option.value)
    .filter((key) => dailyMap[key][id]);
  const [value, setValue] = useState(defaultValue);
  return (
    <div>
      <div className="text-lg mb-3">{question}</div>
      <Checkbox.Group options={options} value={value} onChange={setValue} />
      <div className="flex mt-6">
        <Button
          type="primary"
          onClick={() => {
            const oldSet = new Set(defaultValue);
            const newSet = new Set(value);
            const added = value.filter((v) => !oldSet.has(v));
            const removed = defaultValue.filter((v) => !newSet.has(v));
            onSubmit(added, removed);
          }}
        >
          Submit
        </Button>
      </div>
    </div>
  );
};

export default ExpressList;
