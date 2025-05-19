// hooks/useTestAPIs.js
import { useEffect } from 'react';
import axios from 'axios';


// const API_BASE_URL = 'http://192.168.6.210:8082/pipl/api/v1/';

const endpoints = [
  'property-natures',
  'face-directions',
  'facilities',
  'amenities',
  'furnishing-statuses',
  'flat-house-structures',
  'parking-types',
  'shop-showroom-categories',
  'room-types',
  'ownership-types',
  'measurement-units'
];

const useTestAPIs = () => {
  useEffect(() => {
    const fetchAll = async () => {
      for (const endpoint of endpoints) {
        try {
          const res = await axios.get(`${API_BASE_URL}/${endpoint}`);
          console.log(`✅ ${endpoint}:`, res.data);
        } catch (err) {
          console.error(`❌ Error fetching ${endpoint}:`, err.message);
        }
      }
    };

    fetchAll();
  }, []);
};

export default useTestAPIs;
