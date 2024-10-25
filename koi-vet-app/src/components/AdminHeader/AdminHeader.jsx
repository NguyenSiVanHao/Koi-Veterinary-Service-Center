import React from 'react'
import { useSelector } from 'react-redux';
import { ROLE } from '../../utils/constants';
const AdminHeader = ({title}) => {
    const role = useSelector(state => state.user.role);
    const user = useSelector(state => state.user);
    return (
        <>
            <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
                <h2 className="booking-title fw-semibold">{title}</h2>
                <div className="btn-toolbar mb-2 mb-md-0">
                    {role !== ROLE.CUSTOMER ? (
                    <div className="btn-group me-2">
                        <button type="button" className="btn btn-sm btn-outline-secondary">
                            <img
                                src="https://via.placeholder.com/40"
                                alt="User Avatar"
                                className="rounded-circle"
                                width="30"
                                height="30"
                            />
                            {user?.fullName}
                        </button>
                        </div>
                    ) : null}
                </div>
            </div>
        </>
    )
}

export default AdminHeader