import React, { useEffect, useState } from "react";
import "./VetProfile.css";
import { useNavigate, useParams } from "react-router-dom";
import { fetchVetByVetIdAPI } from "../../apis";
import Loading from "../../components/Loading/Loading";
import { useSelector } from 'react-redux';

function VetProfile() {
  const { vetId } = useParams();
  const navigate = useNavigate();
  const [vets, setVets] = useState(null);
  const role = useSelector(state => state.user.role);

  const fectchVetProfile = async () => {

    const response = await fetchVetByVetIdAPI(vetId);
    setVets(response?.data);
  };

  useEffect(() => {
    fectchVetProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [vetId]);

  if (!vets) {
    return <Loading />;
  }

  return (
    <>
    <div className="vet-profile-container container">
      <h1 className="vet-profile-title">Veterinarian Profile</h1>
      <div className="row">
        <div className="col-md-6">
          <div className="vet-profile-left">
            <img src={vets.imageVeterinarian} alt="Veterinarian" />
            <h2>{vets.user?.fullName}</h2>
          </div>
          <br/>
          {role !== "CUSTOMER" && (
          <div className="vet-profile-left">
              <p>User name: {vets.user?.username}</p>
              <p>Phone: {vets.phone}</p>
              <p>Email: {vets.user?.email}</p>
              <p>Google meet link: {vets.googleMeet}</p>
            </div>
          )}
            <button
              className="vet-profile-previous mt-5" style={{marginRight: "10px"}}
            onClick={() => navigate(-1)}
          >
            Previous Step
          </button>
        </div>

        <div className="col-md-6">
          <div className="vet-profile-right">
            <div 
              className="service-description" 
              dangerouslySetInnerHTML={{ __html: vets.description }}
            />
            <p><strong>Services: {Array.isArray(vets.serviceNames) ? vets.serviceNames.join(', ') : vets.serviceNames}</strong></p>
          </div>
        </div>
      </div>
    </div>
    </>
  );
}

export default VetProfile;
