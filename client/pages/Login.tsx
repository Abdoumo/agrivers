import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Leaf } from "lucide-react";
import { useLanguage } from "@/components/LanguageProvider";
import { translations } from "@/utils/language";

export default function Login() {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const t = (key: string) => (translations[language] as any)[key] || key;
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // Get users from localStorage
      const users = JSON.parse(localStorage.getItem("users") || "[]");

      // Find user with matching email and password
      const user = users.find(
        (u: any) => u.email === email && u.password === password
      );

      if (!user) {
        setError("Invalid email or password");
        setLoading(false);
        return;
      }

      // Set current user
      localStorage.setItem("currentUser", JSON.stringify(user));

      // Redirect to dashboard based on role
      if (user.role === "farmer") {
        navigate("/farmer-dashboard");
      } else if (user.role === "trader") {
        navigate("/trader-dashboard");
      } else if (user.role === "admin") {
        navigate("/admin");
      }
    } catch (err) {
      setError("Login failed. Please try again.");
      setLoading(false);
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
          <Link
            to="/register"
            className="text-foreground hover:text-primary transition-colors"
          >
            Don't have an account? Register
          </Link>
        </div>
      </nav>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center py-12 px-4">
        <div className="w-full max-w-md">
          <h1 className="text-3xl font-bold text-foreground mb-2 text-center">
            {t("auth.welcomeBack")}
          </h1>
          <p className="text-center text-muted-foreground mb-8">
            {t("auth.signInDesc")}
          </p>

          <form onSubmit={handleLogin} className="space-y-4">
            {error && (
              <div className="bg-destructive/10 text-destructive px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                {t("auth.email")}
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="w-full px-4 py-2 border border-border rounded-lg bg-input text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                {t("auth.password")}
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-2 border border-border rounded-lg bg-input text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-primary-foreground py-2 rounded-lg font-semibold hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "..." + t("auth.signIn") : t("auth.signIn")}
            </button>

            <p className="text-center text-sm text-muted-foreground">
              {t("auth.noAccount")}{" "}
              <Link
                to="/register"
                className="text-primary hover:underline font-medium"
              >
                {t("auth.registerHere")}
              </Link>
            </p>
          </form>

          {/* Demo accounts info */}
          <div className="mt-8 p-4 bg-secondary/10 rounded-lg">
            <p className="text-xs font-semibold text-secondary mb-2">{t("auth.demoAccounts")}</p>
            <p className="text-xs text-muted-foreground">
              <strong>{t("auth.farmer")}:</strong> farmer@demo.com / password
            </p>
            <p className="text-xs text-muted-foreground">
              <strong>{t("auth.trader")}:</strong> trader@demo.com / password
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
