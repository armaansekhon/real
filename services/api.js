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




  

// export const addNewEmployee = async (data, image) => {
//   const formData = new FormData();

//   // Append form fields
//   formData.append('name', data.employeeDetails.name);
//   formData.append('contact', data.employeeDetails.contact);
//   formData.append('email', data.employeeDetails.email);
//   formData.append('employeeType', data.employeeDetails.employeeType);
//   formData.append('designation', data.employeeDetails.designation);
//   formData.append('pincode', data.addressDetails.pincode);
//   formData.append('address1', data.addressDetails.address1);
  

//   if (image && image.uri) {
//     formData.append('image', {
//       uri: image.uri,
//       name: 'profile.jpg',
//       type: 'image/jpeg',
//     });
//   } else {
//     console.warn("No image provided — skipping image upload.");
//   }
  

//   // // Ensure the image is valid
//   // if (image && image.uri) {
//   //   formData.append('image', {
//   //     uri: image.uri,
//   //     name: 'profile.jpg',
//   //     type: 'image/jpeg',
//   //   });
//   // } else {
//   //   console.error("Image URI is missing or invalid.");
//   //   return;
//   // }
//   console.log('Calling addNewEmployee API with:', data, image);
//   try {
    

//     const response = await fetch(`${API_BASE_URL}/employee/addNewEmployee`, {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'multipart/form-data',
//       },
//       body: formData,
//     });

    

//     const result = await response.json();
    
//     if (!response.ok) throw new Error(result.message || 'Failed to submit employee');
//     return result;
//   } catch (error) {
//     throw error;
//   }
// };




// const submitEmployeeData = async (formData, image) => {
//   const data = new FormData();

//   // Append form fields
//   data.append("designation", formData.designation); // number
//   data.append("employeeType", formData.employeeType); // number
//   data.append("category", formData.category); // number
//   data.append("joiningDate", formData.joiningDate); // "YYYY-MM-DD"
//   data.append("nationality", formData.nationality); // string
//   data.append("bloodGroup", formData.bloodGroup); // number
//   data.append("salary", formData.salary); // number
//   data.append("maritalStatus", formData.maritalStatus); // string
//   data.append("senior", formData.senior); // number
//   data.append("seniorName", formData.seniorName); // string

//   data.append("name", formData.name); // string
//   data.append("contact", formData.contact); // string
//   data.append("dob", formData.dob); // "YYYY-MM-DD"
//   data.append("email", formData.email); // string
//   data.append("fatherName", formData.fatherName); // string
//   data.append("motherName", formData.motherName); // string

//   data.append("addressType", formData.addressType); // string
//   data.append("address1", formData.address1); // string
//   data.append("address2", formData.address2); // string
//   data.append("city", formData.city); // string
//   data.append("pincode", formData.pincode); // string
//   data.append("district", formData.district); // number
//   data.append("employee", formData.employee); // number

//   // Append image if available
//   if (image) {
//     data.append("image", {
//       uri: image.uri,
//       name: image.fileName || "photo.jpg",
//       type: image.type || "image/jpeg",
//     });
//   }

//   try {
//     const response = await fetch("http://your-backend-url.com/employee/addNewEmployee", {
//       method: "POST",
//       headers: {
//         "Accept": "application/json",
//         "Content-Type": "multipart/form-data",
//       },
//       body: data,
//     });

//     const result = await response.json();
//     if (response.ok) {
//       console.log("Success:", result);
//     } else {
//       console.error("Error:", result);
//     }
//   } catch (error) {
//     console.error("Exception:", error);
//   }
// };


import * as SecureStore from "expo-secure-store";


export const API_BASE_URL = 'http://192.168.6.210:8686/pipl/api/v1';



