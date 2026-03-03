"use client";

import { Phone, MapPin, MessageCircle, Clock } from "lucide-react";

/* 📞 Calling Number */
const CALL_NUMBER = "917008330920";

/* 💬 WhatsApp Number */
const WHATSAPP_NUMBER = "918763345134";

const WHATSAPP_MESSAGE = encodeURIComponent(
  "Hello Doctor, I would like to book a consultation appointment."
);

const ADDRESS = "Kundura, Koraput, Odisha, 764002";

const MAPS_URL = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
  ADDRESS
)}`;

const contactItems = [
  {
    icon: Phone,
    label: "Call Now",
    value: "+91 70083 30920",
    href: `tel:+${CALL_NUMBER}`,
    color: "bg-primary/10 text-primary",
  },
  {
    icon: MapPin,
    label: "Visit Clinic",
    value: "Kundura, Koraput, Odisha – 764002",
    href: MAPS_URL,
    color: "bg-accent/10 text-accent",
  },
  {
    icon: Clock,
    label: "Clinic Hours",
    value: "Mon – Sat: 10 AM – 7 PM",
    href: undefined,
    color: "bg-muted-foreground/10 text-muted-foreground",
  },
];

export default function ContactSection() {
  return (
    <section id="contact" className="section-padding bg-background">
      <div className="max-w-4xl mx-auto">
        
        {/* Heading */}
        <div className="text-center mb-10">
          <p className="text-sm font-medium text-primary uppercase tracking-wide mb-2">
            Get In Touch
          </p>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground">
            Contact & Location
          </h2>
        </div>

        {/* Contact Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          {contactItems.map((item) => (
            <a
              key={item.label}
              href={item.href}
              target={item.href?.startsWith("http") ? "_blank" : undefined}
              rel={item.href?.startsWith("http") ? "noopener noreferrer" : undefined}
              className={`glass-card p-5 flex flex-col items-center text-center gap-3 transition-all duration-300 hover:-translate-y-1 ${
                item.href ? "cursor-pointer" : "cursor-default"
              }`}
            >
              <div
                className={`w-12 h-12 rounded-xl flex items-center justify-center ${item.color}`}
              >
                <item.icon className="w-5 h-5" />
              </div>

              <div>
                <p className="text-xs text-muted-foreground mb-0.5">
                  {item.label}
                </p>
                <p className="text-sm font-semibold text-foreground">
                  {item.value}
                </p>
              </div>
            </a>
          ))}
        </div>

        {/* WhatsApp Button */}
        <div className="text-center">
          <a
            href={`https://wa.me/${WHATSAPP_NUMBER}?text=${WHATSAPP_MESSAGE}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 bg-green-500 hover:bg-green-600 text-white rounded-xl font-medium transition-all duration-300 shadow-md"
          >
            <MessageCircle className="w-5 h-5" />
            Chat on WhatsApp 
          </a>
        </div>
      </div>
    </section>
  );
}