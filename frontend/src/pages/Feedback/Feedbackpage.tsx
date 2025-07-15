import FeedbackForm from "../../components/FeedbackForm";

const FeedbackPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 px-6 py-6">
      <div className="max-w-[1200px] w-full mx-auto">
        <div className="mb-4">
          <h1 className="text-2xl font-semibold text-gray-800">
            Feedback & Support
          </h1>

          <div className="flex gap-3 mt-3">
            <button className="px-5 py-1.5 text-sm bg-purple-600 text-white rounded-md hover:bg-purple-700">
              Submit Feedback
            </button>
            <button className="px-5 py-1.5 text-sm text-gray-600 border border-gray-300 rounded-md hover:text-gray-800">
              Manage Feedback
            </button>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-5 sm:p-6 md:p-8">
          <FeedbackForm />
        </div>
      </div>
    </div>
  );
};

export default FeedbackPage;
