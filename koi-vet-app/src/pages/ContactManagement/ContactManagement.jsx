import React, { useEffect, useState } from 'react'
import { Container } from 'react-bootstrap'
import { Table } from 'antd'
import { fetchContactAPI } from '../../apis'    
// import Modal from '../../components/Modal/Modal';

function ContactManagement() {
    const [dataSource, setDataSource] = useState([]);
    // const [isModalOpen, setIsModalOpen] = useState(false);
    // const [contactDetail, setContactDetail] = useState(null);
    // const [selectedId, setSelectedId] = useState(null);
    
    // const handleOpenModal = async (id) => {
    //     // setSelectedId(id);
    //     setIsModalOpen(true);
    //     try {
    //         const response = await fetchContactDetailAPI(id);
    //         setContactDetail(response.data);
    //     } catch (error) {
    //         console.error('Error fetching contact detail:', error);
    //     }
    // }

    useEffect(() => {
        const fetchContact = async () => {
            const response = await fetchContactAPI();
            setDataSource(response.data);
        }
        fetchContact();
    }, []);

    const columns1 = [
        {
            title: "ID",
            dataIndex: "id",
            key: "id",
        },
        {
            title: "Email",
            dataIndex: "email",
            key: "email",
        },
        {
            title: "Subject",
            dataIndex: "subject",
            key: "subject",
        },
        {
            title: "Action",
            key: "action",
            // render: (_, record) => (
            //     <button onClick={() => handleOpenModal(record.id)}><i className="bi bi-box-arrow-in-right"></i></button>
            // )
        }
    ]

    // const columns2 = [
    //     {
    //         title: "Name",
    //         dataIndex: "name",
    //         key: "name",
    //     },
    //     {
    //         title: "Email",
    //         dataIndex: "email",
    //         key: "email",
    //     },
    //     {
    //         title: "Subject",
    //         dataIndex: "subject",
    //         key: "subject",
    //     },
    //     {
    //         title: "Message",
    //         dataIndex: "message",
    //         key: "message",
    //     },
    // ]

    return (
        <Container>
            <Table dataSource={dataSource} columns={columns1} rowKey="id" pagination={{ pageSize: 7 }}/>
        
            {/* <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
                <h3><strong>Contact Detail</strong></h3>
                {contactDetail && (
                    <Table dataSource={[contactDetail]} columns={columns2} rowKey="id" pagination={false}/>
                )}
            </Modal> */}
        </Container>
    )
}

export default ContactManagement
