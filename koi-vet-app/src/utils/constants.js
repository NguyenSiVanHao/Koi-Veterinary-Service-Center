export const API_ROOT = "http://localhost:8080/api/v1";
export const ROLE = {
  MANAGER: "MANAGER",
  CUSTOMER: "CUSTOMER",
  VETERINARIAN: "VETERINARIAN",
  STAFF: "STAFF",
};
export const BOOKING_TYPE = {
  ONLINE: "ONLINE",
  HOME: "HOME",
  CENTER: "CENTER",
};

export const APPOINTMENT_STATUS = {
  CREATED: "CREATED", 
  BOOKING_COMPLETE: "BOOKING_COMPLETE", 
  PROCESS: "PROCESS",
  READY_FOR_PAYMENT: "READY_FOR_PAYMENT",
  FINISH: "FINISH",
  CANCEL: "CANCEL",
  REFUND: "REFUND",
  REFUNDABLE: "REFUNDABLE",
};

export const SERVICE_FOR = {
  KOI: "FISH",
  POND: "POND",
  ONLINE: "ONLINE",
};


// Koi species các loài cá 
 export const fishSpecies = [
  "Kohaku", "Hikari Muji", "Showa Sanshoku", "Shiro Utsuri", "Hi Utsuri",
  "Ki Utsuri", "Asagi", "Shusui", "Tancho", "Goshiki", "Kumonryu",
  "Ochiba Shigure", "Doitsu", "Koromo", "Other"
];

export const ROW_PER_PAGE = [10, 20, 30, 40, 50];

