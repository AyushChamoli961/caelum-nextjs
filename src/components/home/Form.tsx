"use client";

import { useState } from "react";
import { Modal } from "@/components/ui/Modal";

interface FormValues {
  name: string;
  email: string;
  phone: string;
  state: string;
  city: string;
  termsAccepted: boolean;
}

const Form = () => {
  const [formValues, setFormValues] = useState<FormValues>({
    name: "",
    email: "",
    phone: "",
    state: "",
    city: "",
    termsAccepted: false,
  });

  const [otpVisible, setOtpVisible] = useState(false);
  const [enteredOtp, setEnteredOtp] = useState("");
  const [message, setMessage] = useState("");
  const [verified, setVerified] = useState(false);
  const [loading, setLoading] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);
  const DUMMY_OTP = "123456";

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    setFormValues((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Handle "Generate OTP" — only save lead
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setVerified(false);

    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formValues,
          "otp": DUMMY_OTP, // fixed dummy otp
        }),
      });

      const data = await res.json();
      console.log("Lead API Response:", data);

      if (data.success) {
        setOtpVisible(true);
        setMessage(`OTP generated successfully`);
      } else {
        setMessage(data.message || "Failed to generate OTP.");
      }
    } catch (error) {
      console.error("Error submitting lead:", error);
      setMessage("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Handle "Verify OTP"
  const handleVerifyOtp = async () => {
    if (enteredOtp.trim() !== DUMMY_OTP) {
      setMessage("Invalid OTP. Please try again.");
      return;
    }

    setOtpLoading(true);
    try {
      const res = await fetch("/api/leads/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phone: formValues.phone.trim(),
          otp: DUMMY_OTP, // fixed dummy otp
        }),
      });

      const data = await res.json();
      console.log("Verify API Response:", data);

      if (data.success) {
        setVerified(true);
        setOtpVisible(false);
      } else {
        setMessage(data.message);
      }
    } catch (error) {
      console.error("Error verifying OTP:", error);
      setMessage("Verification failed. Try again.");
    } finally {
      setOtpLoading(false);
    }
  };

  const handleCloseOtpModal = () => {
    setOtpVisible(false);
    setEnteredOtp("");
  };

  return (
    <div className="bg-color5 p-8">
      <div className="bg-color2 py-10 max-w-5xl mx-auto rounded-xl shadow-md">
        <h2 className="text-center text-color3 text-2xl font-bold">
          Franchise Opportunity
        </h2>

        {message && (
          <p
            className={`text-center mt-4 font-semibold ${
              verified ? "text-green-600" : "text-blue-600"
            }`}
          >
            {message}
          </p>
        )}

        {/* Step 1: Lead form */}
        {!verified && (
          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 lg:grid-cols-2 gap-8 px-8 py-8"
          >
            <input
              type="text"
              name="name"
              value={formValues.name}
              onChange={handleInputChange}
              placeholder="Full Name*"
              className="py-3 pl-4 w-full border border-color6 rounded-lg text-xl"
              required
            />
            <input
              type="email"
              name="email"
              value={formValues.email}
              onChange={handleInputChange}
              placeholder="Email ID*"
              className="py-3 pl-4 w-full border border-color6 rounded-lg text-xl"
              required
            />
            <input
              type="tel"
              name="phone"
              value={formValues.phone}
              onChange={handleInputChange}
              placeholder="Mobile No*"
              className="py-3 pl-4 w-full border border-color6 rounded-lg text-xl"
              required
            />
            <select
              name="state"
              value={formValues.state}
              onChange={handleInputChange}
              className="py-3 pl-4 w-full rounded-lg text-xl bg-white border border-color6"
              required
            >
              <option value="">Select State*</option>
              <option value="maharashtra">Maharashtra</option>
              <option value="gujarat">Gujarat</option>
              <option value="karnataka">Karnataka</option>
              <option value="delhi">Delhi</option>
              <option value="tamil-nadu">Tamil Nadu</option>
            </select>
            <select
              name="city"
              value={formValues.city}
              onChange={handleInputChange}
              className="py-3 pl-4 w-full rounded-lg text-xl bg-white border border-color6"
              required
            >
              <option value="">Select City*</option>
              <option value="mumbai">Mumbai</option>
              <option value="pune">Pune</option>
              <option value="bangalore">Bangalore</option>
              <option value="hyderabad">Hyderabad</option>
              <option value="chennai">Chennai</option>
            </select>
            <div className="flex items-center gap-3 lg:col-span-2">
              <input
                type="checkbox"
                name="termsAccepted"
                checked={formValues.termsAccepted}
                onChange={handleInputChange}
                className="w-5 h-5"
                required
              />
              <span>Accept terms & conditions etc.</span>
            </div>
            <div className="lg:col-span-2 flex justify-center">
              <button
                type="submit"
                disabled={loading}
                className={`px-10 bg-color1 text-color3 font-semibold py-3 rounded-lg text-xl transition-all ${
                  loading ? "opacity-70 cursor-not-allowed" : "hover:bg-color9"
                }`}
              >
                {loading ? "Submitting..." : "Generate OTP"}
              </button>
            </div>
          </form>
        )}

        {/* Step 3: Success */}
        {verified && (
          <div className="flex flex-col items-center justify-center mt-6">
            <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center text-white text-3xl font-bold mb-4">
              ✓
            </div>
            <h3 className="text-xl font-bold text-green-700">
              Request Verified Successfully!
            </h3>
            <p className="text-gray-600 mt-2">
              Thank you for your interest. Our team will contact you soon.
            </p>
          </div>
        )}

        {/* Step 2: OTP Verification Modal */}
        <Modal
          isOpen={otpVisible}
          onClose={handleCloseOtpModal}
          title="Verify OTP"
          size="sm"
        >
          <div className="text-center">
            <p className="text-gray-700 mb-4">
              Use otp to verify
            </p>
            <input
              type="text"
              value={enteredOtp}
              onChange={(e) => setEnteredOtp(e.target.value)}
              placeholder="Enter OTP"
              className="border border-gray-300 rounded-lg px-4 py-3 text-lg text-center w-full mb-4"
            />
            {message && (
              <p className="text-blue-600 text-sm mb-4">{message}</p>
            )}
            <button
              type="button"
              onClick={handleVerifyOtp}
              disabled={otpLoading}
              className={`w-full px-8 py-3 bg-color1 text-color3 rounded-lg text-lg font-semibold hover:bg-color9 transition-all ${
                otpLoading ? "opacity-70 cursor-not-allowed" : ""
              }`}
            >
              {otpLoading ? "Verifying..." : "Verify OTP"}
            </button>
          </div>
        </Modal>
      </div>
    </div>
  );
};

export default Form;