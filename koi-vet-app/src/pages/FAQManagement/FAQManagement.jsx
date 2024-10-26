import React, { useEffect, useState } from 'react'
import AdminHeader from '../../components/AdminHeader/AdminHeader'
import { createFAQAPI, deleteFAQAPI, fetchAllFAQAPI, updateFAQAPI } from '../../apis'
import PreLoader from '../../components/Preloader/Preloader'
import { toast } from 'react-toastify'
import { Modal } from 'antd'
import ReactQuill from 'react-quill'

function FAQManagement() {
    const [faqs, setFaqs] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [selectedFAQ, setSelectedFAQ] = useState(null)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [isModalOpenAdd, setIsModalOpenAdd] = useState(false)

    const handleUpdateFAQ = async () => {
        const response = await updateFAQAPI(selectedFAQ.faqId, selectedFAQ)
        if (response.status === 200) {
            toast.success("FAQ updated successfully")
            fetchAllFAQ()
            setIsModalOpen(false)
        }
    }
    const handleCreateFAQ = async () => {
        const response = await createFAQAPI(selectedFAQ)
        if (response.status === 200) {
            toast.success("FAQ added successfully")
            fetchAllFAQ()
            setIsModalOpenAdd(false)
        }
    }

    const handleEditFAQ = async (faq) => {
        setSelectedFAQ(faq)
        setIsModalOpen(true)
    }
    const handleAddFAQ = async () => {
        setSelectedFAQ(null)
        setIsModalOpenAdd(true)
    }
    const handleDeleteFAQ = async () => {
        Modal.confirm({
            title: "Are you sure you want to delete this FAQ?",
            onOk: async () => {
                const response = await deleteFAQAPI(selectedFAQ.faqId)
                if (response.status === 200) {
                    toast.success("FAQ deleted successfully")
                    fetchAllFAQ()
                }
            }

        })
    }
    const fetchAllFAQ = async () => {
        const response = await fetchAllFAQAPI()
        setFaqs(response.data)
        setIsLoading(false)
    }
    useEffect(() => {
        fetchAllFAQ()
    }, [])
    if (isLoading) return <PreLoader />
    return (
        <div>
            <AdminHeader title="FAQ Management" />
            <div className='container'>
                <div className='row'>
                    <table className='table table-bordered'>
                        <thead>
                            <tr>
                                <th>Question</th>
                                <th>Answer</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {faqs.map((faq) => (
                                <tr key={faq.faqId}>
                                    <td dangerouslySetInnerHTML={{ __html: faq.question }}></td>
                                    <td dangerouslySetInnerHTML={{ __html: faq.answer }}></td>
                                    <td className='d-flex gap-2'>
                                        <button className='btn btn-primary' onClick={() => handleEditFAQ(faq)}>Edit</button>
                                        <button className='btn btn-danger' onClick={() => handleDeleteFAQ(faq.faqId)}>Delete</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <div className='d-flex justify-content-start'>
                        <button className='btn btn-primary' onClick={() => handleAddFAQ()}>Add New FAQ</button>
                    </div>
                </div>
            </div>
            <Modal open={isModalOpen} onCancel={() => setIsModalOpen(false)} onOk={() => handleUpdateFAQ()}>

                <div className='mb-3'>
                    <label htmlFor='question'>Question</label>
                    <ReactQuill
                        name='question'
                        id='question'
                        value={selectedFAQ?.question || null}
                        onChange={(value) => setSelectedFAQ(prevState => ({ ...prevState, question: value }))}
                    />
                </div>
                <div className='mb-3'>
                    <label htmlFor='answer'>Answer</label>
                    <ReactQuill
                        name='answer'
                        id='answer'
                        value={selectedFAQ?.answer || null}
                        onChange={(value) => setSelectedFAQ(prevState => ({ ...prevState, answer: value }))}
                    />
                </div>
            </Modal>
            {/* Add FAQ Modal */}
            <Modal open={isModalOpenAdd} onCancel={() => setIsModalOpenAdd(false)} onOk={() => handleCreateFAQ()}>
                <div className='mb-3'>
                    <label htmlFor='question'>Question</label>
                    <ReactQuill
                        name='question'
                        id='question'
                        value={selectedFAQ?.question || null}
                        onChange={(value) => setSelectedFAQ(prevState => ({ ...prevState, question: value }))}
                    />
                </div>
                <div className='mb-3'>
                    <label htmlFor='answer'>Answer</label>
                    <ReactQuill
                        name='answer'
                        id='answer'
                        value={selectedFAQ?.answer || null}
                        onChange={(value) => setSelectedFAQ(prevState => ({ ...prevState, answer: value }))}
                    />
                </div>
            </Modal>
        </div>
    )
}

export default FAQManagement