export const addNewEmployee = async (data) => {
  const formData = new FormData();
  const secretKey = await SecureStore.getItemAsync("auth_token");


    // Flatten all data from the three form sections
    // const flatData = {
    //   ...data.employeeDetails,
    //   ...data.generalDetails,
    //   ...data.addressDetails,
    // };

    const flatData = {
      //  Only include valid keys
      designation: data.employeeDetails.designation,
      employeeType: data.employeeDetails.employeeType,
      category: data.employeeDetails.category,
      joiningDate: data.employeeDetails.joiningDate,
      nationality: data.employeeDetails.nationality,
      bloodGroup: data.employeeDetails.bloodGroup,
      salary: data.employeeDetails.salary,
      maritalStatus: data.employeeDetails.maritalStatus,
      senior: data.employeeDetails.senior,
      seniorName: data.employeeDetails.seniorName,
    
      name: data.generalDetails.name,
      contact: data.generalDetails.contact,
      dob: data.generalDetails.dob,
      email: data.generalDetails.email,
      fatherName: data.generalDetails.fatherName,
      motherName: data.generalDetails.motherName,
    
      addressType: data.addressDetails.addressType,
      address1: data.addressDetails.address1,
      address2: data.addressDetails.address2,
      city: data.addressDetails.city,
      pincode: data.addressDetails.pincode,
      district: data.addressDetails.district,
    
      employee: data.addressDetails.employee,
    };
    


    console.log('Calling addNewEmployee API with:', flatData);

// Append each field from flatData as individual form data
for (const key in flatData) {
  if (flatData.hasOwnProperty(key)) {
    formData.append(key, flatData[key]);
  }
}


    // Append as JSON string under 'data' key
  formData.append('data', JSON.stringify(flatData));

  try {
    const response = await fetch(`${API_BASE_URL}/employee/addNewEmployee`, {
      method: 'POST',
      headers: {
        secret_key: secretKey, // Don't set 'Content-Type' for multipart/form-data
      },
      body: formData,
    });

    const result = await response.json();
    if (!response.ok) throw new Error(result.message || 'Failed to submit employee');
    return result;
  } catch (error) {
    console.error('API error:', error);
    throw error;
  }
};

//   // Employee Details
//   formData.append('designation', data.employeeDetails.designation);
//   formData.append('employeeType', data.employeeDetails.employeeType);
//   formData.append('category', data.employeeDetails.category);
//   formData.append('joiningDate', data.employeeDetails.joiningDate);
//   formData.append('nationality', data.employeeDetails.nationality);
//   formData.append('bloodGroup', data.employeeDetails.bloodGroup);
//   formData.append('salary', data.employeeDetails.salary);
//   formData.append('maritalStatus', data.employeeDetails.maritalStatus);
//   formData.append('senior', data.employeeDetails.senior);
//   formData.append('seniorName', data.employeeDetails.seniorName);

//   // General Details
//   formData.append('name', data.generalDetails.name);
//   formData.append('contact', data.generalDetails.contact);
//   formData.append('dob', data.generalDetails.dob);
//   formData.append('email', data.generalDetails.email);
//   formData.append('fatherName', data.generalDetails.fatherName);
//   formData.append('motherName', data.generalDetails.motherName);

//   // Address Details
//   formData.append('addressType', data.addressDetails.addressType);
//   formData.append('address1', data.addressDetails.address1);
//   formData.append('address2', data.addressDetails.address2);
//   formData.append('city', data.addressDetails.city);
//   formData.append('pincode', data.addressDetails.pincode);
//   formData.append('district', data.addressDetails.district);

//   // Reference to employee (if updating or assigning subfields)
//   formData.append('employee', data.addressDetails.employee);

//   console.log('Calling addNewEmployee API with:', Object.fromEntries(formData));

//   try {
//     const response = await fetch(`${API_BASE_URL}/employee/addNewEmployee`, {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'multipart/form-data',
//         secret_key: secretKey,
//       },
//       body: formData,
//     });

//     const result = await response.json();
//     if (!response.ok) throw new Error(result.message || 'Failed to submit employee');
//     return result;
//   } catch (error) {
//     throw error;
//   }
// };
