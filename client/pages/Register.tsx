import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Leaf } from "lucide-react";
import { useLanguage } from "@/components/LanguageProvider";
import { translations } from "@/utils/language";

type UserRole = "farmer" | "trader" | null;

export default function Register() {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const t = (key: string) => (translations[language] as any)[key] || key;
  const [step, setStep] = useState<"role" | "details">("role");
  const [role, setRole] = useState<UserRole>(null);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    region: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");

  const handleRoleSelect = (selectedRole: UserRole) => {
    setRole(selectedRole);
    setStep("details");
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validate inputs
    if (!formData.name || !formData.email || !formData.password) {
      setError("Please fill in all required fields");
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    try {
      // Get existing users from localStorage
      const existingUsers = JSON.parse(
        localStorage.getItem("users") || "[]"
      );

      // Check if email already exists
      if (existingUsers.some((u: any) => u.email === formData.email)) {
        setError("Email already registered");
        return;
      }

      // Create new user
      const newUser = {
        id: Date.now().toString(),
        ...formData,
        role,
        createdAt: new Date().toISOString(),
      };

      // Save user
      existingUsers.push(newUser);
      localStorage.setItem("users", JSON.stringify(existingUsers));

      // Set current user
      localStorage.setItem("currentUser", JSON.stringify(newUser));

      // Redirect to dashboard based on role
      navigate(role === "farmer" ? "/farmer-dashboard" : "/trader-dashboard");
    } catch (err) {
      setError("Registration failed. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Navigation */}
      <nav className="border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <Leaf className="w-8 h-8 text-primary" />
            <span className="font-bold text-xl text-foreground">AgroConnect</span>
          </Link>
          <Link to="/login" className="text-foreground hover:text-primary transition-colors">
            Already have an account? Login
          </Link>
        </div>
      </nav>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center py-12 px-4">
        <div className="w-full max-w-md">
          {step === "role" ? (
            // Role Selection
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2 text-center">
                {t("auth.createAccount")}
              </h1>
              <p className="text-center text-muted-foreground mb-8">
                {t("auth.whatAreYou")}
              </p>

              <div className="space-y-4">
                <button
                  onClick={() => handleRoleSelect("farmer")}
                  className="w-full border-2 border-border hover:border-primary rounded-xl p-6 text-center transition-all hover:bg-primary/5 cursor-pointer"
                >
                  <div className="text-3xl mb-3">🚜</div>
                  <h3 className="font-bold text-lg text-foreground">{t("auth.farmer")}</h3>
                  <p className="text-sm text-muted-foreground mt-2">
                    {t("home.forFarmers")}
                  </p>
                </button>

                <button
                  onClick={() => handleRoleSelect("trader")}
                  className="w-full border-2 border-border hover:border-primary rounded-xl p-6 text-center transition-all hover:bg-primary/5 cursor-pointer"
                >
                  <div className="text-3xl mb-3">📊</div>
                  <h3 className="font-bold text-lg text-foreground">{t("auth.trader")}</h3>
                  <p className="text-sm text-muted-foreground mt-2">
                    {t("home.forTraders")}
                  </p>
                </button>
              </div>
            </div>
          ) : (
            // Registration Form
            <form onSubmit={handleRegister}>
              <button
                type="button"
                onClick={() => {
                  setStep("role");
                  setRole(null);
                  setError("");
                }}
                className="text-primary hover:text-primary/80 mb-6 font-medium text-sm"
              >
                ← {t("auth.backRole")}
              </button>

              <h1 className="text-2xl font-bold text-foreground mb-2">
                {t("auth.registerAs")} {role === "farmer" ? t("auth.farmer") : t("auth.trader")}
              </h1>
              <p className="text-muted-foreground mb-6">
                {t("auth.fillDetails")}
              </p>

              {error && (
                <div className="bg-destructive/10 text-destructive px-4 py-3 rounded-lg mb-6 text-sm">
                  {error}
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    {t("auth.fullName")} *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Your name"
                    className="w-full px-4 py-2 border border-border rounded-lg bg-input text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    {t("auth.email")} *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="your@email.com"
                    className="w-full px-4 py-2 border border-border rounded-lg bg-input text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    {t("auth.phone")}
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="+966 50 XXXX XXXX"
                    className="w-full px-4 py-2 border border-border rounded-lg bg-input text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    {t("auth.region")}
                  </label>
                  <input
                    type="text"
                    name="region"
                    value={formData.region}
                    onChange={handleInputChange}
                    placeholder="Your region"
                    className="w-full px-4 py-2 border border-border rounded-lg bg-input text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    {t("auth.password")} *
                  </label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="At least 6 characters"
                    className="w-full px-4 py-2 border border-border rounded-lg bg-input text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-primary text-primary-foreground py-2 rounded-lg font-semibold hover:bg-primary/90 transition-colors mt-6"
                >
                  {t("auth.createAccount")}
                </button>

                <p className="text-center text-sm text-muted-foreground">
                  {t("auth.alreadyAccount")}{" "}
                  <Link to="/login" className="text-primary hover:underline font-medium">
                    {t("auth.loginHere")}
                  </Link>
                </p>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
