import React, { useEffect, useState } from "react";
import { Form, Input, Button, notification, Switch, Select } from "antd";
import { createExpress, getCollegeList, updateCollege } from "@/api";
import { useLocation, useNavigate } from "react-router-dom";

const EditCollege = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const { search } = useLocation();
  const [loading, setLoading] = useState(false);
  const urlParams = new URLSearchParams(search);
  const params = Object.fromEntries(urlParams);

  const handleSubmit = async (values: any) => {
    setLoading(true);
    try {
      const res = await updateCollege({
        ...params,
        ...values,
      });
      notification.success({
        message: "Success",
        description: "Success",
      });
      navigate("/internal/colleges");
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
        ...params,
      }}
      layout="vertical"
      onFinish={handleSubmit}
      className="w-1/3 m-auto mt-20"
    >
      <Form.Item
        name="display_name"
        label="Display Name"
        rules={[{ required: true, message: "Please input display name" }]}
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

export default EditCollege;
