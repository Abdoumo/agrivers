import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Leaf, LogOut, Plus, TrendingUp, AlertTriangle, CheckCircle } from "lucide-react";
import { useLanguage } from "@/components/LanguageProvider";
import { translations } from "@/utils/language";

interface DemandData {
  id: string;
  product: string;
  quantity: string;
  period: string;
  submittedAt: string;
  userId: string;
}

interface SupplyData {
  id: string;
  crop: string;
  quantity: number;
  userId: string;
}

const PRODUCTS = [
  "Wheat",
  "Barley",
  "Dates",
  "Tomatoes",
  "Cucumber",
  "Carrot",
  "Onion",
  "Potato",
];
const PERIODS = ["Daily", "Weekly", "Monthly", "Seasonal"];

export default function TraderDashboard() {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const t = (key: string) => (translations[language] as any)[key] || key;
  const [user, setUser] = useState<any>(null);
  const [demands, setDemands] = useState<DemandData[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedDemand, setSelectedDemand] = useState<DemandData | null>(null);

  const [formData, setFormData] = useState({
    product: "",
    quantity: "",
    period: "",
  });

  useEffect(() => {
    // Check if user is logged in
    const currentUser = localStorage.getItem("currentUser");
    if (!currentUser || JSON.parse(currentUser).role !== "trader") {
      navigate("/login");
      return;
    }
    setUser(JSON.parse(currentUser));

    // Load demand data
    const demandData = JSON.parse(localStorage.getItem("demandData") || "[]");
    const userDemands = demandData.filter(
      (d: DemandData) => d.userId === JSON.parse(currentUser).id
    );
    setDemands(userDemands);
  }, [navigate]);

  const getSupplyData = (): Record<string, number> => {
    const farms = JSON.parse(localStorage.getItem("farmData") || "[]");
    const supply: Record<string, number> = {};

    PRODUCTS.forEach((product) => {
      const farmCount = farms.filter(
        (f: any) => f.crop === product
      ).length;
      supply[product] = farmCount * 10; // Estimate supply
    });

    return supply;
  };

  const getAlert = (
    product: string,
    demandQty: number
  ): { type: "shortage" | "surplus" | "balance"; message: string } => {
    const supply = getSupplyData()[product] || 0;

    if (supply < demandQty * 0.8) {
      return {
        type: "shortage",
        message: "Supply below demand - potential shortage",
      };
    } else if (supply > demandQty * 1.2) {
      return {
        type: "surplus",
        message: "Supply exceeds demand - potential surplus",
      };
    } else {
      return {
        type: "balance",
        message: "Supply and demand balanced",
      };
    }
  };

  const handleAddDemand = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.product || !formData.quantity || !formData.period) {
      alert("Please fill all fields");
      return;
    }

    const newDemand: DemandData = {
      id: Date.now().toString(),
      product: formData.product,
      quantity: formData.quantity,
      period: formData.period,
      submittedAt: new Date().toISOString(),
      userId: user.id,
    };

    const allDemands = JSON.parse(localStorage.getItem("demandData") || "[]");
    allDemands.push(newDemand);
    localStorage.setItem("demandData", JSON.stringify(allDemands));

    setDemands([...demands, newDemand]);
    setFormData({ product: "", quantity: "", period: "" });
    setShowAddForm(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("currentUser");
    navigate("/");
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        Loading...
      </div>
    );
  }

  const supplyData = getSupplyData();
  const totalDemand = demands.reduce(
    (sum, d) => sum + (parseInt(d.quantity) || 0),
    0
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b border-border bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Leaf className="w-8 h-8 text-primary" />
            <span className="font-bold text-xl text-foreground">AgroConnect</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">
              Welcome, {user.name}
            </span>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 text-foreground hover:text-destructive transition-colors"
            >
              <LogOut className="w-5 h-5" />
              Logout
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            {t("trader.dashboard")}
          </h1>
          <p className="text-muted-foreground">
            {t("trader.manage")}
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-card border border-border rounded-xl p-6">
            <div className="text-sm text-muted-foreground">{t("trader.totalDemand")}</div>
            <div className="text-3xl font-bold text-foreground mt-2">
              {totalDemand}
            </div>
            <p className="text-xs text-muted-foreground mt-2">{t("trader.units")}</p>
          </div>
          <div className="bg-card border border-border rounded-xl p-6">
            <div className="text-sm text-muted-foreground">{t("trader.activeProducts")}</div>
            <div className="text-3xl font-bold text-foreground mt-2">
              {demands.length}
            </div>
            <p className="text-xs text-muted-foreground mt-2">{t("trader.inDemand")}</p>
          </div>
          <div className="bg-card border border-border rounded-xl p-6">
            <div className="text-sm text-muted-foreground">{t("farmer.region")}</div>
            <div className="text-2xl font-bold text-foreground mt-2">
              {user.region || "-"}
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Demands List */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-foreground">
                {t("trader.myDemands")}
              </h2>
              <button
                onClick={() => setShowAddForm(!showAddForm)}
                className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors"
              >
                <Plus className="w-5 h-5" />
                {t("trader.addDemand")}
              </button>
            </div>

            {showAddForm && (
              <form
                onSubmit={handleAddDemand}
                className="bg-card border border-border rounded-xl p-6 mb-6"
              >
                <h3 className="font-bold text-lg text-foreground mb-4">
                  {t("trader.addMarketDemand")}
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      {t("trader.product")}
                    </label>
                    <select
                      value={formData.product}
                      onChange={(e) =>
                        setFormData({ ...formData, product: e.target.value })
                      }
                      className="w-full px-4 py-2 border border-border rounded-lg bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      <option value="">{t("trader.selectProduct")}</option>
                      {PRODUCTS.map((product) => (
                        <option key={product} value={product}>
                          {product}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      {t("trader.quantity")}
                    </label>
                    <input
                      type="number"
                      value={formData.quantity}
                      onChange={(e) =>
                        setFormData({ ...formData, quantity: e.target.value })
                      }
                      placeholder={t("trader.enterQuantity")}
                      className="w-full px-4 py-2 border border-border rounded-lg bg-input text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      {t("trader.period")}
                    </label>
                    <select
                      value={formData.period}
                      onChange={(e) =>
                        setFormData({ ...formData, period: e.target.value })
                      }
                      className="w-full px-4 py-2 border border-border rounded-lg bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      <option value="">{t("trader.selectPeriod")}</option>
                      {PERIODS.map((period) => (
                        <option key={period} value={period}>
                          {period}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="flex gap-4">
                    <button
                      type="submit"
                      className="flex-1 bg-primary text-primary-foreground py-2 rounded-lg font-semibold hover:bg-primary/90 transition-colors"
                    >
                      {t("common.addDemand")}
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowAddForm(false)}
                      className="flex-1 border border-border text-foreground py-2 rounded-lg font-semibold hover:bg-muted/30 transition-colors"
                    >
                      {t("common.cancel")}
                    </button>
                  </div>
                </div>
              </form>
            )}

            {demands.length === 0 ? (
              <div className="bg-card border border-border rounded-xl p-8 text-center">
                <TrendingUp className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">{t("trader.noDemands")}</p>
                <p className="text-sm text-muted-foreground mt-2">
                  {t("trader.addDemandFirst")}
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {demands.map((demand) => {
                  const alert = getAlert(demand.product, parseInt(demand.quantity));
                  return (
                    <div
                      key={demand.id}
                      className="bg-card border border-border rounded-xl p-6 hover:border-primary transition-colors cursor-pointer"
                      onClick={() => setSelectedDemand(demand)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-bold text-lg text-foreground">
                            {demand.product}
                          </h3>
                          <p className="text-sm text-muted-foreground mt-1">
                            Quantity: {demand.quantity} units | Period:{" "}
                            {demand.period}
                          </p>
                          <div className="flex items-center gap-2 mt-3">
                            {alert.type === "shortage" && (
                              <AlertTriangle className="w-4 h-4 text-destructive" />
                            )}
                            {alert.type === "surplus" && (
                              <AlertTriangle className="w-4 h-4 text-yellow-600" />
                            )}
                            {alert.type === "balance" && (
                              <CheckCircle className="w-4 h-4 text-primary" />
                            )}
                            <span className="text-xs font-medium text-muted-foreground">
                              {alert.message}
                            </span>
                          </div>
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {new Date(demand.submittedAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Supply Summary */}
          <div>
            <h2 className="text-2xl font-bold text-foreground mb-6">
              {t("trader.marketSupply")}
            </h2>

            <div className="bg-card border border-border rounded-xl p-6 max-h-96 overflow-y-auto">
              <div className="space-y-4">
                {PRODUCTS.map((product) => {
                  const supply = supplyData[product] || 0;
                  const demand = demands
                    .filter((d) => d.product === product)
                    .reduce((sum, d) => sum + (parseInt(d.quantity) || 0), 0);

                  const status =
                    supply < demand * 0.8
                      ? "shortage"
                      : supply > demand * 1.2
                        ? "surplus"
                        : "balance";

                  return (
                    <div key={product} className="border-b border-border last:border-b-0 pb-4 last:pb-0">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-foreground text-sm">
                          {product}
                        </span>
                        <span className="text-xs font-semibold px-2 py-1 rounded-full bg-primary/10 text-primary">
                          {supply} units
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        {status === "shortage" && (
                          <AlertTriangle className="w-3 h-3 text-destructive" />
                        )}
                        {status === "surplus" && (
                          <AlertTriangle className="w-3 h-3 text-yellow-600" />
                        )}
                        {status === "balance" && (
                          <CheckCircle className="w-3 h-3 text-primary" />
                        )}
                        <span className="text-xs text-muted-foreground">
                          {status === "shortage" && "Shortage alert"}
                          {status === "surplus" && "Surplus alert"}
                          {status === "balance" && "Balanced"}
                        </span>
                      </div>
                      {demand > 0 && (
                        <div className="mt-2 text-xs text-muted-foreground">
                          Your demand: {demand} units
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Price Indicator */}
            <div className="mt-6 bg-secondary/10 border border-secondary/20 rounded-xl p-6">
              <h3 className="font-bold text-foreground mb-4">Price Indicator</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Shortage Products</span>
                  <span className="text-sm font-semibold text-destructive">
                    High 📈
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Balanced Products</span>
                  <span className="text-sm font-semibold text-primary">
                    Normal 💚
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Surplus Products</span>
                  <span className="text-sm font-semibold text-yellow-600">
                    Low 📉
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
