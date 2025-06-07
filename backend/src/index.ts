import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { UserAuthRoutes } from "./routes/user/authRoute";
import adminAuthRoute from "./routes/admin/authRoute";
import donationRoutes from "./routes/donationRoute";
import recipientNeedRoute from "./routes/recipientNeedRoute";
import deliveryRoute from "./routes/deliveryRoute";
import notificationRoute from "./routes/notificationRoute";
import recipientDonationRoutes from "./routes/recipientDonationRoute";
import paymentRoute from "./routes/paymentRoute";
import { GeoMapRoutes } from "./routes/geomapRoute";
dotenv.config();

const app = express();
const PORT = process.env.PORT;

app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json());

app.use("/api/user/auth", UserAuthRoutes);
app.use("/api/admin/auth", adminAuthRoute);
app.use("/api", donationRoutes);
app.use("/api", recipientNeedRoute);
app.use("/api", deliveryRoute);
app.use("/api", notificationRoute);
app.use("/api", recipientDonationRoutes);
app.use("/api/geocode", GeoMapRoutes);
app.use("/api/payment", paymentRoute);

app.get("/", (req, res) => {
  res.send("Hello, welcome to the ekekiyans gang with typeScript and Express!");
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
