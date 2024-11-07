import { useState, useEffect, Children } from "react";
import { Table, Button, Modal, notification, Tabs, TabsProps } from "antd";
import { useQuery } from "@tanstack/react-query";
// import axios from "axios";
// const deepcopy = require("deepcopy");
// import * as deepcopy from "deepcopy";
function deepClone<T>(value: T): T {
  // Handle null or undefined
  if (value === null || typeof value !== "object") {
    return value;
  }

  // Handle Date
  if (value instanceof Date) {
    return new Date(value.getTime()) as T;
  }

  // Handle Array
  if (Array.isArray(value)) {
    return value.map((item) => deepClone(item)) as unknown as T;
  }

  // Handle Object
  if (value instanceof Object) {
    const result = {} as { [key: string]: any };
    for (const key in value) {
      if (Object.prototype.hasOwnProperty.call(value, key)) {
        result[key] = deepClone((value as { [key: string]: any })[key]);
      }
    }
    return result as T;
  }

  throw new Error("Unsupported data type");
}

import {
  dailyExpressList,
  getCollegeList,
  updateCollegeDailyList,
  updateDailyList,
} from "@/api";
import { Link, useSearchParams } from "react-router-dom";
import { timeFormat } from "@/utils";
import { useAuth } from "@/pages/AuthContext";

const _DailyExpressList = ({ fetchData, onRemove, sourceData }: any) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialPage = parseInt(searchParams.get("page") || "1");
  const initialPageSize = parseInt(searchParams.get("page_size") || "10");
  const [page, setPage] = useState(initialPage);
  const [page_size, setPageSize] = useState(initialPageSize);
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["dailyExpress"],
    queryFn: () => fetchData({}),
  });
  const { readonly } = useAuth();
  useEffect(() => {
    setSearchParams(
      (searchParams) => {
        searchParams.set("page", `${page}`);
        searchParams.set("page_size", `${page_size}`);
        return searchParams;
      },
      { replace: true }
    );
  }, [page, page_size]);
  if (error) return <p>Error fetching data</p>;
  const dataSource = sourceData || data;
  const columns = [
    {
      title: "Question",
      dataIndex: "express_question",
      key: "express_question",
      render: (text: string, { PK }: any) => {
        const link = `/internal/expression?express_pk=${encodeURIComponent(
          PK
        )}`;
        return <Link to={link}>{text}</Link>;
      },
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
      render: (text: string) => timeFormat(parseInt(text) * 1000),
    },
    {
      title: "Updated At",
      dataIndex: "updated_at",
      key: "updated_at",
      render: (text: string) => timeFormat(parseInt(text) * 1000),
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
                await onRemove(newList, PK);
                refetch();
                notification.success({
                  message: "Success",
                  description: "Success",
                });
              } catch (e) {
                console.log(e);
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
        columns={readonly ? columns.slice(0, -1) : columns}
        loading={isLoading}
        dataSource={dataSource || []}
        rowKey="PK"
        pagination={{
          current: page,
          pageSize: page_size,
          total: dataSource?.length || [], // Total number of records (from API)
          showSizeChanger: true,
          pageSizeOptions: ["10", "20", "50", "1000"],
          showTotal: (total) => `Total: ${total}`,
        }}
        onChange={handleTableChange}
      />
    </div>
  );
};

const fetchData: any = async (params: any) => {
  const response = await dailyExpressList(params);
  return response;
};
const DailyExpressList = () => {
  const [colleges, setCollege] = useState([]);
  const init = async () => {
    const data: any = await getCollegeList();
    setCollege(
      data.map(({ SK, today_list }: any) => ({
        SK,
        name: SK.slice(1),
        data: today_list,
      }))
    );
  };
  useEffect(() => {
    init();
  }, []);
  const [searchParams, setSearchParams] = useSearchParams();

  const items: TabsProps["items"] = [
    {
      key: "0",
      label: "General",
      children: (
        <_DailyExpressList
          fetchData={fetchData}
          onRemove={async (newList: any) => {
            await updateDailyList({
              today_list: newList,
            });
          }}
        />
      ),
    },
    ...colleges.map(({ SK, name, data }, idx) => ({
      key: idx + 1 + "",
      label: name,
      children: (
        <_DailyExpressList
          fetchData={() => {
            return data;
          }}
          sourceData={data}
          onRemove={async (newList: any, removedId: string) => {
            await updateCollegeDailyList({
              today_list: newList,
              college: SK,
            });
            let dist = deepClone(colleges);
            let targetCollege: any = dist.find((c: any) => c.SK == SK);
            if (targetCollege) {
              targetCollege.data = targetCollege.data.filter(
                (e: any) => e.PK !== removedId
              );
            }
            console.log(dist);
            setCollege(dist);
          }}
        />
      ),
    })),
  ];
  console.log(searchParams.get("tab"));
  return (
    <Tabs
      // defaultActiveKey={searchParams.get("tab") || ''}
      activeKey={searchParams.get("tab") || "0"}
      items={items}
      onTabClick={(t) => {
        console.log(t);
        setSearchParams({ tab: t });
      }}
      destroyInactiveTabPane={true}
    />
  );
};

export default DailyExpressList;
