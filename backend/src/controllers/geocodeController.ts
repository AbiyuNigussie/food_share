import { Request, Response } from "express";
import axios from "axios";

export const handleAutoComplete = async (req: Request, res: Response) => {
  const text = req.query.text;

  if (!text) {
    res.status(400).json({ error: "Missing text query parameter" });
    return;
  }

  try {
    const geoapifyRes = await axios.get(
      "https://api.geoapify.com/v1/geocode/autocomplete",
      {
        params: {
          text,
          apiKey: process.env.GEOAPIFY_API_KEY,
          limit: 5,
        },
      }
    );

    res.json(geoapifyRes.data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Geoapify request failed" });
  }
};
