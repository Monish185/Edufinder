import { Link } from "react-router-dom";
import NavBar from "../components/NavBar";

const PaymentCancel = () => (
  <div className="min-h-screen bg-slate-50">
    <NavBar />
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-64px)] px-4">
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-10 max-w-md w-full text-center">
        <div className="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-5">
          <span className="text-4xl">😕</span>
        </div>
        <h1 className="text-2xl font-extrabold text-gray-900 mb-2">Payment Cancelled</h1>
        <p className="text-gray-500 text-sm mb-6">
          No charge was made. You can try again whenever you're ready.
        </p>
        <div className="flex flex-col gap-3">
          <Link to="/subscribe" className="block w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-xl font-semibold transition text-sm">
            View Plans Again
          </Link>
          <Link to="/" className="block w-full bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 rounded-xl font-semibold transition text-sm">
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  </div>
);

export default PaymentCancel;
