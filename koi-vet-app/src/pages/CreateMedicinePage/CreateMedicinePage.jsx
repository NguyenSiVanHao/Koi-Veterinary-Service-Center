import { Form, Input, message, Select, Table } from 'antd'
import React, { useEffect, useState } from 'react'
import { Button, Col, Container, Row } from 'react-bootstrap'
import { createMedicineAPI, deleteMedicineByIdAPI, fetchMedicinesAPI } from '../../apis';
import './CreateMedicinePage.css';
import TextArea from 'antd/es/input/TextArea';

function CreateMedicinePage() {
    const [newMedicineData, setNewMedicineData] = useState({
        name: "",
        description: "",
        medUnit: "",
      });
      const [availableMedicines, setAvailableMedicines] = useState([]);
      const [isCreating, setIsCreating] = useState(false);


  // Mở form tạo thuốc
  const handleOpenCreateMedicineForm = () => {
    setIsCreating(true);
  };
    
      const handleCloseCreateMedicineForm = () => {
        setIsCreating(false);
        setNewMedicineData({ name: "", description: "", medUnit: "" });
      };

  // Xử lý thay đổi dữ liệu trong form
  const handleNewMedicineInputChange = (field, value) => {
    setNewMedicineData((prev) => ({ ...prev, [field]: value }));
  };

  // Gọi API để tạo thuốc mới
  const handleCreateMedicine = async () => {
    const { name, description, medUnit } = newMedicineData;

    if (!name || !description || !medUnit) {
      message.error("Please fill in all fields.");
      return;
    }

    try {
      await createMedicineAPI(newMedicineData); // Gọi API để tạo thuốc
      message.success("Medicine created successfully.");

      // Cập nhật lại danh sách thuốc
      const updatedMedicines = await fetchMedicinesAPI();
      setAvailableMedicines(updatedMedicines.data || []);

      handleCloseCreateMedicineForm(); // Đóng form sau khi tạo thành công
    } catch (error) {
      message.error("Failed to create medicine.");
    }
  };

  useEffect(() => {
  const fetchMedicines = async () => {
      const response = await fetchMedicinesAPI();
      setAvailableMedicines(response.data || []);
    };
    fetchMedicines();
  }, []);

  const handleDeleteMedicine = async (medicineId) => {
    await deleteMedicineByIdAPI(medicineId);
    const updatedMedicines = await fetchMedicinesAPI();
    setAvailableMedicines(updatedMedicines.data || []);
  };

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      width: '200',
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      width: '300',
      ellipsis: true,
    },
    {
      title: "Unit",
      dataIndex: "medUnit",
      key: "medUnit",
      width: '100',
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <button onClick={() => handleDeleteMedicine(record.medicineId)} className="btn btn-sm btn-outline-danger">Delete</button>
      )
    }
  ];
  return (
    <>
    <Container className='mt-4'>
    <h1 >Medicine List</h1>
    <div className="row">
        <div className="col">
          <div className="card border-0 shadow-sm">
            <div className="card-body">
              <div className="table-responsive">
    <Table dataSource={availableMedicines} columns={columns} 
        pagination={{
        pageSize: 7,
        showSizeChanger: false, // Ẩn tùy chọn thay đổi số lượng trên mỗi trang
      }} />
      </div>
            </div>
          </div>
        </div>
      </div>

<div className="card p-4" style={{borderRadius: '10px', width: '70%'}}> 
<div className="row mb-4">
        <div className="col">
          <div className="card bg-light border-0 shadow-sm">
            <div className="card-body d-flex justify-content-between align-items-center">
              <div>
                
                <p className="text-muted mb-0">Create new medicine to add to the list</p>
              </div>
              <button 
                className="btn btn-primary d-flex align-items-center gap-2"
                onClick={() => setIsCreating(true)}
                style={{ display: isCreating ? 'none' : 'flex' }}
              >
                <i className="bi bi-plus-circle"></i>
                Add Medicine
              </button>
            </div>
          </div>
        </div>
      </div>


        {isCreating && (
        <Row className="mt-4">
          <Col md={12}>
          <div className="card border-0 shadow-sm">
              <div className="card-body">
          <h5 className="card-title mb-4">Create New Medicine</h5>
            <Form>
              <Form.Item label="Medicine Name" required>
                <Input
                  placeholder="Enter medicine name"
                  value={newMedicineData.name}
                  onChange={(e) =>
                    handleNewMedicineInputChange("name", e.target.value)
                  }
                />
              </Form.Item>

              <Form.Item label="Description" required>
              <TextArea
                    className="custom-textarea"
                    placeholder="Enter description"
                    value={newMedicineData.description}
                    onChange={(e) =>
                        handleNewMedicineInputChange("description", e.target.value)
                    }
                    autoSize={{ minRows: 3, maxRows: 6 }} 
                />
              </Form.Item>

              <Form.Item label="Unit" required>
                <Select
                  placeholder="Select unit"
                  value={newMedicineData.medUnit}
                  onChange={(value) =>
                    handleNewMedicineInputChange("medUnit", value)
                  }
                  style={{ width: "100%" }}
                >
                  <Select.Option value="PACKAGE">PACKAGE</Select.Option>
                  <Select.Option value="PILL">PILL</Select.Option>
                  <Select.Option value="BOTTLE">BOTTLE</Select.Option>
                </Select>
              </Form.Item>

              <div style={{ display: "flex", gap: "8px" }}>
                <Button onClick={handleCreateMedicine} type="primary">
                  Create Medicine
                </Button>
                <Button onClick={handleCloseCreateMedicineForm}>Cancel</Button>
                
              </div>
            </Form>
            </div>
            </div>
            </Col>
            </Row>
        )}
        </div>
       </Container>
    </>
  )
}

export default CreateMedicinePage