import axios from "axios";

const BASE_URL = import.meta.env.BASE_URL || "http://localhost:5000/api";

export type Place = {
  label: string;
  lat: number;
  lon: number;
};

export const geocodeService = {
  getAutoComplete: async (text: string) => {
    const params = new URLSearchParams();

    if (text) {
      params.append("text", text);
    }

    return axios.get(`${BASE_URL}/geocode/autocomplete?${params.toString()}`);
  },
};
