import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { subscriptionService } from "../services/subscriptionService";

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading"
  );
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!sessionId) {
      setErrorMessage("Session ID is missing.");
      setStatus("error");
      return;
    }

    const verifyPayment = async () => {
      try {
        const res = await subscriptionService.verifyPayment(sessionId);

        if (res.status === 200) {
          setStatus("success");
          setTimeout(() => {
            navigate("/login");
          }, 2500);
        } else {
          setErrorMessage("Payment verification failed.");
          setStatus("error");
        }
      } catch (err: any) {
        const message =
          err.response?.data?.error || "Network error. Please try again.";
        setErrorMessage(message);
        setStatus("error");
      }
    };

    verifyPayment();
  }, [sessionId, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-blue-100 to-indigo-200 px-4">
      <div className="bg-white shadow-lg rounded-lg max-w-md w-full p-8 text-center animate-fadeIn">
        {status === "loading" && (
          <>
            <svg
              className="mx-auto mb-6 h-12 w-12 animate-spin text-indigo-600"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                strokeWidth="4"
                stroke="currentColor"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v8H4z"
              />
            </svg>
            <p className="text-lg font-medium text-gray-700">
              Verifying your payment, please wait...
            </p>
          </>
        )}

        {status === "success" && (
          <>
            <div className="mx-auto mb-6 w-16 h-16 flex items-center justify-center rounded-full bg-green-100 text-green-600">
              <svg
                className="w-10 h-10"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-2xl font-semibold text-gray-900 mb-2">
              Payment Successful!
            </h1>
            <p className="text-gray-600 mb-4">
              Thank you for your subscription. You will be redirected to your
              dashboard shortly.
            </p>
            <div className="text-sm text-gray-400">
              If you are not redirected automatically,{" "}
              <button
                onClick={() => navigate("/login")}
                className="underline text-indigo-600 hover:text-indigo-800"
              >
                click here
              </button>
              .
            </div>
          </>
        )}

        {status === "error" && (
          <>
            <div className="mx-auto mb-6 w-16 h-16 flex items-center justify-center rounded-full bg-red-100 text-red-600">
              <svg
                className="w-10 h-10"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <circle cx="12" cy="12" r="10" />
                <line x1="15" y1="9" x2="9" y2="15" />
                <line x1="9" y1="9" x2="15" y2="15" />
              </svg>
            </div>
            <h1 className="text-2xl font-semibold text-gray-900 mb-2">
              Payment Verification Failed
            </h1>
            <p className="text-red-600 mb-6">{errorMessage}</p>
            <button
              onClick={() => navigate("/choose-subscription")}
              className="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 transition"
            >
              Choose Subscription Again
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default PaymentSuccess;
