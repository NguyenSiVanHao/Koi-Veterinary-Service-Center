import React from 'react'
import { Bar, Line } from 'react-chartjs-2'
import { Chart as ChartJS, defaults } from "chart.js/auto";
import { DatePicker, Space } from 'antd';
import './DashboardPage.css';
defaults.maintainAspectRatio = false;
defaults.responsive = true;

function DashboardPage() {
  const { RangePicker } = DatePicker;
  return (
    <>
    <div className='container'>
    <h1>Dashboard</h1>
    <nav className="w-100" style={{ marginBottom: "20px" }}>
        <div className="nav nav-tabs" id="nav-tab" role="tablist">
          <button
            className="nav-link custom-text-color"
          >
            <i class="bi bi-calendar-event-fill"></i> Day
          </button>
          <button
            className="nav-link custom-text-color"
          >
             <i class="bi bi-calendar-minus-fill"></i> Month
          </button>
          <button
            className="nav-link custom-text-color"
          >
            <i class="bi bi-calendar2-fill"></i> Year
          </button>
        </div>
      </nav>


      <Space direction="vertical" size={12} style={{ marginBottom: "20px" }}>
        <RangePicker
          //value={dateRange}
          // onChange={handleDateChange}
          //picker={time === "month" ? "month" : time === "year" ? "year" : "date"}
        />
      </Space>



    <div className='row'>
      <div className='col-md-4'>
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
          <div className='card-body'>
            <h5 className='card-title'><i class="bi bi-coin icons"></i> Total Revenue</h5>
          </div>
        </div>
      </div>  
      <div className='col-md-4'>
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
          <div className='card-body'>
            <h5 className='card-title'><i class="bi bi-calendar-check"></i> Total Appointments</h5>
          </div>
        </div>
      </div>
      <div className='col-md-4'>
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
          <div className='card-body'>
            <h5 className='card-title'><i class="bi bi-fire"></i> Popular Services</h5>
          </div>
        </div>
      </div>
      <div className='col-md-4'>
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
          <div className='card-body'>
            <h5 className='card-title'><i class="fas fa-fish"></i> Total Koi</h5>
          </div>
        </div>
      </div>
      <div className='col-md-4'>
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
          <div className='card-body'>
            <h5 className='card-title'><i class="fas fa-water"></i> Total Pond</h5>
          </div>
        </div>
        </div>
      </div>



    {/* Revenue Chart */}
    <div className='row'>
        <Bar
          data={{
            labels: ["January", "February", "March", "April", "May", "June", "July"],
            datasets: [
              {
                label: "Revenue",
                data: [65, 59, 80, 81, 56, 55, 40],
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



    {/* Appointment Chart */}
      <div className='row'>
        <Line
              data={{
                labels: ["January", "February", "March", "April", "May", "June", "July"],
                datasets: [
                  {
                    label: "Appointment",
                    data: [65, 59, 80, 81, 56, 55, 40],
                    borderColor: 'rgb(255, 99, 132)',
                    backgroundColor: 'rgba(255, 99, 132, 0.2)',
                    fill: true,
                  },
                ],
              }}
            />
      </div>



      {/* Total Service in 6 months */}
      <div className='row'>
      <Bar
          data={{
            labels: ["January", "February", "March", "April", "May", "June", "July"],  // các service
            datasets: [
              {
                label: "Total Service in 6 months",
                data: [65, 59, 80, 81, 56, 55, 40], // các số liệu của các service
                backgroundColor: [
                  'rgba(54, 162, 235, 0.2)',
                ],
                borderColor: [
                  'rgb(54, 162, 235)',
                ],
                borderWidth: 1
              },
            ],
          }}
            />
      </div>




    {/* Koi and Pond Chart */}
    <div className='row'>
    <Line
  data={{
    labels: ["January", "February", "March", "April", "May", "June", "July"],
    datasets: [
      {
        label: "Koi",
        data: [65, 59, 80, 81, 56, 55, 40],
        backgroundColor: 'rgba(255, 205, 86, 0.5)',
        borderColor: 'rgb(255, 205, 86)',
        fill: true,  // Bật vùng tô phía dưới
      },
      {
        label: "Pond",
        data: [15, 10, 8, 8, 6, 25, 34],
        backgroundColor: 'rgba(75, 192, 192, 0.5)',
        borderColor: 'rgb(75, 192, 192)',
        fill: true,
      },
    ],
  }}
/>

      </div>
    </div>

    </>
  )
}

export default DashboardPage;