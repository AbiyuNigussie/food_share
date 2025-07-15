import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { subscriptionService } from "../services/subscriptionService";

const plans = [
  {
    name: "Starter",
    amount: 10,
    features: ["Basic access", "1 active request", "Community support"],
  },
  {
    name: "Pro",
    amount: 25,
    features: ["Up to 5 active requests", "Priority matching", "Email support"],
  },
  {
    name: "Enterprise",
    amount: 50,
    features: [
      "Unlimited requests",
      "Dedicated support",
      "Early access to features",
    ],
  },
];

const SubscriptionPage: React.FC = () => {
  const navigate = useNavigate();
  const [selectedPlan, setSelectedPlan] = useState("Starter");
  const [user, setUser] = useState<{
    email: string;
    firstName: string;
    lastName: string;
  } | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("subscriptionUser");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else {
      toast.error("User info not found. Please register first.");
      navigate("/register");
    }
  }, [navigate]);

  const handleSubscribe = async () => {
    const planInfo = plans.find((p) => p.name === selectedPlan);
    if (!planInfo || !user) return;

    try {
      const { data } = await subscriptionService.initializePayment({
        amount: planInfo.amount,
        currency: "usd",
        email: user.email,
        first_name: user.firstName,
        last_name: user.lastName,
        plan: selectedPlan,
      });

      if (data.checkout_url) {
        window.location.href = data.checkout_url;
      } else {
        toast.error("Failed to initiate payment.");
      }
    } catch (err) {
      toast.error("Error during payment setup.");
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-6 py-12">
      <div className="max-w-6xl w-full">
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-4">
          Choose Your Subscription Plan
        </h1>
        <p className="text-center text-gray-600 mb-10 text-lg">
          Select a plan that suits your needs. You can always upgrade later.
        </p>

        <div className="grid md:grid-cols-3 gap-8">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`rounded-2xl border-2 p-8 shadow-md transition duration-300 ${
                selectedPlan === plan.name
                  ? "border-primary"
                  : "border-gray-200"
              } bg-white`}
            >
              <div className="flex flex-col justify-between h-full">
                <div>
                  <h3 className="text-2xl font-semibold text-gray-800 mb-3">
                    {plan.name}
                  </h3>
                  <p className="text-3xl font-bold text-primary mb-5">
                    ${plan.amount}/month
                  </p>
                  <ul className="space-y-3 text-base text-gray-700">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-primary text-lg">✔</span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>

                <button
                  onClick={() => setSelectedPlan(plan.name)}
                  className={`mt-6 w-full py-3 px-4 rounded-lg font-medium text-white transition ${
                    selectedPlan === plan.name
                      ? "bg-purple-600"
                      : "bg-gray-500 hover:bg-gray-600"
                  }`}
                >
                  {selectedPlan === plan.name ? "Selected" : "Select"}
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 flex justify-center">
          <button
            onClick={handleSubscribe}
            className="bg-green-500 hover:bg-primary-dark text-white font-semibold text-lg py-3 px-10 rounded-xl shadow-lg transition"
          >
            Proceed to Payment
          </button>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionPage;
