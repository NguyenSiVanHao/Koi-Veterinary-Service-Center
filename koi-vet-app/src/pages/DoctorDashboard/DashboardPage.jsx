import React, { useEffect, useState } from "react";
import { Chart as ChartJS, defaults } from "chart.js/auto";
import { Bar, Line, Radar } from "react-chartjs-2";
import "./DashboardPage.css";
import { fetchDashboardAPI } from "../../apis";
import AdminHeader from "../../components/AdminHeader/AdminHeader";
import { Space, DatePicker, message } from "antd";
import moment from "moment";

defaults.maintainAspectRatio = false;
defaults.responsive = true;

const { RangePicker } = DatePicker;

function DashboardPage() {
  const [dashboardData, setDashboardData] = useState([]);
  const [chartLabels, setChartLabels] = useState([]);
  const [revenueData, setRevenueData] = useState([]);
  const [koiData, setKoiData] = useState([]);
  const [pondData, setPondData] = useState([]);
  const [appointmentData, setAppointmentData] = useState([]);

  const [time, setTime] = useState("day");
  const [starTime, setStarTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [dateRange, setDateRange] = useState([null, null]);
  const [messageApi, contextHolder] = message.useMessage();

  const showWarning = (content) => {
    messageApi.warning(content);
  };

  const validateDateRange = (start, end, currentTime) => {
    if (!start || !end) return false;

    const diffDays = end.diff(start, 'days');
    const diffMonths = end.diff(start, 'months');
    const diffYears = end.diff(start, 'years');

    if (currentTime === "day" && diffDays > 30) {
      showWarning("Please select a range of 30 days or less for daily view.");
      return false;
    } else if (currentTime === "month" && diffMonths > 12) {
      showWarning("Please select a range of 12 months or less for monthly view.");
      return false;
    } else if (currentTime === "year" && diffYears > 3) {
      showWarning("Please select a range of 3 years or less for yearly view.");
      return false;
    }
    return true;
  };

  const handleDateChange = (dates, dateStrings) => {
    if (dates && dates[0] && dates[1]) {
      let start = dates[0];
      let end = dates[1];

      if (validateDateRange(start, end, time)) {
        setDateRange([start, end]);
        setStarTime(start.format("YYYY-MM-DD"));
        setEndTime(end.format("YYYY-MM-DD"));
      } else {
        setDateRange([null, null]);
      }
    } else {
      setDateRange([null, null]);
      setStarTime("");
      setEndTime("");
    }
  };

  const updateTimeRange = (newTime) => {
    setTime(newTime);
    let start, end;

    if (dateRange[0] && dateRange[1]) {
      start = dateRange[0].clone();
      end = dateRange[1].clone();

      if (newTime === "month") {
        start = start.startOf('month');
        end = end.endOf('month');
      } else if (newTime === "year") {
        start = start.startOf('year');
        end = end.endOf('year');
      }

      if (validateDateRange(start, end, newTime)) {
        setDateRange([start, end]);
        setStarTime(start.format("YYYY-MM-DD"));
        setEndTime(end.format("YYYY-MM-DD"));
        return;
      }
    }

    // If the current range is invalid for the new time, set default range
    end = moment();
    switch (newTime) {
      case "day":
        start = moment().subtract(7, 'days');
        break;
      case "month":
        start = moment().subtract(3, 'months').startOf('month');
        end = end.endOf('month');
        break;
      case "year":
        start = moment().subtract(1, 'year').startOf('year');
        end = end.endOf('year');
        break;
      default:
        start = moment().subtract(7, 'days');
    }
    setDateRange([start, end]);
    setStarTime(start.format("YYYY-MM-DD"));
    setEndTime(end.format("YYYY-MM-DD"));
  };

  useEffect(() => {
    const fetchData = async () => {
      console.log("Fetching data with params:", { starTime, endTime, time });
      const response = await fetchDashboardAPI(starTime, endTime, time);
      console.log("API Data:", response.data);
      setDashboardData(response.data || []);

      // Generate labels and prepare data based on the selected time range
      let labels = [];
      const start = moment(starTime);
      const end = moment(endTime);

      if (time === "day") {
        for (let date = start.clone(); date.isSameOrBefore(end); date.add(1, 'day')) {
          labels.push(date.format('YYYY-MM-DD'));
        }
      } else if (time === "month") {
        for (let date = start.clone().startOf('month'); date.isSameOrBefore(end, 'month'); date.add(1, 'month')) {
          labels.push(date.format('YYYY-MM'));
        }
      } else if (time === "year") {
        for (let date = start.clone(); date.isSameOrBefore(end); date.add(1, 'year')) {
          labels.push(date.format('YYYY'));
        }
      }

      setChartLabels(labels);

      // Prepare data for charts
      const prepareData = (dataKey) => {
        return labels.map(label => {
          let value = 0;
          response.data.forEach(item => {
            const itemDate = moment(item.date);
            if (
              (time === "day" && itemDate.format('YYYY-MM-DD') === label) ||
              (time === "month" && itemDate.format('YYYY-MM') === label) ||
              (time === "year" && itemDate.format('YYYY') === label)
            ) {
              value += item[dataKey];
            }
          });
          return value;
        });
      };

      setRevenueData(prepareData('totalRevenue'));
      setKoiData(prepareData('totalKoi'));
      setPondData(prepareData('totalPond'));
      setAppointmentData(prepareData('totalAppointment'));

      console.log("Prepared Data:", {
        labels,
        revenue: prepareData('totalRevenue'),
        koi: prepareData('totalKoi'),
        pond: prepareData('totalPond'),
        appointment: prepareData('totalAppointment')
      });
    };
    
    if (starTime && endTime) {
      fetchData();
    }
  }, [time, starTime, endTime]);

  const totalAppointmentcard = dashboardData.reduce((sum, item) => sum + item.totalAppointment, 0);
  const totalKoicard = dashboardData.reduce((sum, item) => sum + item.totalKoi, 0);
  const totalPondcard = dashboardData.reduce((sum, item) => sum + item.totalPond, 0);
  const totalRevenuecard = dashboardData.reduce((sum, item) => sum + item.totalRevenue, 0);

  return (
    <div className="container">
      {contextHolder}
      <AdminHeader title="Dashboard" />
      <nav className="w-100" style={{ marginBottom: "20px" }}>
        <div className="nav nav-tabs" id="nav-tab" role="tablist">
          <button
            className="nav-link custom-text-color"
            onClick={() => updateTimeRange("day")}
          >
            Day
          </button>
          <button
            className="nav-link custom-text-color"
            onClick={() => updateTimeRange("month")}
          >
            Month
          </button>
          <button
            className="nav-link custom-text-color"
            onClick={() => updateTimeRange("year")}
          >
            Year
          </button>
        </div>
      </nav>
      <Space direction="vertical" size={12}>
        <RangePicker
          value={dateRange}
          onChange={handleDateChange}
          picker={time === "month" ? "month" : time === "year" ? "year" : "date"}
        />
      </Space>
      <div className="row dashboard-card">
        <div className="col-md-3">
          <div
            className="card"
            style={{
              height: "100px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              fontWeight: "bold",
              backgroundColor: "#E74C35",
              color: "white",
            }}
          >
            Total Appointment
            <p>{totalAppointmentcard}</p>
          </div>
        </div>
        <div className="col-md-3">
          <div
            className="card"
            style={{
              height: "100px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              fontWeight: "bold",
              backgroundColor: "#FFC001 ",
              color: "white",
            }}
          >
            Total Koi
            <p>{totalKoicard}</p>
          </div>
        </div>
        <div className="col-md-3">
          <div
            className="card"
            style={{
              height: "100px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              fontWeight: "bold",
              backgroundColor: "#01A15F",
              color: "white",
            }}
          >
            Total Pond
            <p>{totalPondcard}</p>
          </div>
        </div>
        <div className="col-md-3">
          <div
            className="card"
            style={{
              height: "100px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              fontWeight: "bold",
              backgroundColor: "#9479DA ",
              color: "white",
            }}
          >
            Total Revenue
            <p>{totalRevenuecard.toLocaleString()} VND</p>
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col-md-12">
          <div className="dataCard numberCard">
            <Bar
              data={{
                labels: chartLabels,
                datasets: [
                  {
                    label: "Revenue",
                    data: revenueData,
                    backgroundColor: "#9479DA",
                    borderColor: "#9479DA",
                  },
                ],
              }}
            />
          </div>
        </div>
      </div>
      <div className="row doughnut-line-chart">
        <div className="col-md-6">
          <div className="dataCard categoryCard">
            <Radar
              data={{
                labels: chartLabels,
                datasets: [
                  {
                    label: "Koi",
                    data: koiData,
                    backgroundColor: "rgba(75, 192, 192, 0.2)",
                    borderColor: "rgba(75, 192, 192, 1)",
                    borderWidth: 1,
                    pointBackgroundColor: "rgba(75, 192, 192, 1)",
                    pointBorderColor: "#fff",
                    pointHoverBackgroundColor: "#fff",
                    pointHoverBorderColor: "rgba(75, 192, 192, 1)",
                  },
                  {
                    label: "Pond",
                    data: pondData,
                    backgroundColor: "rgba(255, 165, 0, 0.2)",
                    borderColor: "rgba(255, 165, 0, 1)",
                    borderWidth: 1,
                    pointBackgroundColor: "rgba(255, 165, 0, 1)",
                    pointBorderColor: "#fff",
                    pointHoverBackgroundColor: "#fff",
                    pointHoverBorderColor: "rgba(255, 165, 0, 1)",
                  },
                ],
              }}
            />
          </div>
        </div>
        <div className="col-md-6">
          <div className="dataCard categoryCard">
            <Line
              data={{
                labels: chartLabels,
                datasets: [
                  {
                    label: "Appointment",
                    data: appointmentData,
                    borderColor: "#E74C35",
                    backgroundColor: "#E74C35",
                  },
                ],
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardPage;
