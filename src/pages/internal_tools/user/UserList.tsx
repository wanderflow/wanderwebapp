import { useState, useEffect } from "react";
import { Input, message, Table } from "antd";
import { useQuery } from "@tanstack/react-query";

import { getUser } from "@/api";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { timeFormat, timeFormatDate } from "@/utils";
const fetchData: any = async (params: any) => {
  const response: any = await getUser(params);
  return response;
};

const UserList = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const initialPage = parseInt(searchParams.get("page") || "1");
  const initialPageSize = parseInt(searchParams.get("page_size") || "10");
  const initialSearchWord = searchParams.get("search_word") || "";
  const [search_word, setSearchword] = useState(initialSearchWord);
  const [page, setPage] = useState(initialPage);
  const [messageApi, contextHolder] = message.useMessage();

  const [page_size, setPageSize] = useState(initialPageSize);
  const {
    data = {},
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["users", { page, page_size, search_word }],
    queryFn: () => fetchData({ page, page_size, query: search_word }),
    enabled: search_word.length == 0 || search_word.length > 2,
  });
  useEffect(() => {
    setSearchParams(
      {
        page: `${page}`,
        page_size: `${page_size}`,
        search_word,
      },
      { replace: true }
    );
  }, [page, page_size, search_word]);
  if (error) return <p>Error fetching data</p>;

  const columns = [
    {
      title: "Name",
      key: "name",
      render: (
        _: any,
        { first_name, username, image_url, email_addresses, id }: any
      ) => (
        <Link to={`/internal/users/${id}`}>
          <div className="flex gap-2 items-center">
            <img
              src={image_url}
              style={{ width: 36, height: 36, borderRadius: 36 }}
            />
            <div>
              <div className="font-semibold">{first_name || username}</div>
              <div className="text-slate-500">
                {email_addresses[0]?.email_address}
              </div>
            </div>
          </div>
        </Link>
      ),
    },
    {
      title: "ID",
      dataIndex: "id",
      render: (id: string) => (
        <div
          className="cursor-pointer"
          onClick={() => {
            messageApi.open({
              type: "success",
              content: "ID has copied",
            });
            navigator.clipboard.writeText(`user#${id}`);
          }}
        >{`user#${id}`}</div>
      ),
    },
    {
      title: "Gender",
      key: "gender",
      render: (_: any, { unsafe_metadata }: any) => unsafe_metadata?.gender,
    },
    {
      title: "Date of birth",
      key: "dob",
      render: (_: any, { unsafe_metadata }: any) =>
        unsafe_metadata?.dob ? timeFormatDate(unsafe_metadata?.dob) : "",
    },
    {
      title: "Last Active",
      key: "last_active_at",
      dataIndex: "last_active_at",
      render: (val: number) => timeFormat(val),
    },
  ];
  const handleTableChange = (pagination: any) => {
    setPage(pagination.current);
    setPageSize(pagination.pageSize);
  };

  return (
    <div>
      {contextHolder}
      <div className="flex mb-4 justify-between">
        <div className="w-1/5">
          <Input
            placeholder="Enter at least 3 characters to query"
            value={search_word}
            onChange={(e) => {
              setSearchword(e.target.value);
              setPage(1);
            }}
          />
        </div>
      </div>
      <Table
        columns={columns as any}
        loading={isLoading}
        dataSource={data.users || []}
        rowKey="PK"
        pagination={{
          current: page,
          pageSize: page_size,
          total: data.total, // Total number of records (from API)
          showSizeChanger: true,
          pageSizeOptions: ["10", "20", "50", "1000"],
          showTotal: (total) => `Total: ${total}`,
        }}
        onChange={handleTableChange}
      />
    </div>
  );
};

export default UserList;
