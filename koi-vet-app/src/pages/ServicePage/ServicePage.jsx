import React, { useEffect, useState } from 'react'
import "./ServicePage.css"
import { fecthAllServicesAPI } from '../../apis'
import Service from "../../components/Service/Service"
import BannerTop from '../../components/BannerTop/BannerTop';
import PreLoader from '../../components/Preloader/Preloader';

function ServicePage() {
    const [services, setServices] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    useEffect(() => {
        const fecthServices = async () => {
            const response = await fecthAllServicesAPI();
            await setServices(response?.data);
            setIsLoading(false);
        }
        fecthServices();
    }, [])
    return (
        <>
            <BannerTop title="Our Services" subTitle="Home / Services" />
            <div className="container text-center my-5">
                <div className="container mt-5">
                    <div className="text-center mb-5">
                        {/* <img src="process-image.png" alt="Process Step"/> */}

                    </div>

                    <div className="row">
                        {isLoading && <PreLoader />}
                        {
                            services.map((service) => {
                                return <Service image={service.image} serviceId={service.serviceId} description={service.description} serviceName={service.serviceName} basePrice={service.basePrice} pondPrice={service.pondPrice} koiPrice={service.koiPrice} serviceFor={service.serviceFor} />
                            })
                        }
                    </div>
                </div>
            </div>
        </>
    )
}

export default ServicePage