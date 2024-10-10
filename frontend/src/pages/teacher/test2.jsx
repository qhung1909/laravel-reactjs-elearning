// Components/TermsModal.jsx
// eslint-disable-next-line react/prop-types
const TermsModal = ({ onClose }) => {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
        <div className="bg-white p-6 rounded shadow-lg">
          <h2 className="text-xl font-bold">Terms and Conditions</h2>
          <p>
            {/* Nội dung điều khoản và điều kiện */}
            Đây là nội dung của điều khoản và điều kiện.
          </p>
          <button
            onClick={onClose}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
          >
            Đóng
          </button>
        </div>
      </div>
    );
  };

  export default TermsModal;
