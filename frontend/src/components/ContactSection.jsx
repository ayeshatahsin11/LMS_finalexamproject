"use client";

import { useState } from "react";
import { Mail, MessageCircle, MapPin } from "lucide-react";
import ErrorMessage from "@/components/ErrorMessage";
import SuccessMessage from "@/components/SuccessMessage";
import { useAutoDismiss } from "@/lib/useAutoDismiss";

const CONTACT_INFO = [
  { icon: Mail, label: "Email us", value: "hello@pathway.dev" },
  { icon: MessageCircle, label: "Live chat", value: "Mon-Fri, 9am-6pm" },
  { icon: MapPin, label: "Based in", value: "Dhaka, Bangladesh" },
];

export default function ContactSection() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useAutoDismiss(success, setSuccess);
  useAutoDismiss(error, setError, 6000);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      setError("Please fill in every field before sending.");
      return;
    }

    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setSuccess("Thanks! Your message has been received - we'll get back to you soon.");
      setForm({ name: "", email: "", message: "" });
    }, 700);
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <div className="mb-10 max-w-xl">
        <h1 className="text-4xl leading-tight mb-3">
          Let's <span className="gradient-text">talk.</span>
        </h1>
        <p className="text-text-muted text-lg">
          Questions about a course, a technical issue, or a partnership idea - send it over.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        <div className="flex flex-col gap-4">
          {CONTACT_INFO.map((c, i) => {
            const Icon = c.icon;
            return (
              <div key={i} className="card p-5 flex items-start gap-3">
                <div className="h-10 w-10 rounded-lg bg-indigo/15 flex items-center justify-center shrink-0">
                  <Icon size={18} className="text-indigo" />
                </div>
                <div>
                  <p className="text-sm text-text-faint">{c.label}</p>
                  <p className="text-sm text-text font-medium">{c.value}</p>
                </div>
              </div>
            );
          })}
        </div>

        <form onSubmit={handleSubmit} className="card p-6 md:col-span-2 flex flex-col gap-4">
          <ErrorMessage message={error} />
          <SuccessMessage message={success} />

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-text mb-1.5">Your name</label>
              <input
                type="text"
                name="name"
                className="input-field"
                value={form.name}
                onChange={handleChange}
                placeholder="Jane Doe"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-text mb-1.5">Email</label>
              <input
                type="email"
                name="email"
                spellCheck={false}
                className="input-field"
                value={form.email}
                onChange={handleChange}
                placeholder="you@example.com"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-text mb-1.5">Message</label>
            <textarea
              name="message"
              rows={6}
              className="input-field resize-none"
              value={form.message}
              onChange={handleChange}
              placeholder="How can we help?"
            />
          </div>

          <button type="submit" disabled={submitting} className="btn-primary self-start mt-2">
            {submitting ? "Sending..." : "Send message"}
          </button>
        </form>
      </div>
    </div>
  );
}