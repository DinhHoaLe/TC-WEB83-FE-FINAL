import React, { useEffect, useState } from "react";
import {
  SettingOutlined,
  ReloadOutlined,
  UserAddOutlined,
  CloseOutlined,
  SaveOutlined,
} from "@ant-design/icons";
import { Table, Tag, Button, Input, Space, Drawer, Form, Radio } from "antd";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";

const DanhSachViTriLamViec = () => {
  const [dataTeachersPositions, setDataTeachersPositions] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [form] = Form.useForm();

  const callApi = async () => {
    try {
      const req = await fetch("http://localhost:8080/teacher-positions", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (req.ok) {
        const res = await req.json();
        setDataTeachersPositions(res.data);
      } else {
        console.log("Call Api failed");
      }
    } catch (error) {
      console.log("error", error);
    }
  };

  useEffect(() => {
    callApi();
  }, []);

  const handleSearch = (value) => {
    setSearchText(value.toLowerCase());
  };

  const filteredData = dataTeachersPositions.filter((position) =>
    position.name.toLowerCase().includes(searchText)
  );

  const showDrawer = () => {
    setDrawerVisible(true);
  };

  const closeDrawer = () => {
    setDrawerVisible(false);
  };

  const handleSave = () => {
    form.validateFields().then(async (values) => {
      console.log(values)
      const req = await fetch("http://localhost:8080/teacher-positions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });
      if(req.ok){
        alert("tạo vị trí làm việc thành công!")
      }
      form.resetFields();
      setDrawerVisible(false);
      callApi();
    });
  };

  const columns = [
    {
      title: "STT",
      dataIndex: "index",
      key: "index",
      render: (_, __, index) => <div>{index + 1}</div>,
    },
    {
      title: "Mã",
      dataIndex: "code",
      key: "code",
      render: (code) => <div>{code}</div>,
    },
    {
      title: "Tên",
      dataIndex: "name",
      key: "name",
      render: (name) => <div>{name}</div>,
    },
    {
      title: "Trạng thái",
      dataIndex: "isActive",
      key: "isActive",
      render: (isActive) => (
        <Tag color={isActive ? "green" : "red"}>
          {isActive ? "Hoạt động" : "Không hoạt động"}
        </Tag>
      ),
    },
    {
      title: "Mô tả",
      dataIndex: "des",
      key: "des",
      render: (des) => <div>{des}</div>,
    },
    {
      title: "Hành động",
      key: "operation",
      render: (text, record) => (
        <Button
          icon={<SettingOutlined />}
          onClick={() => console.log("Settings for", record)}
        >
          Thiết lập
        </Button>
      ),
    },
  ];

  return (
    <div>
      <h2>Danh sách vị trí công tác</h2>
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          marginBottom: 16,
        }}
      >
        <Space>
          <Input.Search
            placeholder="Tìm kiếm thông tin"
            onSearch={handleSearch}
            enterButton
            style={{ width: 250 }}
          />
          <Button
            icon={<ReloadOutlined />}
            onClick={() => {
              setSearchText("");
              callApi();
            }}
          >
            Tải lại
          </Button>
          <Button
            type="primary"
            icon={<UserAddOutlined />}
            onClick={showDrawer}
          >
            Tạo mới
          </Button>
        </Space>
      </div>
      <Table
        columns={columns}
        dataSource={filteredData}
        rowKey={(record) => record._id}
        pagination={false}
        scroll={{ y: 950 }}
        sticky
      />
      <Drawer
        title="Vị trí công tác"
        width={400}
        onClose={closeDrawer}
        visible={drawerVisible}
        bodyStyle={{ paddingBottom: 80 }}
        extra={
          <Button onClick={closeDrawer} icon={<CloseOutlined />}>
            Đóng
          </Button>
        }
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="code"
            label="Mã"
            rules={[{ required: true, message: "Vui lòng nhập mã" }]}
          >
            <Input placeholder="Nhập mã" />
          </Form.Item>

          <Form.Item
            name="name"
            label="Tên"
            rules={[{ required: true, message: "Vui lòng nhập tên" }]}
          >
            <Input placeholder="Nhập tên" />
          </Form.Item>

          <Form.Item
            name="des"
            label="Mô tả"
            rules={[{ required: true, message: "Vui lòng nhập mô tả" }]}
          >
            <Input.TextArea placeholder="Nhập mô tả" rows={3} />
          </Form.Item>

          <Form.Item
            name="status"
            label="Trạng thái"
            rules={[{ required: true, message: "Vui lòng chọn trạng thái" }]}
          >
            <Radio.Group>
              <Radio.Button value="active">Hoạt động</Radio.Button>
              <Radio.Button value="inactive">Ngừng</Radio.Button>
            </Radio.Group>
          </Form.Item>

          <div style={{ textAlign: "right" }}>
            <Button
              type="primary"
              icon={<SaveOutlined />}
              onClick={handleSave}
              style={{ marginTop: 16 }}
            >
              Lưu
            </Button>
          </div>
        </Form>
      </Drawer>
      <ToastContainer />
    </div>
  );
};

export default DanhSachViTriLamViec;
