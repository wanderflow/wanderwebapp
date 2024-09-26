import React, { useState } from "react";
import { Form, Input, Button, notification, Switch } from "antd";
import { createExpress, editExpress } from "@/api";
import { useLocation, useNavigate } from "react-router-dom";
const EditExpress = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const { search } = useLocation();
  const urlParams = new URLSearchParams(search);
  const params = Object.fromEntries(urlParams);
  console.log(params);

  const handleSubmit = async (values: any) => {
    setLoading(true);
    try {
      const res = await editExpress({
        ...params,
        ...values,
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
      initialValues={params}
      layout="vertical"
      onFinish={handleSubmit}
      className="w-1/3 m-auto mt-20"
    >
      <Form.Item
        name="new_express"
        label="Express Question"
        rules={[{ required: true, message: "Please input the question" }]}
      >
        <Input />
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit" loading={loading}>
          Submit
        </Button>
      </Form.Item>
    </Form>
  );
};

export default EditExpress;
