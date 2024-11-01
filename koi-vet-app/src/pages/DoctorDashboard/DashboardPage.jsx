import React, { useEffect, useState } from 'react'
import { Bar, Line } from 'react-chartjs-2'
import { Chart as ChartJS, defaults } from "chart.js/auto";
import { DatePicker, Space, Tabs } from 'antd';
import './DashboardPage.css';
import { fetchDashboardAPI, fetchDashboardByServiceAPI } from '../../apis';
import { px } from 'framer-motion';
defaults.maintainAspectRatio = false;
defaults.responsive = true;

function DashboardPage() {
  const [revenueData, setRevenueData] = useState([]);
  const [koiData, setKoiData] = useState([]);
  const [pondData, setPondData] = useState([]);
  const [appointmentData, setAppointmentData] = useState([]);
  const [serviceData, setServiceData] = useState([]);
  const [labels, setLabels] = useState([]);
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [time, setTime] = useState('day');
  const { TabPane } = Tabs;
  const { RangePicker } = DatePicker;
  const [dataSource, setDataSource] = useState([]);


  useEffect(() => {
    const fetchServiceData = async () => {
      const data = await fetchDashboardByServiceAPI(startTime, endTime, time);
      setServiceData(data.data);
    };
    fetchServiceData();
  }, [startTime, endTime, time]);

  console.log(serviceData);



  useEffect(() => {
    const fetchDashboardData = async (start, end, timeType) => {
      try {
        const data = await fetchDashboardAPI(start, end, timeType);
        if (data && data.data) {
          setDataSource(data.data);
          const dateLabels = data.data.map(item => item.date);
          setLabels(dateLabels);
          
          const revenueData = data.data.map(item => item.totalRevenue);
          setRevenueData(revenueData);
          
          const koiData = data.data.map(item => item.totalKoi);
          setKoiData(koiData);
          
          const pondData = data.data.map(item => item.totalPond);
          setPondData(pondData);
          
          const appointmentData = data.data.map(item => item.totalAppointment);
          setAppointmentData(appointmentData);
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setDataSource([]);
      }
    };
    fetchDashboardData(startTime, endTime, time);
  }, [startTime, endTime, time]);

  const totalAppointmentcard = dataSource?.reduce((sum, item) => sum + (item.totalAppointment || 0), 0) || 0;
  const totalKoicard = dataSource?.reduce((sum, item) => sum + (item.totalKoi || 0), 0) || 0;
  const totalPondcard = dataSource?.reduce((sum, item) => sum + (item.totalPond || 0), 0) || 0;
  const totalRevenuecard = dataSource?.reduce((sum, item) => sum + (item.totalRevenue || 0), 0) || 0;

  // Add this function to set default date ranges
  const getDefaultDateRange = (timeType) => {
    // Tạo date với múi giờ Việt Nam
    const end = new Date(new Date().toLocaleString('en-US', { timeZone: 'Asia/Ho_Chi_Minh' }));
    const start = new Date(new Date().toLocaleString('en-US', { timeZone: 'Asia/Ho_Chi_Minh' }));
    
    switch (timeType) {
      case 'day':
        start.setDate(end.getDate() - 7);
        break;
      case 'month':
        start.setMonth(end.getMonth() - 6);
        break;
      case 'year':
        start.setFullYear(end.getFullYear() - 3);
        break;
      default:
        start.setDate(end.getDate() - 7);
    }
    
    // Format dates to YYYY-MM-DD using Vietnam timezone
    const formatDate = (date) => {
      return date.toLocaleDateString('en-CA', { // en-CA gives YYYY-MM-DD format
        timeZone: 'Asia/Ho_Chi_Minh',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      });
    };

    return {
      start: formatDate(start),
      end: formatDate(end)
    };
  };

  // Modify the tab change handler
  const handleTabChange = (activeKey) => {
    setTime(activeKey);
    const defaultRange = getDefaultDateRange(activeKey);
    setStartTime(defaultRange.start);
    setEndTime(defaultRange.end);
  };

  // Add useEffect to set initial default range
  useEffect(() => {
    const defaultRange = getDefaultDateRange('day');
    setStartTime(defaultRange.start);
    setEndTime(defaultRange.end);
  }, []);

  // Add date range handler
  const handleDateChange = (dates) => {
    if (dates) {
      setStartTime(dates[0].format('YYYY-MM-DD'));
      setEndTime(dates[1].format('YYYY-MM-DD'));
    } else {
      setStartTime('');
      setEndTime('');
    }
  };

  const serviceNamesPopular = () => {
   for(let i = 0; i < serviceData.length; i++) {
    for(let j = i + 1; j < serviceData.length; j++) {
      if (serviceData[i].count > serviceData[j].count) {
        return serviceData[i].serviceName;
      }
    }
   }
  }

  return (
    <>
    <div className='container'>
    <h1>Dashboard</h1>
    {/* Replace your time buttons with: */}
    <Tabs defaultActiveKey="day" onChange={handleTabChange}>
        <TabPane tab="Day" key="day" />
        <TabPane tab="Month" key="month" />
        <TabPane tab="Year" key="year" />
    </Tabs>



      <Space direction="vertical" size={12} style={{ marginBottom: "20px" }}>
        <RangePicker 
          onChange={handleDateChange}
          format="YYYY-MM-DD"
        />
      </Space>



    <div className='row'>
      <div className='col-md'>
        <div className='card total' 
            style={{
              height: "100px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              fontWeight: "bold",
              backgroundColor: "#9479DA ",
              color: "white",
            }}>
          <div className='card-body total-body'>
            <h5 className='card-title'><i class="bi bi-coin icons"></i> Total Revenue</h5>
            <p className='card-text'>{totalRevenuecard}</p>
          </div>
        </div>
      </div>  
      <div className='col-md'>
        <div className='card total' 
            style={{
              height: "100px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              fontWeight: "bold",
              backgroundColor: "#E74C35",
              color: "white",
            }}>
          <div className='card-body total-body'>
            <h5 className='card-title'><i class="bi bi-calendar-check"></i> Total Appointments</h5>
            <p className='card-text'>{totalAppointmentcard}</p>
          </div>
        </div>
      </div>
      <div className='col-md'>
        <div className='card total' 
            style={{
              height: "100px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              fontWeight: "bold",
              backgroundColor: "#007BFF",
              color: "white",
            }}
              >
          <div className='card-body total-body'>
            <h5 className='card-title'><i class="bi bi-fire"></i> Popular Services</h5>
            <p className='card-text'>{serviceNamesPopular()}</p>
          </div>
        </div>
      </div>
      <div className='col-md'>
        <div className='card total'  
            style={{
              height: "100px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              fontWeight: "bold",
              backgroundColor: "#FFC001 ",
              color: "white",
            }}>
          <div className='card-body total-body'>
            <h5 className='card-title'><i class="fas fa-fish"></i> Total Koi</h5>
            <p className='card-text'>{totalKoicard}</p>
          </div>
        </div>
      </div>
      <div className='col-md'>
        <div className='card total' 
            style={{
              height: "100px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              fontWeight: "bold",
              backgroundColor: "#01A15F",
              color: "white",
            }}>
          <div className='card-body total-body'>
            <h5 className='card-title'><i class="fas fa-water"></i> Total Pond</h5>
            <p className='card-text'>{totalPondcard}</p>
          </div>
        </div>
        </div>
      </div>



    {/* Revenue Chart */}
    <div className='row' style={{marginBottom: "20px"}}>
        <Bar
          data={{
            labels: labels,
            datasets: [
              {
                label: "Revenue",
                data: revenueData,
                backgroundColor: [
                 'rgba(153, 102, 255, 0.2)',
                ],
                borderColor: [
                  'rgb(153, 102, 255)',
                ],
                borderWidth: 1
              },
            ],
          }}
            />
    </div>



      {/* Total Service Chart */}
      <div className='row' style={{marginBottom: "20px", height: "500px"}}>
      <div className='col-md-6' >
        <Bar
          data={{
            labels: serviceData.map(service => service.serviceName),
            datasets: [
              {
                label: "Total Service",
                data: serviceData.map(service => service.count),
                backgroundColor: [
                  'rgba(54, 162, 235, 0.2)',  // Blue
                ],
                borderColor: [
                  'rgb(54, 162, 235)',
                ],
                borderWidth: 1
              },
            ],
          }}
          options={{
            scales: {
              y: {
                beginAtZero: true,
                ticks: {
                  stepSize: 1, // Ensures only whole numbers are displayed
                }
              }
            }
          }}
        />
      </div>
      
      {/* Appointment Chart */}
<div className='col-md-6' >
            <Line
              data={{
                labels: labels,
                datasets: [
                  {
                    label: "Appointment",
                    data: appointmentData,
                    borderColor: 'rgb(255, 99, 132)',
                    backgroundColor: 'rgba(255, 99, 132, 0.2)',
                    fill: true,
                  },
                ],
              }}
              options={{
                scales: {
                  y: {
                    beginAtZero: true,
                    ticks: {
                      stepSize: 1, // Ensures only whole numbers are displayed
                    }
                  }
                }
              }}
            />

      </div>
      </div>



    {/* Koi and Pond Chart */}
    <div className='row'>
    <div className='col-md-6' style={{marginBottom: "20px"}}>
    <Line
  data={{
    labels: labels,
    datasets: [
      {
        label: "Koi",
        data: koiData,
        backgroundColor: 'rgba(255, 205, 86, 0.5)',
        borderColor: 'rgb(255, 205, 86)',
        fill: true,  // Bật vùng tô phía dưới
      },
    ],
  }}
  options={{
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1, // Ensures only whole numbers are displayed
        }
      }
    }
  }}
/>
      </div>


      <div className='col-md-6' style={{marginBottom: "20px"}}>
    <Line
  data={{
    labels: labels,
    datasets: [
      {
        label: "Pond",
        data: pondData,
        backgroundColor: 'rgba(75, 192, 192, 0.5)',
        borderColor: 'rgb(75, 192, 192)',
        fill: true, 
      },
    ],
  }}
  options={{
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1, // Ensures only whole numbers are displayed
        }
      }
    }
  }}
  />
      </div>
      </div>


    </div>
    </>
  )
}

export default DashboardPage;