import { Form, Input, message, Select, Table, Modal, Popconfirm } from 'antd';
import React, { useEffect, useState } from 'react';
import { Button, Container } from 'react-bootstrap';
import { createMedicineAPI, deleteMedicineByIdAPI, fetchMedicinesAPI, updateMedicineByIdAPI } from '../../apis';
import './CreateMedicinePage.css';
import TextArea from 'antd/es/input/TextArea';
import AdminHeader from '../../components/AdminHeader/AdminHeader';
import PreLoader from '../../components/Preloader/Preloader';

function CreateMedicinePage() {
  const [newMedicineData, setNewMedicineData] = useState({
    name: "",
    description: "",
    medUnit: "",
  });
  const [availableMedicines, setAvailableMedicines] = useState([]);
  const [editingMedicine, setEditingMedicine] = useState(null); // State for the medicine being edited
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false); // State for create modal
  const [searchTerm, setSearchTerm] = useState(""); // State for search term
  const [isLoading, setIsLoading] = useState(true);

  // Fetch medicines on component mount
  useEffect(() => {
    const fetchMedicines = async () => {
      try {
        const response = await fetchMedicinesAPI();
        setAvailableMedicines(response.data || []);
      } catch (error) {
        message.error("Failed to fetch medicines.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchMedicines();
  }, []);

  // Handle input changes for new medicine
  const handleNewMedicineInputChange = (field, value) => {
    setNewMedicineData((prev) => ({ ...prev, [field]: value }));
  };

  // Create new medicine
  const handleCreateMedicine = async () => {
    const { name, description, medUnit } = newMedicineData;

    if (!name || !description || !medUnit) {
      message.error("Please fill in all fields.");
      return;
    }

    try {
      await createMedicineAPI(newMedicineData);
      message.success("Medicine created successfully.");
      const updatedMedicines = await fetchMedicinesAPI();
      setAvailableMedicines(updatedMedicines.data || []);
      setNewMedicineData({ name: "", description: "", medUnit: "" }); // Reset new medicine data
    } catch (error) {
      message.error("Failed to create medicine.");
    }
  };

  // Handle delete medicine
  const handleDeleteMedicine = async (medicineId) => {
    try {
      await deleteMedicineByIdAPI(medicineId);
      const updatedMedicines = await fetchMedicinesAPI();
      setAvailableMedicines(updatedMedicines.data || []);
      message.success("Medicine deleted successfully.");
    } catch (error) {
      message.error("Failed to delete medicine.");
    }
  };

  // Open edit modal
  const handleEditMedicine = (medicine) => {
    setEditingMedicine(medicine);
  };

  // Save edited medicine
  const handleSaveEdit = async () => {
    if (!editingMedicine.name || !editingMedicine.description || !editingMedicine.medUnit) {
      message.error("Please fill in all fields.");
      return;
    }

    try {
      await updateMedicineByIdAPI(editingMedicine.medicineId, editingMedicine);
      message.success("Medicine updated successfully.");
      const updatedMedicines = await fetchMedicinesAPI();
      setAvailableMedicines(updatedMedicines.data || []);
      setEditingMedicine(null); // Close the modal
    } catch (error) {
      message.error("Failed to update medicine.");
    }
  };

  // Open create modal
  const handleOpenCreateModal = () => {
    setNewMedicineData({ name: "", description: "", medUnit: "" }); // Reset new medicine data
    setIsCreateModalVisible(true);
  };

  // Save new medicine
  const handleSaveNewMedicine = async () => {
    const { name, description, medUnit } = newMedicineData;

    if (!name || !description || !medUnit) {
      message.error("Please fill in all fields.");
      return;
    }

    try {
      await createMedicineAPI(newMedicineData);
      message.success("Medicine created successfully.");
      const updatedMedicines = await fetchMedicinesAPI();
      setAvailableMedicines(updatedMedicines.data || []);
      setIsCreateModalVisible(false); // Close the modal
    } catch (error) {
      message.error("Failed to create medicine.");
    }
  };

  // Filter available medicines based on search term
  const filteredMedicines = availableMedicines.filter(medicine =>
    medicine.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Columns for the table
  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      width: "30%",
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      width: "35%",
    },
    {
      title: "Unit",
      dataIndex: "medUnit",
      key: "medUnit",
      wwidth: "15%",
    },
    {
      title: "Action",
      key: "action",
      width: "20%",
      render: (_, record) => (
        <>
          <Button onClick={() => handleEditMedicine(record)}>Edit</Button>
          <Popconfirm
            title="Are you sure to delete this medicine?"
            onConfirm={() => handleDeleteMedicine(record.medicineId)}
            okText="Yes"
            cancelText="No"
          >
            <button style={{ marginLeft: 8 }} className='btn btn-danger'>Delete</button>
          </Popconfirm>
        </>
      ),
    },
  ];

  if (isLoading) return <PreLoader />;

  return (
    <>
      <AdminHeader title="Medicine Management" />
      <Container className='mt-4'>
        
        {/* Search Input */}
        <Input
          placeholder="Search by medicine name"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ marginBottom: 20 }}
        />

        <Table
          className="ant-table-medicine"
          dataSource={filteredMedicines} // Use filtered medicines for the table
          columns={columns}
          pagination={{
            pageSize: 7,
            showSizeChanger: false,
          }}
          rowKey="medicineId"
        />

        {/* Modal for editing medicine */}
        <Modal
          title="Edit Medicine"
          visible={!!editingMedicine}
          onOk={handleSaveEdit}
          onCancel={() => setEditingMedicine(null)}
        >
          {editingMedicine && (
            <Form>
              <Form.Item label="Medicine Name" required>
                <Input
                  placeholder="Enter medicine name"
                  value={editingMedicine.name}
                  onChange={(e) => setEditingMedicine({ ...editingMedicine, name: e.target.value })}
                />
              </Form.Item>
              <Form.Item label="Description" required>
                <TextArea
                  placeholder="Enter description"
                  value={editingMedicine.description}
                  onChange={(e) => setEditingMedicine({ ...editingMedicine, description: e.target.value })}
                  autoSize={{ minRows: 3, maxRows: 6 }}
                />
              </Form.Item>
              <Form.Item label="Unit" required>
                <Select
                  placeholder="Select unit"
                  value={editingMedicine.medUnit}
                  onChange={(value) => setEditingMedicine({ ...editingMedicine, medUnit: value })}
                >
                  <Select.Option value="PACKAGE">PACKAGE</Select.Option>
                  <Select.Option value="PILL">PILL</Select.Option>
                  <Select.Option value="BOTTLE">BOTTLE</Select.Option>
                </Select>
              </Form.Item>
            </Form>
          )}
        </Modal>

        <Modal
          title="Create New Medicine"
          visible={isCreateModalVisible}
          onOk={handleSaveNewMedicine}
          onCancel={() => setIsCreateModalVisible(false)}
        >
          <Form>
            <Form.Item label="Medicine Name" required>
              <Input
                placeholder="Enter medicine name"
                value={newMedicineData.name}
                onChange={(e) => handleNewMedicineInputChange('name', e.target.value)}
              />
            </Form.Item>
            <Form.Item label="Description" required>
              <TextArea
                placeholder="Enter description"
                value={newMedicineData.description}
                onChange={(e) => handleNewMedicineInputChange('description', e.target.value)}
                autoSize={{ minRows: 3, maxRows: 6 }}
              />
            </Form.Item>
            <Form.Item label="Unit" required>
              <Select
                placeholder="Select unit"
                value={newMedicineData.medUnit}
                onChange={(value) => handleNewMedicineInputChange('medUnit', value)}
              >
                <Select.Option value="PACKAGE">PACKAGE</Select.Option>
                <Select.Option value="PILL">PILL</Select.Option>
                <Select.Option value="BOTTLE">BOTTLE</Select.Option>
              </Select>
            </Form.Item>
          </Form>
        </Modal>

        <Button onClick={handleOpenCreateModal}>Create New Medicine</Button> {/* Button to open create modal */}
      </Container>
    </>
  );
}

export default CreateMedicinePage;