import { Leaf, Mail, Phone, MapPin } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useLanguage } from "@/components/LanguageProvider";
import { translations } from "@/utils/language";
import { useState } from "react";

export default function Contact() {
  const { language } = useLanguage();
  const t = (key: string) => (translations[language] as any)[key] || key;
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Store message in localStorage
    const messages = JSON.parse(localStorage.getItem("contact_messages") || "[]");
    messages.push({
      ...formData,
      timestamp: new Date().toISOString(),
    });
    localStorage.setItem("contact_messages", JSON.stringify(messages));
    setSubmitted(true);
    setTimeout(() => {
      navigate("/");
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header Navigation */}
      <nav className="border-b border-border sticky top-0 z-50 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <Leaf className="w-8 h-8 text-primary" />
            <span className="font-bold text-xl text-foreground">Agrivers</span>
          </Link>
          <div className="hidden md:flex items-center gap-6">
            <Link to="/" className="text-foreground hover:text-primary transition-colors text-sm">
              {t("nav.home")}
            </Link>
            <Link to="/about" className="text-foreground hover:text-primary transition-colors text-sm">
              {t("nav.about")}
            </Link>
            <Link to="/contact" className="text-primary font-medium text-sm">
              {t("nav.contact")}
            </Link>
          </div>
          <Link
            to="/login"
            className="text-foreground hover:text-primary transition-colors font-medium text-sm"
          >
            {t("nav.login")}
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            {t("contact.title")}
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {t("contact.subtitle")}
          </p>
        </div>
      </section>

      {/* Contact Info & Form */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 mb-20">
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {/* Email */}
          <div className="bg-card rounded-xl p-8 border border-border text-center">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Mail className="w-6 h-6 text-primary" />
            </div>
            <h3 className="font-bold text-lg text-foreground mb-2">
              {t("contact.email")}
            </h3>
            <a
              href="mailto:agriversdz@gmail.com"
              className="text-primary hover:underline"
            >
              agriversdz@gmail.com
            </a>
          </div>

          {/* Phone */}
          <div className="bg-card rounded-xl p-8 border border-border text-center">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Phone className="w-6 h-6 text-primary" />
            </div>
            <h3 className="font-bold text-lg text-foreground mb-2">
              {t("contact.phone")}
            </h3>
            <p className="text-muted-foreground">
              {t("contact.phoneAvailable")}
            </p>
          </div>

          {/* Location */}
          <div className="bg-card rounded-xl p-8 border border-border text-center">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
              <MapPin className="w-6 h-6 text-primary" />
            </div>
            <h3 className="font-bold text-lg text-foreground mb-2">
              {t("contact.location")}
            </h3>
            <p className="text-muted-foreground">
              {t("contact.region")}
            </p>
          </div>
        </div>

        {/* Contact Form */}
        <div className="max-w-2xl mx-auto">
          {submitted ? (
            <div className="bg-green-50 border border-green-200 rounded-xl p-8 text-center">
              <h2 className="text-2xl font-bold text-green-900 mb-2">
                {t("contact.thankYou")}
              </h2>
              <p className="text-green-800 mb-4">
                {t("contact.successMsg")}
              </p>
              <p className="text-green-700 text-sm">
                {t("contact.redirecting")}
              </p>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="bg-card rounded-xl p-8 border border-border space-y-6"
            >
              <h2 className="text-2xl font-bold text-foreground mb-6">
                {t("contact.sendMessage")}
              </h2>

              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  {t("auth.fullName")} *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder={t("contact.namePlaceholder")}
                  required
                  className="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  {t("auth.email")} *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder={t("contact.emailPlaceholder")}
                  required
                  className="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              {/* Subject */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  {t("contact.subject")} *
                </label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  placeholder={t("contact.subjectPlaceholder")}
                  required
                  className="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              {/* Message */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  {t("contact.message")} *
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  placeholder={t("contact.messagePlaceholder")}
                  required
                  rows={5}
                  className="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full bg-primary text-primary-foreground py-3 rounded-lg hover:bg-primary/90 transition-colors font-semibold"
              >
                {t("contact.send")}
              </button>
            </form>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-muted/30 border-t border-border py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <Leaf className="w-6 h-6 text-primary" />
              <span className="font-bold text-foreground">Agrivers</span>
            </div>
            <p className="text-muted-foreground text-sm">
              © 2024 Agrivers. Connecting farms to markets.
            </p>
            <a
              href="mailto:agriversdz@gmail.com"
              className="text-muted-foreground hover:text-primary transition-colors text-sm font-medium"
            >
              {t("footer.contact")}: agriversdz@gmail.com
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
