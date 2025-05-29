

import * as SecureStore from "expo-secure-store";

// export const API_BASE_URL = "http://192.168.6.210:8686/realestate/api/v1";
export const API_BASE_URL = "https://project.pisofterp.com/realestate/api/v1";

export const addNewEmployee = async (payload) => {
  try {
    const secretKey = await SecureStore.getItemAsync("auth_token");

    // Sample API response 
    const categoryData = [
      { id: 341, category: "General" },
      { id: 342, category: "OBC" },
      { id: 343, category: "SC" },
      { id: 344, category: "ST" },
      { id: 345, category: "EWS" },
      { id: 984, category: "BC" },
    ];

    // Create a map of category name to category ID
    const categoryMapping = categoryData.reduce((map, { id, category }) => {
      map[category] = id;
      return map;
    }, {});

    const formData = new FormData();

    // 1. Exclude image and extract it if present (for future use)
    const {
      image,
      department,
      mobile,
      category,
      country,
      addressLine2,
      addressLine1,
      stateId,
      ...restPayload
    } = payload;

    // Replace `mobile` with `contact`
    restPayload.contact = mobile; // Only if mobile exists

    restPayload.address2 = addressLine2;
    restPayload.address1 = addressLine1;
    // 3. Look up the categoryId based on the category string from the API response
    if (category && categoryMapping[category]) {
      restPayload.categoryId = categoryMapping[category]; // Assign category ID
    } else {
      restPayload.categoryId = null; // Or handle the case where category is invalid or not found
    }

    // 2. Append the entire payload as a JSON string under "data"
    formData.append("data", JSON.stringify(restPayload));

 

    // 3. If you want to send image later, you'd do:
    // formData.append("image", {
    //   uri: image.uri,
    //   name: image.name || 'profile.jpg',
    //   type: image.type || 'image/jpeg',
    // });


    const response = await fetch(`${API_BASE_URL}/employee/addNewEmployee`, {
      method: "POST",
      headers: {
        secret_key: secretKey,
        // Do NOT set 'Content-Type'
      },
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.text();
      throw new Error(errorData || "Failed to add employee");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error in addNewEmployee:", error);
    throw error;
  }
};



 {/*get all employees*/}

export const getAllEmployees = async () => {  
  try {
    const secretKey = await SecureStore.getItemAsync("auth_token");

    const response = await fetch(`${API_BASE_URL}/employee/employees`, {
      method: "GET",
      headers: {
        secret_key: secretKey,
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || "Failed to fetch employees");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching employees:", error);
    return [];
  }
};



{/*get all employees by id*/}

export const getAllEmployeesbyId = async (id) => {
  try {
    const secretKey = await SecureStore.getItemAsync("auth_token");

    const response = await fetch(`${API_BASE_URL}/employee/employee/${id}`, {
      method: "GET",
      headers: {
        secret_key: secretKey,
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || "Failed to fetch employees");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching employees:", error);
    return [];
  }
};



{/*Update employee */}
export const updateEmployee = async (id, payload, image) => {
  try {
    const secretKey = await SecureStore.getItemAsync("auth_token");

    // build multipart form data
    const formData = new FormData();
    Object.entries(payload).forEach(([k, v]) => {
      // append every field, substituting empty string for null/undefined
      formData.append(k, v ?? "");
    });

    if (image) {
      formData.append("profileImage", {
        uri: image.uri,
        name: image.fileName || "profile.jpg",
        type: image.type || "image/jpeg",
      });
    }

    const res = await fetch(
      `${API_BASE_URL}/employee/updateEmployee/${id}`,
      {
        method: "PUT",
        headers: {
          secret_key: secretKey,
          Accept: "application/json",
          "Content-Type": "multipart/form-data",
        },
        body: formData,
      }
    );

    if (!res.ok) {
      const text = await res.text();
      throw new Error(text || "Update failed");
    }

    return await res.json();
  } catch (err) {
    console.error("updateEmployee error:", err);
    throw err;
  }
};






{/*get all junior requested leaves */}


export const getAllJuniorRequestedLeaves = async (employeeId) => {
  try {
    const secretKey = await SecureStore.getItemAsync("auth_token");

    const response = await fetch(
      `${API_BASE_URL}/employee/getAllJuniorRequestedLeaves/employeeId/${employeeId}`,
      {
        method: "GET",
        headers: {
          secret_key: secretKey,
          "Content-Type": "application/json",
          // Accept: "application/json",
        },
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || "Failed to fetch junior requested leaves");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching junior requested leaves:", error);
    return [];
  }
};



/* Get leave details by ID */
export const getLeaveById = async (leaveId) => {
  try {
    const secretKey = await SecureStore.getItemAsync("auth_token");

    const response = await fetch(`${API_BASE_URL}/employee/getLeaveById/${leaveId}`, {
      method: "GET",
      headers: {
        secret_key: secretKey,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || "Failed to fetch leave details");
    }

    const data = await response.json();
    console.log("API Response for leaveId:", leaveId, data);

    // If the response is an array, find the specific leave
    if (Array.isArray(data)) {
      return data.find((item) => String(item.id) === String(leaveId)) || null;
    }

    return data; // Return the data directly if it's not an array
  } catch (error) {
    console.error("Error fetching leave details:", error.message);
    return null;
  }
};



/* Get leave app authority */
export const getLeaveApprovalAuthority = async (employeeId) => {
  try {
    const secretKey = await SecureStore.getItemAsync("auth_token");

    const response = await fetch(
      `${API_BASE_URL}/employee/getLeaveApprovalAuthority/employeeId/${employeeId}`,
      {
        method: "GET",
        headers: {
          secret_key: secretKey,
          "Content-Type": "application/json",
        },
      }
    );

    if (!employeeId) {
      console.error("employeeId is undefined");
      return;
    }
    

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || "Failed to fetch leave approval authority");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching leave approval authority:", error);
    return null;
  }
};



/* Submit Leave Action */
export const submitLeaveAction = async ({ leaveId, leaveStatus, remarks, updatedBy, updateDate }) => {
  try {
    const secretKey = await SecureStore.getItemAsync("auth_token");

    const response = await fetch(`${API_BASE_URL}/employee/action-on-leave`, {
      method: "POST",
      headers: {
        secret_key: secretKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        leaveId,
        leaveStatus,
        remarks,
        updatedBy,
        updateDate,
      }),
    });

    const contentType = response.headers.get("content-type");

    let data;
    if (contentType && contentType.includes("application/json")) {
      data = await response.json();
    } else {
      const text = await response.text();
      throw new Error(`Unexpected response:  Admin can't perform Leave actions `);
    }

    if (!response.ok) {
      throw new Error(data.message || "Leave action failed.");
    }

    return data;
  } catch (error) {
    console.error("Error in submitLeaveAction:", error);
    throw error;
  }
};




/* get movement reasons */

export const getMovementReasons = async () => {
  try {
    const secretKey = await SecureStore.getItemAsync("auth_token");

    const response = await fetch(`${API_BASE_URL}/employee/movementReasons`, {
      method: "GET",
      headers: {
        secret_key: secretKey,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || "Failed to fetch movement reasons");
    }

    const data = await response.json();

    // Transform data to { label, value } format for dropdown
    return data.map((item) => ({
      label: item.mReason,
      value: item.id,
    }));
  } catch (error) {
    console.error("Error fetching movement reasons:", error);
    return [];
  }
};



/* Submit Movement Request */
export const submitMovementRequest = async ({
  mRequestedDate,
  initiatedBy,
  fromTime,
  toTime,
  movementReasonId,
  description,
}) => {
  try {
    const secretKey = await SecureStore.getItemAsync("auth_token");

    const response = await fetch(`${API_BASE_URL}/employee/save-movement-request`, {
      method: "POST",
      headers: {
        secret_key: secretKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        mRequestedDate,
        initiatedBy,
        fromTime,
        toTime,
        movementReasonId,
        description,
      }),
    });

    const contentType = response.headers.get("content-type");

    let data;
    if (contentType && contentType.includes("application/json")) {
      data = await response.json();
    } else {
      const text = await response.text();
      throw new Error(`Unexpected response:  Admin can't perform Leave actions ${text}`);
    }

    if (!response.ok) {
      throw new Error(data.message || "Movement request failed.");
    }

    return data;
  } catch (error) {
    console.error("Error in submitMovementRequest:", error);
    throw error;
  }
};

{/*get all junior requested movements */}


export const getAllJuniorRequestedMovements = async (employeeId) => {
  try {
    const secretKey = await SecureStore.getItemAsync("auth_token");

    const response = await fetch(
      `${API_BASE_URL}/employee/getAllJuniorRequestedMovements/employeeId/${employeeId}`,
      {
        method: "GET",
        headers: {
          secret_key: secretKey,
          "Content-Type": "application/json",
          // Accept: "application/json",
        },
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || "Failed to fetch junior requested movements");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching junior requested movements:", error);
    return [];
  }
};


/* Get movement details by ID */
export const getMovementById = async (mId) => {
  try {
    const secretKey = await SecureStore.getItemAsync("auth_token");

    const response = await fetch(`${API_BASE_URL}/employee/getMovementRequestById/${mId}`, {
      method: "GET",
      headers: {
        secret_key: secretKey,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || "Failed to fetch movement details");
    }

    const data = await response.json();
    console.log("API Response for mId:", mId, data);


    // const cleanKeys = (obj) =>
    //   Object.fromEntries(Object.entries(obj).map(([k, v]) => [k.trim(), v]));

    // if (Array.isArray(data)) {
    //   const found = data.find((item) => String(item.mId) === String(mId));
    //   return found ? cleanKeys(found) : null;
    // }

    // return cleanKeys(data);
    if (Array.isArray(data)) {
      return data.find((item) => String(item.mId) === String(mId)) || null;
    }

    return data; 
  } catch (error) {
    console.error("Error fetching movement details:", error.message);
    return null;
  }
};


/* Submit Movement Action */
export const submitMovementAction = async ({ movementRequestId, status, remarks, updatedBy, updateDate }) => {
  try {
    const secretKey = await SecureStore.getItemAsync("auth_token");

    const response = await fetch(`${API_BASE_URL}/employee/movement-requests-action`, {
      method: "POST",
      headers: {
        secret_key: secretKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        movementRequestId,
        status,
        remarks,
        updatedBy,
        updateDate,
      }),
    });

    const contentType = response.headers.get("content-type");

    let data;
    if (contentType && contentType.includes("application/json")) {
      data = await response.json();
    } else {
      const text = await response.text();
      throw new Error(`Unexpected response: ${text}`);
    }

    if (!response.ok) {
      throw new Error(data.message || "Movement action failed.");
    }

    return data;
  } catch (error) {
    console.error("Error in submitMovementAction:", error);
    throw error;
  }
};


 {/*get all Active Or Inactive Employees*/}

 export const getAllActiveOrInactiveEmployees = async () => {  
  try {
    const secretKey = await SecureStore.getItemAsync("auth_token");

    const response = await fetch(`${API_BASE_URL}/employee/getAllActiveOrInactiveEmployees`, {
      method: "GET",
      headers: {
        secret_key: secretKey,
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || "Failed to fetch employees");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching employees:", error);
    return [];
  }
};

 {/*get my movements*/}

// export const getMyMovements = async (employeeId) => {
//   try {
//     const secretKey = await SecureStore.getItemAsync("auth_token");

//     const response = await fetch(
//       `${API_BASE_URL}/employee/my-movements/employeeId/${employeeId}`,
//       {
//         method: "GET",
//         headers: {
//           secret_key: secretKey,
//           "Content-Type": "application/json",
//         },
//       }
//     );

//     if (!response.ok) {
//       const errorText = await response.text();
//       throw new Error(errorText || "Failed to fetch movements");
//     }

//     const data = await response.json();
//     return data;
//   } catch (error) {
//     console.error("Error fetching my movements:", error);
//     return [];
//   }
// };
