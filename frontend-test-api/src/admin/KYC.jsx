import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import LogoutButton from "../logout";

function AdminKYC() {
  const [kycData, setKycData] = useState([]);
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null); // State for the selected image
  const [filter, setFilter] = useState({ name: "", status: "" }); // State for filtering
  const [pagination, setPagination] = useState({ page: 1, pageSize: 5 }); // Pagination state
  const [defaultStatus, setDefaultStatus] = useState(""); // State for tracking default dropdown value
  const navigate = useNavigate();

  const navigateToReports = () => {
    navigate("/reports"); // Navigate to reports page
  };

  const fetchKYCData = async () => {
    const token = localStorage.getItem("accessTokenAdmin");
    try {
      const res = await axios.get(
        `http://localhost:5000/admin/kyc?name=${filter.name}&status=${filter.status}&page=${pagination.page}&pageSize=${pagination.pageSize}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setKycData(res.data.data.data); // Set KYC data to state
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchKYCData();
  }, [filter, pagination]); // Fetch data whenever filter or pagination changes

  const handleStatusChange = async (kycId, newStatus) => {
    const token = localStorage.getItem("accessTokenAdmin");
    try {
      const res = await axios.patch(
        `http://localhost:5000/admin/kyc/${kycId}/status`,
        { status: newStatus },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setResponse(res.data);
      // After updating, refetch KYC data to show updated status
      fetchKYCData();
    } catch (err) {
      console.error(err);
    }
  };

  const openModal = (imageUrl) => {
    setSelectedImage(imageUrl); // Set the selected image URL for modal display
  };

  const closeModal = () => {
    setSelectedImage(null); // Close the modal by clearing the selected image URL
  };

  const status = {
    0: "pending",
    1: "approved",
    2: "rejected",
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    
    // Handle the change for status dropdown
    if (name === "status") {
      const statusMap = {
        "0": "pending",
        "1": "approved",
        "2": "rejected",
        "": ""  // Empty string for "All Status"
      };
      
      setFilter({ ...filter, [name]: statusMap[value] || "" });
      setDefaultStatus(value); // Update the default value when status is changed
    } else {
      setFilter({ ...filter, [name]: value });
    }
  };

  const handlePaginationChange = (newPage) => {
    setPagination({ ...pagination, page: newPage });
  };

  return (
    <div>
      <h2>Admin KYC Data</h2>

      {/* Filter Section */}
      <div>
        <input
          type="text"
          name="name"
          value={filter.name}
          onChange={handleFilterChange}
          placeholder="Filter by Name"
        />
        <select
          name="status"
          value={defaultStatus} // Set the selected value for the status dropdown
          onChange={handleFilterChange}
        >
          <option value="">All Statuses</option>
          <option value="0">Pending</option>
          <option value="1">Approved</option>
          <option value="2">Rejected</option>
        </select>
        <button onClick={() => setPagination({ ...pagination, page: 1 })}>
          Apply Filters
        </button>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Username</th>
              <th>Name </th>
              <th>Email</th>
              <th>Status</th>
              <th>Image</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {kycData.map((kyc) => (
              <tr key={kyc.id}>
                <td>{kyc.username}</td>
                <td>{kyc.kyc.name}</td>
                <td>{kyc.email}</td>
                <td>
                  {kyc.kyc.status === 0
                    ? "Pending"
                    : kyc.kyc.status === 1
                    ? "Approved"
                    : "Rejected"}
                </td>
                <td>
                  <img
                    src={kyc.kyc.doc_url}
                    alt="KYC Document"
                    style={{ width: "50px", cursor: "pointer" }}
                    onClick={() => openModal(kyc.kyc.doc_url)} // Open image in modal on click
                  />
                </td>
                <td>
                  <select
                    value={kyc.kyc.status}
                    onChange={(e) =>
                      handleStatusChange(kyc.kyc.id, status[e.target.value])
                    }
                  >
                    <option value={0}>Pending</option>
                    <option value={1}>Approved</option>
                    <option value={2}>Rejected</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Pagination Section */}
      <div>
        <button onClick={() => handlePaginationChange(pagination.page - 1)}>
          Previous
        </button>
        <span>Page {pagination.page}</span>
        <button onClick={() => handlePaginationChange(pagination.page + 1)}>
          Next
        </button>
      </div>

      {/* Display Response */}
      {response && <pre>{JSON.stringify(response, null, 2)}</pre>}

      {/* Modal for displaying image */}
      {selectedImage && (
        <div style={modalStyles}>
          <div style={modalContentStyles}>
            <span style={closeButtonStyles} onClick={closeModal}>
              &times;
            </span>
            <img
              src={selectedImage}
              alt="Selected KYC Document"
              style={modalImageStyles}
            />
          </div>
        </div>
      )}

      <button onClick={navigateToReports}>Go to Reports</button>
      <LogoutButton /> {/* Add the logout button here */}
    </div>
  );
}

// Modal styles
const modalStyles = {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  backgroundColor: "rgba(0, 0, 0, 0.8)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 9999,
};

const modalContentStyles = {
  position: "relative",
  maxWidth: "90%",
  maxHeight: "90%",
};

const closeButtonStyles = {
  position: "absolute",
  top: "10px",
  right: "20px",
  fontSize: "30px",
  color: "white",
  cursor: "pointer",
};

const modalImageStyles = {
  maxWidth: "100%",
  maxHeight: "80vh",
  objectFit: "contain",
};

export default AdminKYC;
