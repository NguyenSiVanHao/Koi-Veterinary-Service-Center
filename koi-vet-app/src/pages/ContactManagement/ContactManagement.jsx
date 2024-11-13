import React, { useEffect, useState } from 'react'
import { Container } from 'react-bootstrap'
import { Form, Input, Table } from 'antd'
import { createContactReplyAPI, fetchContactAPI, fetchContactDetailAPI } from '../../apis'    
import Modal from '../../components/Modal/Modal';
import AdminHeader from '../../components/AdminHeader/AdminHeader';
import './ContactManagement.css';
import PreLoader from '../../components/Preloader/Preloader';

function ContactManagement() {
    const [dataSource, setDataSource] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [contactDetail, setContactDetail] = useState(null);
    const [selectedId, setSelectedId] = useState(null);
    const [form] = Form.useForm();
    const [isLoading, setIsLoading] = useState(true);
        
    const handleOpenModal = async (id) => {
        setSelectedId(id);
        setIsModalOpen(true);
        try {
            const response = await fetchContactDetailAPI(id);
            setContactDetail(response.data);
        } catch (error) {
            console.error('Error fetching contact detail:', error);
        }
    }

    const handleCloseModal = () => {
        setIsModalOpen(false);
        form.resetFields();
    }

    const handleSendEmail = async (values) => {
        try {
            console.log(contactDetail.email);
            await createContactReplyAPI({recipient: contactDetail.email, subject: values.subject, body: values.body});
            handleCloseModal();
            setDataSource(dataSource.filter(item => item.id !== selectedId));
        } catch (error) {
            console.error('Error sending email:', error);
        }
    }

    useEffect(() => {
        const fetchContact = async () => {
            const response = await fetchContactAPI();
            setDataSource(response.data);
            setIsLoading(false);
        }
        fetchContact();
    }, []);

    const columns1 = [
        {
            title: "Name",
            dataIndex: "name",
            key: "name",
            width: "10%",
        },
        {
            title: "Email",
            dataIndex: "email",
            key: "email",
            width: "20%",
        },
        {
            title: "Subject",
            dataIndex: "subject",
            key: "subject",
            width: "25%",
        },
        {
            title: "Message",
            dataIndex: "message",
            key: "message",
            width: "35%",
        },
        {
            title: "Action",
            key: "action",
            width: "10%",
            render: (_, record) => (
                <button onClick={() => handleOpenModal(record.id)}><i className="bi bi-box-arrow-in-right"></i></button>
            )
        }
    ]

    if (isLoading) return <PreLoader />;

    return (
        <>
        <AdminHeader title="Contact Management" />
        <Container>
            <Table dataSource={dataSource} columns={columns1} rowKey="id" pagination={{ pageSize: 7 }} className="ant-table-contact"/>
        
            <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
                <h3><strong>Reply Message</strong></h3>
                <Form onFinish={handleSendEmail} form={form}>
                    <Form.Item label="Recipient" name="recipient">
                        {contactDetail && contactDetail.email}
                    </Form.Item>
                    <Form.Item label="Subject" name="subject">
                        <Input />
                    </Form.Item>
                    <Form.Item label="Message" name="body">
                        <Input />
                    </Form.Item>
                    <button type="primary" htmlType="submit" className='btn btn-primary'>Send</button>
                </Form>
            </Modal>
        </Container>
        </>
    )
}

export default ContactManagement
