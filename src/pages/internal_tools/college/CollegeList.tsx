import { useState, useEffect } from "react";
import { Table, Button, Modal, notification, Input, Checkbox } from "antd";
import { useQuery } from "@tanstack/react-query";
import { Tag } from "antd";

import dayjs from "dayjs";
import { ExclamationCircleFilled } from "@ant-design/icons";
import Highlighter from "react-highlight-words";

import {
  approveUserQuestion,
  createExpress,
  dailyExpressList,
  deleteExpress,
  expressList,
  getCollegeDisplayList,
  getCollegeList,
  updateCollegeDailyList,
  updateDailyList,
} from "@/api";
import {
  createSearchParams,
  Link,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import { timeFormat } from "@/utils";
import { title } from "process";
const fetchData: any = async () => {
  const response: any = await getCollegeDisplayList();
  return response.map((m: any) => ({
    ...m,
    // isUserQuestion: m.PK.startsWith("user_express#"),
  }));
};

const ExpressList = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { confirm } = Modal;
  const [dailyMap, setDailyMap] = useState<{
    [key: string]: { [key: string]: boolean };
  }>({});

  const initialPage = parseInt(searchParams.get("page") || "1");
  const initialPageSize = parseInt(searchParams.get("page_size") || "10");
  const initCat = searchParams.get("category");
  const [dailyLoading, setDailyLoading] = useState(true);
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const navigate = useNavigate();
  const [page, setPage] = useState(initialPage);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [category, setCategory] = useState(
    // searchParams.get("category") == "unapproved" ? "" : "all"
    initCat == "unapproved" ? initCat : "all"
  );
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
    setSearchParams(
      {
        page: `${page}`,
        page_size: `${page_size}`,
        search,
        category,
      },
      { replace: true }
    );
  }, [page, page_size, search, category]);
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
      title: "Name",
      key: "college_name",
      dataIndex: "college_name",
    },
    {
      title: "Display Name",
      key: "display_name",
      dataIndex: "display_name",
    },
    {
      title: "Actions",
      dataIndex: "action",
      key: "action",
      render: (text: string, { college_name, display_name }: any) => {
        return (
          <div className="flex">
            <Button
              size="small"
              type="link"
              onClick={() => {
                navigate({
                  pathname: "/internal/editCollege",
                  search: `?${createSearchParams({
                    college_name,
                    display_name,
                  })}`,
                });
              }}
            >
              Edit
            </Button>
          </div>
        );
      },
    },
  ];
  const handleTableChange = (pagination: any) => {
    setPage(pagination.current);
    setPageSize(pagination.pageSize);
  };

  return (
    <div>
      <Table
        columns={columns as any}
        loading={isLoading}
        dataSource={data || []}
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
