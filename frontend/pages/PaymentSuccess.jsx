import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import API from "../services/api";
import {useAuth} from '../context/AuthContext'

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState("loading"); 
  const [plan, setPlan] = useState(null);
  const {updateUser} = useAuth()

  useEffect(() => {
    const activateSub = async () => {
      try {
        const sessionId = searchParams.get("session_id");
        if (!sessionId) {
          setStatus("error");
          return;
        }
        const res = await API.post("/payments/activate-plan", { sessionId });

        if (res.data.success) {
          setPlan(res.data.plan);
          // Update local storage
          const storedUser = localStorage.getItem("user");
          if (storedUser) {
            const updatedUser = JSON.parse(storedUser);
            updatedUser.subscriptionPlan = res.data.plan;
            updatedUser.subscriptionStatus = "active";
            updateUser({
              subscriptionPlan: res.data.plan,
              subscriptionStatus: "active",
            });
          }
          setStatus("success");
        } else {
          setStatus("error");
        }
      } catch (err) {
        console.error(err);
        setStatus("error");
      }
    };
    activateSub();
  }, []);

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <svg className="w-12 h-12 animate-spin text-indigo-600 mx-auto mb-4" fill="none" viewBox="0 0 24 24" aria-hidden="true">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          <p className="text-gray-600 font-medium" role="status">Activating your plan...</p>
        </div>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-10 text-center max-w-md w-full">
          <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center mx-auto mb-5" aria-hidden="true">
            <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h1 className="text-xl font-bold text-gray-900 mb-2">Activation Failed</h1>
          <p className="text-gray-500 text-sm mb-6">We couldn't activate your plan. Your payment may still have gone through. Please contact support.</p>
          <div className="flex flex-col gap-3">
            <Link to="/" className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-indigo-700 transition-colors text-sm">
              Go to Home
            </Link>
            <Link to="/subscribe" className="text-indigo-600 text-sm hover:underline">Try again</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: "linear-gradient(135deg, #f0fdf4 0%, #f0f4ff 100%)" }}>
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-10 text-center max-w-md w-full">
        {/* Animated checkmark */}
        <div className="w-20 h-20 bg-emerald-50 rounded-2xl flex items-center justify-center mx-auto mb-6" aria-hidden="true">
          <svg className="w-10 h-10 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>

        <h1 className="text-2xl font-extrabold text-gray-900 mb-2">Payment Successful! 🎉</h1>
        {plan && (
          <div className="inline-flex items-center gap-2 bg-indigo-50 border border-indigo-200 text-indigo-700 text-sm font-semibold px-4 py-2 rounded-xl mb-4">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            {plan.charAt(0).toUpperCase() + plan.slice(1)} Plan Activated
          </div>
        )}
        <p className="text-gray-500 text-sm mb-7">
          Your subscription is now active. You'll receive a confirmation email shortly.
        </p>

        <Link
          to="/"
          className="block bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-xl font-bold transition-colors text-sm shadow-sm shadow-indigo-200"
        >
          Start Exploring Institutes →
        </Link>
      </div>
    </div>
  );
};

export default PaymentSuccess;
