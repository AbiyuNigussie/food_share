import React from "react";

type PaginationProps = {
  page: number;
  rowsPerPage: number;
  total: number;
  onPageChange: (newPage: number) => void;
};

const PaginationControls: React.FC<PaginationProps> = ({
  page,
  rowsPerPage,
  total,
  onPageChange,
}) => {
  const totalPages = Math.ceil(total / rowsPerPage);

  const handlePrevious = () => {
    if (page > 1) {
      onPageChange(page - 1);
    }
  };

  const handleNext = () => {
    if (page < totalPages) {
      onPageChange(page + 1);
    }
  };

  return (
    <div className="flex justify-between items-center mt-4">
      <button
        onClick={handlePrevious}
        disabled={page === 1}
        className="px-4 py-2 bg-gray-200 text-gray-800 rounded disabled:opacity-50"
      >
        Previous
      </button>
      <span className="text-sm text-gray-700">
        Page {page} of {totalPages}
      </span>
      <button
        onClick={handleNext}
        disabled={page === totalPages}
        className="px-4 py-2 bg-gray-200 text-gray-800 rounded disabled:opacity-50"
      >
        Next
      </button>
    </div>
  );
};

export default PaginationControls;
