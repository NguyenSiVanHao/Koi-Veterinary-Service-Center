import React, { useEffect, useState } from 'react'
import Veterinarian from '../../../components/Veterinarian/Veterinarian';
import { fetchVetByServiceIdAPI } from '../../../apis';
import { useSelector } from 'react-redux';
import PreLoader from '../../../components/Preloader/Preloader';

const VeterinarianStep = () => {
  const [veterinarians, setVeterinarians] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const serviceId = useSelector(state => state.booking.bookingData.serviceId);
  useEffect(() => {
    const fetchVeterinarians = async () => {
      setIsLoading(true);
      try {
        const response = await fetchVetByServiceIdAPI(serviceId);
        setIsLoading(false);
        setVeterinarians(response?.data);
      } catch (error) {
        setIsLoading(false);
      } finally {
        setIsLoading(false);
      }
    }
    fetchVeterinarians();
  }, [serviceId])

  return (
    <div className="container text-center my-5">
      <div className="container mt-5">
        <div className="text-center mb-5">
          <h3>Choose Doctor</h3>
        </div>

        <div className="row">
          {isLoading && <PreLoader />}
          {!isLoading && veterinarians.length > 0 ?
            veterinarians?.map((vet) => {
              console.log({ vet });
              return <Veterinarian image={vet.imageVeterinarian} vetId={vet.vetId} name={vet?.user?.fullName} isBooking={true} services={vet?.serviceNames} />
            })
            : <h3>We are sorry ! No veterinarians found for this service.</h3>}
        </div>

      </div>
    </div>
  );
}

export default VeterinarianStep