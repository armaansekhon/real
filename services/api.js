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

export const API_BASE_URL = 'http://192.168.6.210:8686/pipl/api/v1';

export const addNewEmployee = async (payload) => {
  try {
    const secretKey = await SecureStore.getItemAsync("auth_token");


        // Sample API response (this should be fetched from the API)
        const categoryData = [
          { "id": 341, "category": "General" },
          { "id": 342, "category": "OBC" },
          { "id": 343, "category": "SC" },
          { "id": 344, "category": "ST" },
          { "id": 345, "category": "EWS" },
          { "id": 984, "category": "BC" },
        ];


         // Create a map of category name to category ID
    const categoryMapping = categoryData.reduce((map, { id, category }) => {
      map[category] = id;
      return map;
    }, {});


    const formData = new FormData();

  // 1. Exclude image and extract it if present (for future use)
    const { image, department, mobile, category, addressLine2, addressLine1, ...restPayload } = payload;


// Replace `mobile` with `contact`
restPayload.contact = mobile;  // Only if mobile exists

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
    
    


// export const addNewEmployee = async (payload) => {
//   const formData = new FormData();
//   const secretKey = await SecureStore.getItemAsync("auth_token");


//     // Flatten all data from the three form sections
//     // const flatData = {
//     //   ...data.employeeDetails,
//     //   ...data.generalDetails,
//     //   ...data.addressDetails,
//     // };

//     const flatData = {
//       //  Only include valid keys
//       designation: data.employeeDetails.designation,
//       employeeType: data.employeeDetails.employeeType,
//       category: data.employeeDetails.category,
//       joiningDate: data.employeeDetails.joiningDate,
//       nationality: data.employeeDetails.nationality,
//       bloodGroup: data.employeeDetails.bloodGroup,
//       salary: data.employeeDetails.salary,
//       maritalStatus: data.employeeDetails.maritalStatus,
//       senior: data.employeeDetails.senior,
//       seniorName: data.employeeDetails.seniorName,
    
//       name: data.generalDetails.name,
//       contact: data.generalDetails.contact,
//       dob: data.generalDetails.dob,
//       email: data.generalDetails.email,
//       fatherName: data.generalDetails.fatherName,
//       motherName: data.generalDetails.motherName,
    
//       addressType: data.addressDetails.addressType,
//       address1: data.addressDetails.address1,
//       address2: data.addressDetails.address2,
//       city: data.addressDetails.city,
//       pincode: data.addressDetails.pincode,
//       district: data.addressDetails.district,
    
//       employee: data.addressDetails.employee,
//     };
    


//     console.log('Calling addNewEmployee API with:', flatData);

// // Append each field from flatData as individual form data
// for (const key in flatData) {
//   if (flatData.hasOwnProperty(key)) {
//     formData.append(key, flatData[key]);
//   }
// }


//     // Append as JSON string under 'data' key
//   formData.append('data', JSON.stringify(flatData));

//   try {
//     const response = await fetch(`${API_BASE_URL}/employee/addNewEmployee`, {
//       method: 'POST',
//       headers: {
//         secret_key: secretKey, // Don't set 'Content-Type' for multipart/form-data
//       },
//       body: formData,
//     });

//     const result = await response.json();
//     if (!response.ok) throw new Error(result.message || 'Failed to submit employee');
//     return result;
//   } catch (error) {
//     console.error('API error:', error);
//     throw error;
//   }
// };
