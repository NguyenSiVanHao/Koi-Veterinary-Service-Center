import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { fetchServiceByTypeAPI } from '../../../apis'
import Service from '../../../components/Service/Service'

export const ServiceStep = () => {
    const type = useSelector(state => state?.booking?.bookingData?.type)
    const [services, setServices] = useState([]);

    useEffect(() => {
        const fetchServiceByType = async () => {

            const response = await fetchServiceByTypeAPI(type);
            if(response.status === 200){
                setServices(response.data)
            }
        }
        fetchServiceByType();
    }, [type])
   

    return (
        <>
            <div className="container text-center ">
                <div className="container ">
                    <div className="text-center ">
                      
                        <h3>Choose Service</h3>
                    </div>

                    <div className="row">
                        {

                            services.map((service) => {
                                return (
                                    <Service
                                        image={service.image}
                                        serviceId={service.serviceId}
                                        description={service.description}
                                        isBooking={true}
                                        serviceName={service.serviceName}
                                    />
                                )
                            })
                        }
                    </div>
                </div>
            </div>
        </>
    )
}