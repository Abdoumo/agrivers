import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Leaf, LogOut, Users, CheckCircle } from "lucide-react";

interface Match {
  id: string;
  product: string;
  farmers: any[];
  traders: any[];
  matchStrength: "perfect" | "good" | "potential";
}

export default function PrePlantingMatch() {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [matches, setMatches] = useState<Match[]>([]);

  useEffect(() => {
    const currentUser = localStorage.getItem("currentUser");
    if (!currentUser) {
      navigate("/login");
      return;
    }
    setUser(JSON.parse(currentUser));

    // Calculate matches
    calculateMatches();
  }, [navigate]);

  const calculateMatches = () => {
    const users = JSON.parse(localStorage.getItem("users") || "[]");
    const farms = JSON.parse(localStorage.getItem("farmData") || "[]");
    const demands = JSON.parse(localStorage.getItem("demandData") || "[]");

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

    const matchedData: Match[] = PRODUCTS.map((product) => {
      // Get farmers planning this crop
      const farmerIds = new Set(
        farms
          .filter((f: any) => f.crop === product)
          .map((f: any) => f.userId)
      );

      const farmersPlanting = users.filter(
        (u: any) => u.role === "farmer" && farmerIds.has(u.id)
      );

      // Get traders demanding this product
      const traderIds = new Set(
        demands
          .filter((d: any) => d.product === product)
          .map((d: any) => d.userId)
      );

      const tradersDemanding = users.filter(
        (u: any) => u.role === "trader" && traderIds.has(u.id)
      );

      // Determine match strength
      let matchStrength: "perfect" | "good" | "potential" = "potential";
      if (farmersPlanting.length > 0 && tradersDemanding.length > 0) {
        if (farmersPlanting.length >= 2 && tradersDemanding.length >= 2) {
          matchStrength = "perfect";
        } else {
          matchStrength = "good";
        }
      }

      return {
        id: product,
        product,
        farmers: farmersPlanting,
        traders: tradersDemanding,
        matchStrength,
      };
    });

    setMatches(matchedData);
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

  const perfectMatches = matches.filter((m) => m.matchStrength === "perfect")
    .length;
  const goodMatches = matches.filter((m) => m.matchStrength === "good").length;
  const potentialMatches = matches.filter((m) => m.matchStrength === "potential")
    .length;

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
            Pre-Planting Coordination
          </h1>
          <p className="text-muted-foreground">
            Connect farmers and traders for better planning
          </p>
        </div>

        {/* Summary Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-card border border-border rounded-xl p-6">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-primary" />
              <div className="text-sm text-muted-foreground">Perfect Matches</div>
            </div>
            <div className="text-3xl font-bold text-foreground mt-2">
              {perfectMatches}
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Multiple farmers & traders
            </p>
          </div>
          <div className="bg-card border border-border rounded-xl p-6">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-secondary" />
              <div className="text-sm text-muted-foreground">Good Matches</div>
            </div>
            <div className="text-3xl font-bold text-foreground mt-2">
              {goodMatches}
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Farmer & trader pairs
            </p>
          </div>
          <div className="bg-card border border-border rounded-xl p-6">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-muted-foreground" />
              <div className="text-sm text-muted-foreground">Potential</div>
            </div>
            <div className="text-3xl font-bold text-foreground mt-2">
              {potentialMatches}
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Awaiting participation
            </p>
          </div>
        </div>

        {/* Matches List */}
        <div className="space-y-6">
          {matches.map((match) => {
            if (match.farmers.length === 0 && match.traders.length === 0) {
              return null;
            }

            return (
              <div
                key={match.id}
                className="bg-card border border-border rounded-xl p-6"
              >
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-2xl font-bold text-foreground">
                      {match.product}
                    </h3>
                    <div className="flex items-center gap-2 mt-2">
                      {match.matchStrength === "perfect" && (
                        <span className="inline-flex items-center gap-1 text-sm font-semibold text-primary">
                          <CheckCircle className="w-4 h-4" />
                          Perfect Match
                        </span>
                      )}
                      {match.matchStrength === "good" && (
                        <span className="inline-flex items-center gap-1 text-sm font-semibold text-secondary">
                          <Users className="w-4 h-4" />
                          Good Match
                        </span>
                      )}
                      {match.matchStrength === "potential" && (
                        <span className="text-sm text-muted-foreground">
                          Potential match exists
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                  {/* Farmers Section */}
                  <div>
                    <h4 className="font-bold text-foreground mb-4 flex items-center gap-2">
                      <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-primary/10 text-primary text-sm font-semibold">
                        🚜
                      </span>
                      Farmers ({match.farmers.length})
                    </h4>

                    {match.farmers.length === 0 ? (
                      <p className="text-muted-foreground text-sm">
                        No farmers planning this crop yet
                      </p>
                    ) : (
                      <div className="space-y-3">
                        {match.farmers.map((farmer) => (
                          <div
                            key={farmer.id}
                            className="p-4 rounded-lg bg-muted/30 border border-border"
                          >
                            <p className="font-medium text-foreground">
                              {farmer.name}
                            </p>
                            <p className="text-sm text-muted-foreground mt-1">
                              Region: {farmer.region || "Not specified"}
                            </p>
                            <p className="text-xs text-muted-foreground mt-2">
                              {farmer.phone || "No contact info"}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Traders Section */}
                  <div>
                    <h4 className="font-bold text-foreground mb-4 flex items-center gap-2">
                      <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-secondary/10 text-secondary text-sm font-semibold">
                        📊
                      </span>
                      Traders ({match.traders.length})
                    </h4>

                    {match.traders.length === 0 ? (
                      <p className="text-muted-foreground text-sm">
                        No traders demanding this product yet
                      </p>
                    ) : (
                      <div className="space-y-3">
                        {match.traders.map((trader) => (
                          <div
                            key={trader.id}
                            className="p-4 rounded-lg bg-muted/30 border border-border"
                          >
                            <p className="font-medium text-foreground">
                              {trader.name}
                            </p>
                            <p className="text-sm text-muted-foreground mt-1">
                              Region: {trader.region || "Not specified"}
                            </p>
                            <p className="text-xs text-muted-foreground mt-2">
                              {trader.phone || "No contact info"}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {match.farmers.length > 0 && match.traders.length > 0 && (
                  <div className="mt-6 p-4 rounded-lg bg-primary/10 border border-primary/20">
                    <p className="text-sm text-foreground font-semibold">
                      ✓ Potential match exists for {match.product}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {match.farmers.length} farmer(s) planning to grow{" "}
                      {match.product} and {match.traders.length} trader(s)
                      demanding it. Consider reaching out through official
                      channels to establish connections.
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Info Box */}
        <div className="mt-8 bg-card border border-border rounded-xl p-6">
          <h3 className="font-bold text-foreground mb-3">How Pre-Planting Works</h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>
              1. <strong>Farmers</strong> submit their planting intentions
            </li>
            <li>
              2. <strong>Traders</strong> submit their market demands
            </li>
            <li>
              3. <strong>System matches</strong> farmers and traders by product
            </li>
            <li>
              4. <strong>Both parties</strong> see potential matches on this
              page
            </li>
            <li>
              5. <strong>Connection</strong> helps reduce waste and improve
              planning
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
