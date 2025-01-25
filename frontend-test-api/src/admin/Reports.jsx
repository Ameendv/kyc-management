import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import LogoutButton from "../logout";



function ReportsPage() {
    
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  const navigateToReports = () => {
    navigate("/admin-kyc"); // Navigate to reports page
  };

  useEffect(() => {
    const fetchReportData = async () => {
      const token = localStorage.getItem("accessTokenAdmin");
      try {
        const res = await axios.get("http://localhost:5000/admin/report", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setReportData(res.data.body); // Set report data to state
        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };

    fetchReportData();
  }, []);

  return (
    <div>
      <h2>Reports</h2>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div>
          <h3>Report Summary</h3>
          <table>
  <thead>
    <tr>
      <th>Total Users</th>
      <th>Pending</th>
      <th>Approved</th>
      <th>Rejected</th>
      <th>Users with no kycs</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>{reportData.totalUsers}</td>
      <td>{reportData.pending}</td>
      <td>{reportData.approved}</td>
      <td>{reportData.rejected}</td>
      <td>{reportData.noKycUsers}</td>
    </tr>
  </tbody>
</table>

        </div>
      )}
      <button onClick={navigateToReports}>Go to Kyc details</button>
      <LogoutButton  />  {/* Add the logout button here */}
    </div>
  );
}

export default ReportsPage;
