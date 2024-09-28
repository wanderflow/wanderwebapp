import React, { useEffect, useState } from "react";
import { Form, Input, Button, notification, Switch, Select } from "antd";
import { createExpress, getCollegeList } from "@/api";
import { useNavigate } from "react-router-dom";

const NewQuestion = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [typeOptions, setTypeOptions] = useState([
    {
      value: "General",
      label: "General",
    },
  ]);

  const [loading, setLoading] = useState(false);
  const init = async () => {
    const data: any = await getCollegeList();
    setTypeOptions((state) => {
      return state.concat(
        data.map(({ SK }: any) => ({
          value: SK.slice(1),
          label: SK.slice(1),
        }))
      );
    });
  };
  useEffect(() => {
    init();
  }, []);
  const handleSubmit = async (values: any) => {
    setLoading(true);
    try {
      const res = await createExpress({
        ...values,
        add_to_today_list: values.add_to_today_list ? 1 : 0,
        add_to_college_list: values.add_to_college_list ? 1 : 0,
      });
      notification.success({
        message: "Success",
        description: "Success",
      });
      navigate("/internal/express");
    } catch (e) {
      notification.warning({
        message: "Failed",
        description: "Failed",
      });
    }
    setLoading(false);
  };

  return (
    <Form
      form={form}
      initialValues={{
        add_to_today_list: false,
        add_to_college_list: false,
        type: "General",
      }}
      layout="vertical"
      onFinish={handleSubmit}
      className="w-1/3 m-auto mt-20"
    >
      <Form.Item
        name="express_question"
        label="Express Question"
        rules={[{ required: true, message: "Please input the question" }]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        name="topic"
        label="Topic"
        rules={[{ required: true, message: "Please input your topic" }]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        name="type"
        label="Type"
        rules={[{ required: true, message: "Please input the type" }]}
      >
        <Select
          // defaultValue="lucy"
          // style={{ width: 120 }}
          options={typeOptions}
        />
      </Form.Item>
      <Form.Item name="add_to_today_list" label="Add to today's list">
        <Switch />
      </Form.Item>
      <Form.Item name="add_to_college_list" label="Add to today's college list">
        <Switch />
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit" loading={loading}>
          Submit
        </Button>
      </Form.Item>
    </Form>
  );
};

export default NewQuestion;
