// api.js
// export const API_BASE_URL = 'http://192.168.6.210:8686/pipl/api/v1';

// export const test1="GET /api/v1/property-natures";
// // GET /api/v1/face-directions
// // GET /api/v1/facilities
// // GET /api/v1/amenities
// // GET /api/v1/furnishing-statuses
// // GET /api/v1/flat-house-structures
// // GET /api/v1/parking-types
// // GET /api/v1/shop-showroom-categories
// // GET /api/v1/room-types
// // GET /api/v1/ownership-types
// // GET /api/v1/measurement-units

import * as SecureStore from "expo-secure-store";

export const API_BASE_URL = "http://192.168.6.210:8686/pipl/api/v1";

export const addNewEmployee = async (payload) => {
  try {
    const secretKey = await SecureStore.getItemAsync("auth_token");

    // Sample API response (this should be fetched from the API)
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
      addressLine2,
      addressLine1,
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

