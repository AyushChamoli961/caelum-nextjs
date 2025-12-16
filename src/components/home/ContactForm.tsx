"use client";

import { useState } from "react";

interface FormValues {
  name: string;
  email: string;
  phone: string;
  state: string;
  city: string;
  termsAccepted: boolean;
}

interface FormErrors {
  name?: string;
  email?: string;
  phone?: string;
  state?: string;
  city?: string;
  termsAccepted?: string;
}

const ContactForm = () => {
  const [formValues, setFormValues] = useState<FormValues>({
    name: "",
    email: "",
    phone: "",
    state: "",
    city: "",
    termsAccepted: false,
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    setFormValues((prevValues) => ({
      ...prevValues,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    if (!formValues.name.trim()) newErrors.name = "Name is required";
    if (!formValues.email.trim()) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formValues.email))
      newErrors.email = "Invalid email format";
    if (!formValues.phone.trim()) newErrors.phone = "Phone number is required";
    else if (!/^\d{10}$/.test(formValues.phone))
      newErrors.phone = "Invalid phone number (10 digits required)";
    if (!formValues.state) newErrors.state = "State is required";
    if (!formValues.city) newErrors.city = "City is required";
    if (!formValues.termsAccepted)
      newErrors.termsAccepted = "You must accept the terms and conditions";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      setIsSubmitting(true);
      try {
        // TODO: Add API call to submit form
        console.log("Form Submitted Successfully", formValues);
        // Reset form after successful submission
        setFormValues({
          name: "",
          email: "",
          phone: "",
          state: "",
          city: "",
          termsAccepted: false,
        });
      } catch (error) {
        console.error("Form submission error", error);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <section className="bg-color5 py-12 px-6 lg:px-0">
      <div
        className="bg-color2 py-10 max-w-5xl mx-auto rounded-xl"
        style={{ boxShadow: "rgba(0, 0, 0, 0.15) 4px 4px 2.6px" }}
      >
        <h2 className="text-center text-color3 text-2xl font-bold mb-8">
          Franchise Opportunity
        </h2>

        {/* Desktop Form */}
        <form onSubmit={handleSubmit} className="hidden lg:block">
          <div className="grid grid-cols-1 lg:grid-cols-2 items-center gap-10 px-8 py-8">
            <div>
              <input
                type="text"
                name="name"
                value={formValues.name}
                onChange={handleInputChange}
                placeholder="Full Name*"
                className="py-3 pl-4 w-full border border-color6 rounded-lg text-xl bg-white"
                style={{ boxShadow: "rgba(0, 0, 0, 0.15) 4px 4px 2.6px" }}
              />
              {errors.name && (
                <p className="text-red-500 text-sm mt-1">{errors.name}</p>
              )}
            </div>

            <div>
              <select
                name="state"
                value={formValues.state}
                onChange={handleInputChange}
                className="py-3 pl-4 w-full border border-color6 rounded-lg text-xl bg-white"
                style={{ boxShadow: "rgba(0, 0, 0, 0.15) 4px 4px 2.6px" }}
              >
                <option value="">Select State*</option>
                <option value="maharashtra">Maharashtra</option>
                <option value="gujarat">Gujarat</option>
                <option value="karnataka">Karnataka</option>
                <option value="delhi">Delhi</option>
                <option value="tamil-nadu">Tamil Nadu</option>
              </select>
              {errors.state && (
                <p className="text-red-500 text-sm mt-1">{errors.state}</p>
              )}
            </div>

            <div>
              <input
                type="email"
                name="email"
                value={formValues.email}
                onChange={handleInputChange}
                placeholder="Email ID*"
                className="py-3 pl-4 w-full border border-color6 rounded-lg text-xl bg-white"
                style={{ boxShadow: "rgba(0, 0, 0, 0.15) 4px 4px 2.6px" }}
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email}</p>
              )}
            </div>

            <div>
              <select
                name="city"
                value={formValues.city}
                onChange={handleInputChange}
                className="py-3 pl-4 w-full border border-color6 rounded-lg text-xl bg-white"
                style={{ boxShadow: "rgba(0, 0, 0, 0.15) 4px 4px 2.6px" }}
              >
                <option value="">Select City*</option>
                <option value="mumbai">Mumbai</option>
                <option value="pune">Pune</option>
                <option value="bangalore">Bangalore</option>
                <option value="hyderabad">Hyderabad</option>
                <option value="chennai">Chennai</option>
              </select>
              {errors.city && (
                <p className="text-red-500 text-sm mt-1">{errors.city}</p>
              )}
            </div>

            <div>
              <input
                type="tel"
                name="phone"
                value={formValues.phone}
                onChange={handleInputChange}
                placeholder="Mobile No*"
                className="py-3 pl-4 w-full border border-color6 rounded-lg text-xl bg-white"
                style={{ boxShadow: "rgba(0, 0, 0, 0.15) 4px 4px 2.6px" }}
              />
              {errors.phone && (
                <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
              )}
            </div>

            <div>
              <div className="flex items-center gap-4">
                <input
                  type="checkbox"
                  name="termsAccepted"
                  checked={formValues.termsAccepted}
                  onChange={handleInputChange}
                  className="w-5 h-5"
                />
                <div>Accept terms & conditions</div>
              </div>
              {errors.termsAccepted && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.termsAccepted}
                </p>
              )}
            </div>
          </div>

          <div className="flex w-full items-center justify-center">
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-10 bg-color1 text-color3 font-semibold py-3 rounded-lg text-xl hover:bg-color1/90 disabled:opacity-50"
            >
              {isSubmitting ? "Submitting..." : "Submit"}
            </button>
          </div>
        </form>

        {/* Mobile Form */}
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 gap-6 px-4 py-6 lg:hidden"
        >
          <div>
            <input
              type="text"
              name="name"
              value={formValues.name}
              onChange={handleInputChange}
              placeholder="Full Name*"
              className="py-3 pl-4 w-full border border-color6 rounded-lg text-xl bg-white"
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name}</p>
            )}
          </div>

          <div>
            <input
              type="email"
              name="email"
              value={formValues.email}
              onChange={handleInputChange}
              placeholder="Email ID*"
              className="py-3 pl-4 w-full border border-color6 rounded-lg text-xl bg-white"
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email}</p>
            )}
          </div>

          <div>
            <input
              type="tel"
              name="phone"
              value={formValues.phone}
              onChange={handleInputChange}
              placeholder="Mobile No*"
              className="py-3 pl-4 w-full border border-color6 rounded-lg text-xl bg-white"
            />
            {errors.phone && (
              <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
            )}
          </div>

          <div>
            <select
              name="state"
              value={formValues.state}
              onChange={handleInputChange}
              className="py-3 pl-4 w-full border border-color6 rounded-lg text-xl bg-white"
            >
              <option value="">Select State*</option>
              <option value="maharashtra">Maharashtra</option>
              <option value="gujarat">Gujarat</option>
              <option value="karnataka">Karnataka</option>
              <option value="delhi">Delhi</option>
              <option value="tamil-nadu">Tamil Nadu</option>
            </select>
            {errors.state && (
              <p className="text-red-500 text-sm mt-1">{errors.state}</p>
            )}
          </div>

          <div>
            <select
              name="city"
              value={formValues.city}
              onChange={handleInputChange}
              className="py-3 pl-4 w-full border border-color6 rounded-lg text-xl bg-white"
            >
              <option value="">Select City*</option>
              <option value="mumbai">Mumbai</option>
              <option value="pune">Pune</option>
              <option value="bangalore">Bangalore</option>
              <option value="hyderabad">Hyderabad</option>
              <option value="chennai">Chennai</option>
            </select>
            {errors.city && (
              <p className="text-red-500 text-sm mt-1">{errors.city}</p>
            )}
          </div>

          <div>
            <div className="flex items-center gap-4">
              <input
                type="checkbox"
                name="termsAccepted"
                checked={formValues.termsAccepted}
                onChange={handleInputChange}
                className="w-5 h-5"
              />
              <div className="text-sm">Accept terms & conditions</div>
            </div>
            {errors.termsAccepted && (
              <p className="text-red-500 text-sm mt-1">
                {errors.termsAccepted}
              </p>
            )}
          </div>

          <div className="flex w-full items-center justify-center">
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-10 bg-color1 font-semibold py-3 rounded-lg text-xl hover:bg-color1/90 disabled:opacity-50"
            >
              {isSubmitting ? "Submitting..." : "Submit"}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default ContactForm;
