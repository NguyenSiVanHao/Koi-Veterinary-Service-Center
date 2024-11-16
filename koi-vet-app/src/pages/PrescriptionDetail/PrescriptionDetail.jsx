import { Table } from "antd";
import React, { useEffect, useState } from "react";
import { Button, Col, Container, Row } from "react-bootstrap";
import {
  deletePrescriptionAPI,
  deletePrescriptionByIdAPI,
  fetchPrescriptionByIdAPI,
  updatePrescriptionAPI,
} from "../../apis";
import "./PrescriptionDetail.css";
import { message } from "antd";
import { useSelector } from 'react-redux';

function PrescriptionDetail(props) {
  const [prescriptionData, setPrescriptionData] = useState([]);
  const [editingMedicines, setEditingMedicines] = useState({});
  const role = useSelector(state => state.user.role);

  useEffect(() => {
    const handlefetchPrescriptionId = async () => {
      const response = await fetchPrescriptionByIdAPI(props.prescriptionId);
      setPrescriptionData(response?.data.prescriptionMedicines || "");
    };
    handlefetchPrescriptionId();
  }, [props.prescriptionId]);

  const handleEdit = (medicineId) => {
    setEditingMedicines((prev) => ({
      ...prev,
      [medicineId]: {
        editing: true,
        ...prescriptionData.find((m) => m.medicineId === medicineId),
      },
    }));
  };

  const handleSave = async (medicineId) => {
    const updatedMedicine = editingMedicines[medicineId];
    const newPrescriptionData = prescriptionData.map((medicine) =>
      medicine.medicineId === medicineId
        ? {
            ...medicine,
            dosage: updatedMedicine.dosage,
            quantity: updatedMedicine.quantity,
          }
        : medicine
    );
    setPrescriptionData(newPrescriptionData);
    setEditingMedicines((prev) => ({
      ...prev,
      [medicineId]: { editing: false },
    }));

    // Call the update API here with the updated medicine details
    await updatePrescriptionAPI(props.prescriptionId, {
      name: prescriptionData.name,
      note: prescriptionData.note,
      appointmentId: prescriptionData.appointmentId,
      prescriptionMedicines: newPrescriptionData,
    });
  };

  const handleChange = (medicineId, field, value) => {
    setEditingMedicines((prev) => ({
      ...prev,
      [medicineId]: {
        ...prev[medicineId],
        [field]: value,
      },
    }));
  };

  const columns = [
    // {
    //   title: "Medicine ID",
    //   dataIndex: "medicineId",
    //   key: "medicineId",
    // },
    {
      title: "Medicine Name",
      dataIndex: "medicineName",
      key: "medicineName",
    },
    {
      title: "Dosage",
      dataIndex: "dosage",
      key: "dosage",
      render: (text, record) => {
        const isEditing = editingMedicines[record.medicineId]?.editing;
        return isEditing ? (
          <input
            type="text"
            value={editingMedicines[record.medicineId]?.dosage}
            onChange={(e) =>
              handleChange(record.medicineId, "dosage", e.target.value)
            }
          />
        ) : (
          text
        );
      },
    },
    {
      title: "Quantity",
      dataIndex: "quantity",
      key: "quantity",
      render: (text, record) => {
        const isEditing = editingMedicines[record.medicineId]?.editing;
        return isEditing ? (
          <input
            type="number"
            value={editingMedicines[record.medicineId]?.quantity}
            onChange={(e) =>
              handleChange(record.medicineId, "quantity", e.target.value)
            }
          />
        ) : (
          text
        );
      },
    },
    {
      title: "Unit",
      dataIndex: "medUnit",
      key: "medUnit",
    },
    role !== "CUSTOMER" && {
      title: "Actions",
      key: "actions",
      render: (text, record) => {
        const isEditing = editingMedicines[record.medicineId]?.editing;
        return isEditing ? (
          <Button onClick={() => handleSave(record.medicineId)}>Save</Button>
        ) : (
          <Button onClick={() => handleEdit(record.medicineId)}>Edit</Button>
        );
      },
    },
    
    role !== "CUSTOMER" && {
      title: "Delete",
      key: "delete",
      render: (text, record) => (
        <Button
          variant="danger"
          onClick={() =>
            handleDeletePrescriptionMedicine(
              props.prescriptionId,
              record.medicineId
            )
          }
        >
          Delete
        </Button>
      ),
    },
  ].filter(Boolean);

  const handleDeletePrescriptionMedicine = async (
    prescriptionId,
    medicineId
  ) => {
    try {
      await deletePrescriptionAPI(prescriptionId, medicineId);
      const updatedPrescriptionData = prescriptionData.filter(
        (medicine) => medicine.medicineId !== medicineId
      );

      setPrescriptionData(updatedPrescriptionData);
      message.success("Medicine deleted successfully");
      if (updatedPrescriptionData.length === 0) {
        await deletePrescriptionByIdAPI(prescriptionId);
        message.success("Prescription deleted because no medicine");
      }
    } catch (error) {
      console.error("Error deleting medicine:", error);
      message.error("Failed to delete medicine. Please try again.");
    }
  };

  return (
    <div className="container text-center">
      <Container>
        <Row>
          <Col md={12}>
            <h2>Detail Prescription</h2>
            <Table
              dataSource={prescriptionData}
              columns={columns}
              rowKey="medicineId"
              pagination={{ pageSize: 5 }}
              bordered
            />
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default PrescriptionDetail;
