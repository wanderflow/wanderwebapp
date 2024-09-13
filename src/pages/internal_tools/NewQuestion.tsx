import React, { useState } from "react";
import { Form, Input, Button, notification, Switch } from "antd";
import { createExpress } from "@/api";
import { useNavigate } from "react-router-dom";

const NewQuestion = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (values: any) => {
    setLoading(true);
    try {
      const res = await createExpress({
        ...values,
        add_to_today_list: values.add_to_today_list ? 1 : 0,
      });
      notification.success({
        message: "Success",
        description: "Success",
      });
      navigate("/edit");
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
      initialValues={{ add_to_today_list: false }}
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
        <Input />
      </Form.Item>
      <Form.Item name="add_to_today_list" label="Add to today's list">
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
