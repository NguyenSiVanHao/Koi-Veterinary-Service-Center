import React, { useEffect, useState } from "react";
import "./VetProfile.css";
import vet from "../../assets/img/veterinarian.png";
import { useNavigate, useParams } from "react-router-dom";
import { fetchVetByVetIdAPI } from "../../apis";
import Loading from "../../components/Loading/Loading";

function VetProfile() {
  const { vetId } = useParams();
  const navigate = useNavigate();

  const [vets, setVets] = useState(null);

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
    <div className="vet-profile-container container">
      <h1 className="vet-profile-title">Veterinarian Profile</h1>
      <div className="row">
        <div className="col-md-6">
          <div className="vet-profile-left">
            <img src={vet} alt="Veterinarian" />
            <h2>{vets.user?.fullName}</h2>
          </div>
          <button
            className="vet-profile-previous mt-5"
            onClick={() => navigate(-1)}
          >
            Previous Step
          </button>
        </div>

        <div className="col-md-6">
          <div className="vet-profile-right">
            <h5>Full name: {vets.user?.username}</h5>
            <span>{vets.description}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default VetProfile;
