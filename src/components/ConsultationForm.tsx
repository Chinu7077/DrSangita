"use client";

import { useState } from "react";
import { Send } from "lucide-react";

/* 💬 WhatsApp Number */
const WHATSAPP_NUMBER = "918763345134";

const ConsultationForm = () => {
  const [form, setForm] = useState({ name: "", phone: "", message: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const errs: Record<string, string> = {};

    if (!form.name.trim()) errs.name = "Name is required";
    else if (form.name.trim().length > 100) errs.name = "Name too long";

    if (!form.phone.trim()) errs.phone = "Phone number is required";
    else if (!/^[0-9+\-\s()]{7,20}$/.test(form.phone.trim()))
      errs.phone = "Enter a valid phone number";

    if (!form.message.trim()) errs.message = "Please describe your concern";
    else if (form.message.trim().length > 500)
      errs.message = "Message too long";

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const text = encodeURIComponent(
      `Hello Doctor,\n\nName: ${form.name.trim()}\nPhone: ${form.phone.trim()}\nConcern: ${form.message.trim()}\n\nI would like to book a consultation.`,
    );

    window.open(
      `https://wa.me/${WHATSAPP_NUMBER}?text=${text}`,
      "_blank",
      "noopener,noreferrer",
    );
  };

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  return (
    <section id="consultation" className="section-padding gradient-hero">
      <div className="max-w-lg mx-auto">
        <div className="text-center mb-8">
          <p className="text-sm font-medium text-primary uppercase tracking-wide mb-2">
            Book Appointment
          </p>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground">
            Free Consultation
          </h2>
          <p className="text-sm text-muted-foreground mt-2">
            Fill the form below and we'll connect via WhatsApp
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="glass-card p-6 sm:p-8 space-y-5"
        >
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">
              Full Name
            </label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => handleChange("name", e.target.value)}
              placeholder="Enter your name"
              className="w-full px-4 py-3 rounded-xl bg-background border border-input text-foreground text-sm outline-none"
              maxLength={100}
            />
            {errors.name && (
              <p className="text-red-500 text-xs mt-1">{errors.name}</p>
            )}
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">
              Phone Number
            </label>
            <input
              type="tel"
              value={form.phone}
              onChange={(e) => handleChange("phone", e.target.value)}
              placeholder="+91 XXXXX XXXXX"
              className="w-full px-4 py-3 rounded-xl bg-background border border-input text-foreground text-sm outline-none"
              maxLength={20}
            />
            {errors.phone && (
              <p className="text-red-500 text-xs mt-1">{errors.phone}</p>
            )}
          </div>

          {/* Message */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">
              Your Concern
            </label>
            <textarea
              value={form.message}
              onChange={(e) => handleChange("message", e.target.value)}
              placeholder="Briefly describe your health concern..."
              rows={4}
              className="w-full px-4 py-3 rounded-xl bg-background border border-input text-foreground text-sm outline-none resize-none"
              maxLength={500}
            />
            {errors.message && (
              <p className="text-red-500 text-xs mt-1">{errors.message}</p>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-green-500 hover:bg-green-600 text-white py-3.5 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all duration-300"
          >
            <Send className="w-4 h-4" />
            Send via WhatsApp
          </button>
        </form>
      </div>
    </section>
  );
};

export default ConsultationForm;
