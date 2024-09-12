import React, { useState, useEffect } from "react";
import MMDBCard from "./MMDBCard";
import axios from "axios";
import moment from "moment";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Cell,
} from "recharts";

function MMDashboard() {
  const [crops, setCrops] = useState([]);
  const [highestPriceCrop, setHighestPriceCrop] = useState(null);
  const [highestThisWeek, setHighestThisWeek] = useState(null);
  const [dailyHighest, setDailyHighest] = useState([]);
  const colors = [
    "#8884d8",
    "#82ca9d",
    "#ffc658",
    "#ff8042",
    "#8dd1e1",
    "#d0ed57",
    "#a4de6c",
  ];

  useEffect(() => {
    function getCrops() {
      axios
        .get(`${process.env.REACT_APP_BACKEND_URL}/crop/croplist`)
        .then((res) => {
          const crops = res.data;
          setCrops(crops);
          if (crops.length > 0) {
            const highestCrop = crops.reduce((prev, current) => {
              return prev.Price > current.Price ? prev : current;
            });
            setHighestPriceCrop(highestCrop);
          }
        })
        .catch((err) => {
          alert("Error fetching crops");
        });
    }
    getCrops();
  }, []);

  useEffect(() => {
    function getCrophistory() {
      axios
        .get(`${process.env.REACT_APP_BACKEND_URL}/crop/gethistory`)
        .then((res) => {
          const filteredCrops = res.data;
          const today = moment();
          const weekStart = today.subtract(7, "days");

          const thisWeekCrops = filteredCrops.filter((crop) =>
            moment(crop.date, "DD/MM/YYYY").isSameOrAfter(weekStart)
          );

          const dailyCrops = {};
          thisWeekCrops.forEach((crop) => {
            const cropDate = moment(crop.date, "DD/MM/YYYY").format(
              "DD/MM/YYYY"
            );
            if (
              !dailyCrops[cropDate] ||
              dailyCrops[cropDate].Price < crop.Price
            ) {
              dailyCrops[cropDate] = crop;
            }
          });

          const dailyHighestArray = Object.keys(dailyCrops)
            .map((date) => ({
              date,
              Crop_name: dailyCrops[date].Crop_name,
              Price: dailyCrops[date].Price,
            }))
            .sort(
              (a, b) =>
                moment(a.date, "DD/MM/YYYY") - moment(b.date, "DD/MM/YYYY")
            );

          setDailyHighest(dailyHighestArray);

          setDailyHighest(dailyHighestArray);

          if (thisWeekCrops.length > 0) {
            const highestCropThisWeek = thisWeekCrops.reduce(
              (prev, current) => {
                return prev.Price > current.Price ? prev : current;
              }
            );
            setHighestThisWeek(highestCropThisWeek);
          }
        })
        .catch((err) => {
          alert("error fetching crop history");
        });
    }
    getCrophistory();
  }, []);

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const { date, Price, Crop_name } = payload[0].payload;
      return (
        <div
          className="custom-tooltip"
          style={{
            backgroundColor: "#fff",
            padding: "10px",
            border: "1px solid #ccc",
          }}
        >
          <p>
            <strong>Crop:</strong> {Crop_name}
            <br/>
            <strong>Price:</strong> Rs.{Price}.00 per 1kg
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <section>
      <div className="col">
        <div className="row">
          {highestPriceCrop && (
            <MMDBCard
              title="Today Market Trend"
              value1={`${highestPriceCrop.Crop_name}`}
              value2={`Price Per 1kg : Rs.${highestPriceCrop.Price}.00`}
              iconClass="bi bi-calendar-event"
              duration="Islandwide"
            />
          )}
          {highestThisWeek && (
            <MMDBCard
              title="This Week Market Trend"
              value1={`${highestThisWeek.Crop_name}`}
              value2={`Price Per 1kg : Rs.${highestThisWeek.Price}.00`}
              iconClass="bi bi-calendar-week"
              duration="Islandwide"
            />
          )}
        </div>
        <div className="row">
          {/* Bar Chart for this week's highest price crops */}
          <h2>Daily Trends For This Week</h2>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={dailyHighest}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Bar dataKey="Price" >
                {dailyHighest.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={colors[index % colors.length]}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </section>
  );
}

export default MMDashboard;
