import React, { useState, useEffect } from "react";
import axios from "axios";
import { Line } from "react-chartjs-2";
import "chart.js/auto";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import { ModuleRegistry } from "ag-grid-community";
import type { ColDef } from "ag-grid-community";
import { AllCommunityModule } from "ag-grid-community";

ModuleRegistry.registerModules([AllCommunityModule]);

interface User {
  [key: string]: string | number | boolean;
}

const App: React.FC = () => {
  const [data, setData] = useState<User[]>([]);

  useEffect(() => {
    axios
      .get("https://dummyjson.com/users")
      .then((res) => setData(res.data.users))
      .catch((err) => console.error(err));
  }, []);

  const getAverage = (field: string): number => {
    const values = data
      .map((user) => Number(user[field]))
      .filter((v) => !isNaN(v));
    const sum = values.reduce((acc, val) => acc + val, 0);
    return values.length > 0 ? Math.round((sum / values.length) * 10) / 10 : 0;
  };

  const chartData = {
    labels: data.map((user) => user.firstName),
    datasets: [
      {
        label: "Age",
        data: data.map((user) => user.age),
        borderColor: "rgba(75,192,192,1)",
        fill: false,
      },
      {
        label: "Height",
        data: data.map((user) => user.height),
        borderColor: "rgba(255,99,132,1)",
        fill: false,
      },
      {
        label: "Weight",
        data: data.map((user) => user.weight),
        borderColor: "rgba(54,162,235,1)",
        fill: false,
      },
    ],
  };

  const rawTableColumns: ColDef[] =
    data.length > 0
      ? Object.keys(data[0]).map((key) => ({
          headerName: key,
          field: key,
        }))
      : [];

  const locationRowData = [
    { city: "New York", state: "NY", country: "USA" },
    { city: "San Francisco", state: "CA", country: "USA" },
    { city: "Berlin", state: "BE", country: "Germany" },
  ];

  const locationColumnDefs: ColDef[] = [
    { headerName: "City", field: "city" },
    { headerName: "State", field: "state" },
    { headerName: "Country", field: "country" },
  ];

  return (
    <div style={{ padding: "20px" }}>
      <h1>User Table & Chart</h1>

      {/* Metric Tiles */}
      <div style={{ display: "flex", gap: "20px", margin: "30px 0" }}>
        <div
          style={{
            background: "#f3f3f3",
            padding: "20px",
            borderRadius: "8px",
            minWidth: "120px",
          }}
        >
          <h4>Avg Age</h4>
          <p>{getAverage("age")}</p>
        </div>
        <div
          style={{
            background: "#f3f3f3",
            padding: "20px",
            borderRadius: "8px",
            minWidth: "120px",
          }}
        >
          <h4>Avg Height</h4>
          <p>{getAverage("height")} cm</p>
        </div>
        <div
          style={{
            background: "#f3f3f3",
            padding: "20px",
            borderRadius: "8px",
            minWidth: "120px",
          }}
        >
          <h4>Avg Weight</h4>
          <p>{getAverage("weight")} kg</p>
        </div>
      </div>

      {/* Chart */}
      <div style={{ marginTop: "20px" }}>
        <Line data={chartData} />
      </div>

      {/* Location Grid */}
      <div style={{ marginTop: "60px" }}>
        <h2>Location Grid (AG Grid)</h2>
        <div
          className="ag-theme-alpine"
          style={{ height: "300px", width: "600px", marginTop: "20px" }}
        >
          <AgGridReact
            rowData={locationRowData}
            columnDefs={locationColumnDefs}
          />
        </div>
      </div>

      {/* Raw User Table */}
      <div style={{ marginTop: "60px" }}>
        <h2>Raw User Table (All Keys from API)</h2>
        <div
          className="ag-theme-alpine"
          style={{ height: "400px", width: "100%", marginTop: "20px" }}
        >
          <AgGridReact
            rowData={data}
            columnDefs={rawTableColumns}
            domLayout="autoHeight"
          />
        </div>
      </div>
    </div>
  );
};

export default App;
