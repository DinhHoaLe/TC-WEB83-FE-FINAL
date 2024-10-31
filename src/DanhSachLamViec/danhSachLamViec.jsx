import React, { useEffect, useState } from "react";
import {
  EyeOutlined,
  ReloadOutlined,
  UserAddOutlined,
  CloseOutlined,
  SaveOutlined,
} from "@ant-design/icons";
import {
  Table,
  Tag,
  Button,
  Input,
  Space,
  Drawer,
  Form,
  DatePicker,
  Select,
  Upload,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import avatar from "../img/avatar2.jpg";
import { useNavigate } from "react-router-dom";
const { Option } = Select;
const DanhSachLamViec = () => {
  const [dataTeachers, setDataTeachers] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [position, setPosition] = useState("");
  const [DOB, setDOB] = useState("");
  const [form] = Form.useForm();

  const callApi = async () => {
    try {
      const req = await fetch("http://localhost:8080/teachers", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (req.ok) {
        const res = await req.json();
        setDataTeachers(res.data);
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

  const filteredData = dataTeachers.filter((teacher) =>
    teacher.userId?.name.toLowerCase().includes(searchText)
  );

  const educationColumns = [
    {
      title: "Bậc",
      dataIndex: "degree",
      key: "degree",
    },
    {
      title: "Trường",
      dataIndex: "school",
      key: "school",
    },
    {
      title: "Chuyên ngành",
      dataIndex: "major",
      key: "major",
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
    },
    {
      title: "Tốt nghiệp",
      dataIndex: "graduated",
      key: "graduated",
    },
  ];

  const columns = [
    {
      title: "Mã",
      dataIndex: "code",
      key: "code",
      render: (code) => <div>{code}</div>,
    },
    {
      title: "Giáo viên",
      key: "teacher",
      render: (_, record) => (
        <div style={{ display: "flex", alignItems: "center" }}>
          <img
            src={record.userId?.avatar || avatar}
            alt="avatar"
            style={{
              width: 40,
              height: 40,
              borderRadius: "50%",
              marginRight: 8,
            }}
          />
          <div>
            <div>{record.userId?.name || "Không có tên"}</div>
            <div style={{ color: "gray" }}>
              {record.userId?.email || "Không có email"}
            </div>
            <div style={{ color: "gray" }}>
              {record.userId?.phoneNumber || "Không có SĐT"}
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "Trình độ (cao nhất)",
      dataIndex: "degrees",
      key: "degrees",
      render: (degrees) =>
        Array.isArray(degrees) && degrees.length > 0 ? (
          <div>
            <div>{degrees[0].type || "N/A"}</div>
            <div style={{ color: "gray" }}>
              Chuyên ngành: {degrees[0].major || "N/A"}
            </div>
          </div>
        ) : (
          "Không có trình độ học vấn"
        ),
    },
    {
      title: "TT Công tác",
      dataIndex: "teacherPositionsId",
      key: "teacherPositionsId",
      render: (position) => (
        <div>{position?.name || "Không có vị trí công tác"}</div>
      ),
    },
    {
      title: "Địa chỉ",
      dataIndex: ["userId", "address"],
      key: "address",
      render: (_, record) => (
        <div>{record.userId?.address || "Không có địa chỉ"}</div>
      ),
    },
    {
      title: "Trạng thái",
      dataIndex: "isActive",
      key: "isActive",
      render: (isActive) => (
        <Tag color={isActive ? "green" : "red"}>
          {isActive ? "Đang công tác" : "Không hoạt động"}
        </Tag>
      ),
    },
    {
      title: "Hành động",
      key: "operation",
      render: (text, record) => (
        <Space>
          <EyeOutlined style={{ fontSize: 18 }} />
          <span>Chi tiết</span>
        </Space>
      ),
    },
  ];

  const showDrawer = () => {
    setDrawerVisible(true);
  };

  const closeDrawer = () => {
    setDrawerVisible(false);
    form.resetFields();
  };

  const handleSave = () => {
    form.validateFields().then(async (values) => {
      console.log(values);
      const req = await fetch("http://localhost:8080/teachers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...values,
          position: position,
          DOB: DOB.toString(),
        }),
      });
      if (req.ok) {
        alert("thêm giáo viên thành công!");
      }
        form.resetFields();
        setDrawerVisible(false);
        callApi();
    });
  };

  return (
    <div>
      <h2>Danh sách giáo viên</h2>
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
        scroll={{ x: true, y: 950 }}
        sticky
      />

      <Drawer
        title="Tạo thông tin giáo viên"
        width={600}
        onClose={closeDrawer}
        visible={drawerVisible}
        extra={
          <Button onClick={closeDrawer} icon={<CloseOutlined />}>
            Đóng
          </Button>
        }
      >
        <div className="p-8 bg-white rounded-lg shadow-md">
          <h2 className="text-xl font-bold mb-4">Tạo thông tin giáo viên</h2>
          <div className="flex space-x-8">
            <div className="w-1/4 flex flex-col items-center">
              <img
                src="https://via.placeholder.com/150"
                alt="Avatar"
                className="w-36 h-36 rounded-full mb-4"
              />
              <Upload>
                <Button icon={<UploadOutlined />}>Upload file</Button>
              </Upload>
            </div>

            <div className="flex-1">
              <Form form={form} layout="vertical">
                <h3 className="font-semibold mb-2">Thông tin cá nhân</h3>
                <div className="grid grid-cols-2 gap-4">
                  <Form.Item
                    name="name"
                    label="Họ và tên"
                    rules={[
                      { required: true, message: "Vui lòng nhập họ và tên" },
                    ]}
                  >
                    <Input placeholder="VD: Nguyễn Văn A" />
                  </Form.Item>
                  <Form.Item
                    name="dob"
                    label="Ngày sinh"
                    rules={[
                      { required: true, message: "Vui lòng chọn ngày sinh" },
                    ]}
                  >
                    <DatePicker
                      style={{ width: "100%" }}
                      placeholder="Chọn ngày sinh"
                      onChange={(value) => setDOB(value)}
                    />
                  </Form.Item>
                  <Form.Item
                    name="phoneNumber"
                    label="Số điện thoại"
                    rules={[
                      {
                        required: true,
                        message: "Vui lòng nhập số điện thoại",
                      },
                    ]}
                  >
                    <Input placeholder="Nhập số điện thoại" />
                  </Form.Item>
                  <Form.Item
                    name="email"
                    label="Email"
                    rules={[{ required: true, message: "Vui lòng nhập email" }]}
                  >
                    <Input placeholder="example@school.edu.vn" />
                  </Form.Item>
                  <Form.Item
                    name="identity"
                    label="Số CCCD"
                    rules={[
                      { required: true, message: "Vui lòng nhập số CCCD" },
                    ]}
                  >
                    <Input placeholder="Nhập số CCCD" />
                  </Form.Item>
                  <Form.Item
                    name="address"
                    label="Địa chỉ"
                    rules={[
                      { required: true, message: "Vui lòng nhập địa chỉ" },
                    ]}
                  >
                    <Input placeholder="Địa chỉ thường trú" />
                  </Form.Item>
                </div>
              </Form>
            </div>
          </div>

          <h3 className="font-semibold mt-6 mb-2">Thông tin công tác</h3>
          <Form.Item
            name="codePosition"
            label="Vị trí công tác"
            rules={[
              { required: true, message: "Vui lòng chọn vị trí công tác" },
            ]}
          >
            <Select
              placeholder="Chọn các vị trí công tác"
              onChange={(value) => setPosition(value)}
            >
              <Option value="TTS">TTS</Option>
              <Option value="GVBM">GVBM</Option>
              <Option value="TBM">TBM</Option>
              <Option value="HT">HT</Option>
              <Option value="HP">HP</Option>
              <Option value="CBYT">CBYT</Option>
            </Select>
          </Form.Item>

          <h3 className="font-semibold mt-6 mb-2">Học vị</h3>
          <Button type="dashed" style={{ marginBottom: 16 }}>
            Thêm
          </Button>
          <Table
            columns={educationColumns}
            dataSource={[]}
            pagination={false}
            locale={{ emptyText: <div className="text-center">Trống</div> }}
          />

          {/* Save Button */}
          <div className="flex justify-end mt-4">
            <Button
              type="primary"
              icon={<SaveOutlined />}
              onClick={handleSave}
              style={{ marginTop: 16 }}
            >
              Lưu
            </Button>
          </div>
        </div>
      </Drawer>
      <ToastContainer />
    </div>
  );
};

export default DanhSachLamViec;
