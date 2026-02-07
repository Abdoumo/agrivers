import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Leaf, LogOut, TrendingUp, AlertTriangle, CheckCircle } from "lucide-react";

interface MarketData {
  product: string;
  supply: number;
  demand: number;
  status: "shortage" | "balance" | "surplus";
  priceIndicator: "low" | "normal" | "high";
  season: string;
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

export default function MarketAnalysis() {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [marketData, setMarketData] = useState<MarketData[]>([]);

  useEffect(() => {
    const currentUser = localStorage.getItem("currentUser");
    if (!currentUser) {
      navigate("/login");
      return;
    }
    setUser(JSON.parse(currentUser));

    // Calculate market data
    calculateMarketData();
  }, [navigate]);

  const calculateMarketData = () => {
    const farms = JSON.parse(localStorage.getItem("farmData") || "[]");
    const demands = JSON.parse(localStorage.getItem("demandData") || "[]");

    const data: MarketData[] = PRODUCTS.map((product) => {
      const farmCount = farms.filter((f: any) => f.crop === product).length;
      const totalDemand = demands
        .filter((d: any) => d.product === product)
        .reduce((sum: number, d: any) => sum + (parseInt(d.quantity) || 0), 0);

      const supply = farmCount * 10; // Estimate: 10 units per farm
      let status: "shortage" | "balance" | "surplus" = "balance";
      let priceIndicator: "low" | "normal" | "high" = "normal";

      if (supply < totalDemand * 0.8) {
        status = "shortage";
        priceIndicator = "high";
      } else if (supply > totalDemand * 1.2) {
        status = "surplus";
        priceIndicator = "low";
      }

      const seasons = farms
        .filter((f: any) => f.crop === product)
        .map((f: any) => f.season);
      const season = seasons.length > 0 ? seasons[0] : "All";

      return {
        product,
        supply,
        demand: totalDemand,
        status,
        priceIndicator,
        season,
      };
    });

    setMarketData(data);
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

  const shortages = marketData.filter((m) => m.status === "shortage").length;
  const balanced = marketData.filter((m) => m.status === "balance").length;
  const surpluses = marketData.filter((m) => m.status === "surplus").length;

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b border-border bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Leaf className="w-8 h-8 text-primary" />
            <span className="font-bold text-xl text-foreground">Agrivers</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">{user.name}</span>
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
            Market Analysis
          </h1>
          <p className="text-muted-foreground">
            Real-time supply vs demand analysis
          </p>
        </div>

        {/* Summary Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="bg-card border border-border rounded-xl p-6">
            <div className="text-sm text-muted-foreground">Total Products</div>
            <div className="text-3xl font-bold text-foreground mt-2">
              {PRODUCTS.length}
            </div>
          </div>
          <div className="bg-card border border-border rounded-xl p-6">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <div className="text-sm text-muted-foreground">Balanced</div>
            </div>
            <div className="text-3xl font-bold text-foreground mt-2">
              {balanced}
            </div>
          </div>
          <div className="bg-card border border-border rounded-xl p-6">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-red-600" />
              <div className="text-sm text-muted-foreground">Shortage</div>
            </div>
            <div className="text-3xl font-bold text-destructive mt-2">
              {shortages}
            </div>
          </div>
          <div className="bg-card border border-border rounded-xl p-6">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-yellow-600" />
              <div className="text-sm text-muted-foreground">Surplus</div>
            </div>
            <div className="text-3xl font-bold text-yellow-600 mt-2">
              {surpluses}
            </div>
          </div>
        </div>

        {/* Market Data Table */}
        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-muted/30">
                  <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                    Product
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                    Supply (units)
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                    Demand (units)
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                    Price
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                    Season
                  </th>
                </tr>
              </thead>
              <tbody>
                {marketData.map((market) => (
                  <tr
                    key={market.product}
                    className="border-b border-border hover:bg-muted/20 transition-colors"
                  >
                    <td className="px-6 py-4 font-medium text-foreground">
                      {market.product}
                    </td>
                    <td className="px-6 py-4 text-muted-foreground">
                      {market.supply}
                    </td>
                    <td className="px-6 py-4 text-muted-foreground">
                      {market.demand}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {market.status === "shortage" && (
                          <>
                            <AlertTriangle className="w-4 h-4 text-destructive" />
                            <span className="text-sm font-medium text-destructive">
                              Shortage
                            </span>
                          </>
                        )}
                        {market.status === "balance" && (
                          <>
                            <CheckCircle className="w-4 h-4 text-primary" />
                            <span className="text-sm font-medium text-primary">
                              Balanced
                            </span>
                          </>
                        )}
                        {market.status === "surplus" && (
                          <>
                            <AlertTriangle className="w-4 h-4 text-yellow-600" />
                            <span className="text-sm font-medium text-yellow-600">
                              Surplus
                            </span>
                          </>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`text-sm font-medium px-3 py-1 rounded-full ${
                          market.priceIndicator === "low"
                            ? "bg-green-100 text-green-800"
                            : market.priceIndicator === "normal"
                              ? "bg-blue-100 text-blue-800"
                              : "bg-red-100 text-red-800"
                        }`}
                      >
                        {market.priceIndicator === "low" && "Low 📉"}
                        {market.priceIndicator === "normal" && "Normal 💚"}
                        {market.priceIndicator === "high" && "High 📈"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-muted-foreground">
                      {market.season}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Insights Section */}
        <div className="grid md:grid-cols-2 gap-8 mt-8">
          <div className="bg-card border border-border rounded-xl p-6">
            <h3 className="font-bold text-lg text-foreground mb-4">
              Shortage Products
            </h3>
            {marketData.filter((m) => m.status === "shortage").length === 0 ? (
              <p className="text-muted-foreground">No shortages detected</p>
            ) : (
              <ul className="space-y-3">
                {marketData
                  .filter((m) => m.status === "shortage")
                  .map((market) => (
                    <li
                      key={market.product}
                      className="flex items-start gap-3 p-3 rounded-lg bg-destructive/10"
                    >
                      <AlertTriangle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-semibold text-foreground">
                          {market.product}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Supply: {market.supply} | Demand: {market.demand}
                        </p>
                        <p className="text-sm text-destructive font-medium mt-1">
                          Price expected to be high
                        </p>
                      </div>
                    </li>
                  ))}
              </ul>
            )}
          </div>

          <div className="bg-card border border-border rounded-xl p-6">
            <h3 className="font-bold text-lg text-foreground mb-4">
              Surplus Products
            </h3>
            {marketData.filter((m) => m.status === "surplus").length === 0 ? (
              <p className="text-muted-foreground">No surpluses detected</p>
            ) : (
              <ul className="space-y-3">
                {marketData
                  .filter((m) => m.status === "surplus")
                  .map((market) => (
                    <li
                      key={market.product}
                      className="flex items-start gap-3 p-3 rounded-lg bg-yellow-100/50"
                    >
                      <AlertTriangle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-semibold text-foreground">
                          {market.product}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Supply: {market.supply} | Demand: {market.demand}
                        </p>
                        <p className="text-sm text-yellow-700 font-medium mt-1">
                          Price expected to be low
                        </p>
                      </div>
                    </li>
                  ))}
              </ul>
            )}
          </div>
        </div>

        {/* Seasonal Trends */}
        <div className="mt-8 bg-card border border-border rounded-xl p-6">
          <h3 className="font-bold text-lg text-foreground mb-4">
            Seasonal Summary
          </h3>
          <div className="grid md:grid-cols-4 gap-4">
            {["Spring", "Summer", "Fall", "Winter"].map((season) => (
              <div
                key={season}
                className="p-4 rounded-lg bg-muted/30 border border-border"
              >
                <p className="font-semibold text-foreground">{season}</p>
                <p className="text-sm text-muted-foreground mt-2">
                  {season === "Spring" && "Peak planting season - high demand"}
                  {season === "Summer" && "Harvesting season - supply increases"}
                  {season === "Fall" && "Transition period - moderate activity"}
                  {season === "Winter" && "Low season - reduced activity"}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
