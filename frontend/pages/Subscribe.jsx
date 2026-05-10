import API from "../services/api";
import NavBar from "../components/NavBar";
import { useAuth } from "../context/AuthContext";

const plans = [
  {
    name: "basic",
    title: "Basic",
    price: 299,
    period: "month",
    description: "Perfect for students starting their search",
    features: [
      "Browse all institutes",
      "Save up to 10 favorites",
      "Email support",
      "Basic recommendations",
    ],
    cta: "Get Started",
    popular: false,
    color: "gray",
  },
  {
    name: "premium",
    title: "Premium",
    price: 699,
    period: "month",
    description: "Best for serious students and parents",
    features: [
      "Everything in Basic",
      "Personalized counseling session",
      "Career roadmap generation",
      "Priority email & chat support",
      "Compare institutes side-by-side",
      "Unlimited favorites",
    ],
    cta: "Go Premium",
    popular: true,
    color: "indigo",
  },
  {
    name: "ultra",
    title: "Ultra",
    price: 1499,
    period: "month",
    description: "Full-service career planning and mentorship",
    features: [
      "Everything in Premium",
      "1-on-1 expert mentorship",
      "Interview preparation",
      "Complete career planning",
      "Direct institute contact",
      "Scholarship guidance",
    ],
    cta: "Get Ultra",
    popular: false,
    color: "purple",
  },
];

const Subscribe = () => {
  const { user } = useAuth();

  const handleCheckout = async (plan) => {
    try {
      if (!user) { alert("Please login first"); return; }
      const res = await API.post("payments/create-checkout-session", { plan, userId: user.id });
      window.location.href = res.data.url;
    } catch { alert("Something went wrong. Please try again."); }
  };

  return (
    <>
      <NavBar />
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
        {/* Header */}
        <div className="hero-gradient text-white py-14 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <span className="inline-flex items-center gap-2 bg-white/15 text-white text-xs font-semibold px-3 py-1.5 rounded-full mb-4">
              ⭐ Choose Your Plan
            </span>
            <h1 className="text-3xl sm:text-4xl font-extrabold mb-3">
              Upgrade Your Learning Journey
            </h1>
            <p className="text-indigo-200 text-sm sm:text-base max-w-lg mx-auto">
              Get personalized guidance, expert counseling, and the best tools to find your perfect educational institution.
            </p>
          </div>
        </div>

        {/* Plans */}
        <div className="max-w-5xl mx-auto px-4 py-12">
          <div className="grid md:grid-cols-3 gap-6 items-stretch">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`relative bg-white rounded-2xl overflow-hidden border transition-all flex flex-col ${
                  plan.popular
                    ? "border-indigo-500 shadow-2xl shadow-indigo-100 scale-[1.02]"
                    : "border-gray-200 shadow-sm hover:shadow-md hover:-translate-y-1"
                }`}
              >
                {plan.popular && (
                  <div className="bg-indigo-600 text-white text-center text-xs font-bold py-2 tracking-wider uppercase">
                    Most Popular
                  </div>
                )}

                <div className="p-7 flex flex-col flex-1">
                  <div className="mb-5">
                    <h2 className="text-xl font-bold text-gray-900 mb-1">{plan.title}</h2>
                    <p className="text-sm text-gray-500">{plan.description}</p>
                  </div>

                  <div className="mb-6">
                    <div className="flex items-end gap-1">
                      <span className="text-4xl font-extrabold text-gray-900">₹{plan.price}</span>
                      <span className="text-gray-400 text-sm pb-1">/{plan.period}</span>
                    </div>
                    {plan.popular && (
                      <p className="text-xs text-indigo-600 font-semibold mt-1">Best value for students</p>
                    )}
                  </div>

                  <ul className="space-y-3 mb-8 flex-1">
                    {plan.features.map((f, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                        <span className="text-emerald-500 flex-shrink-0 mt-0.5">✓</span>
                        {f}
                      </li>
                    ))}
                  </ul>

                  <button
                    onClick={() => handleCheckout(plan.name)}
                    className={`w-full py-3 rounded-xl font-bold text-sm transition ${
                      plan.popular
                        ? "bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-200"
                        : "bg-gray-100 hover:bg-gray-200 text-gray-800"
                    }`}
                  >
                    {plan.cta}
                    {plan.popular && " →"}
                  </button>

                  {user?.subscriptionStatus === "active" && user?.subscriptionPlan === plan.name && (
                    <p className="text-center text-xs text-emerald-600 font-semibold mt-2">✓ Current Plan</p>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Trust badges */}
          <div className="mt-12 flex flex-wrap justify-center gap-6 text-sm text-gray-500">
            {["🔒 Secure Payment", "💳 Powered by Stripe", "🔄 Cancel Anytime", "🛡 100% Safe"].map((badge) => (
              <span key={badge} className="flex items-center gap-1">{badge}</span>
            ))}
          </div>

          {/* FAQ teaser */}
          <div className="mt-10 bg-indigo-50 border border-indigo-100 rounded-2xl p-6 text-center">
            <p className="text-sm font-semibold text-gray-800 mb-1">Have questions about plans?</p>
            <p className="text-sm text-gray-500">Contact us at <span className="text-indigo-600 font-medium">support@edufinder.in</span></p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Subscribe;
