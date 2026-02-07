import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Leaf, LogOut, Plus, Download, AlertTriangle, CheckCircle } from "lucide-react";
import { useLanguage } from "@/components/LanguageProvider";
import { translations } from "@/utils/language";

interface FarmData {
  id: string;
  crop: string;
  area: string;
  season: string;
  submittedAt: string;
}

interface Recommendation {
  recommended: string[];
  avoided: string[];
  riskLevel: "Low" | "Medium" | "High";
}

const CROPS = [
  "Wheat",
  "Barley",
  "Dates",
  "Tomatoes",
  "Cucumber",
  "Carrot",
  "Onion",
  "Potato",
];
const SEASONS = ["Spring", "Summer", "Fall", "Winter"];

export default function FarmerDashboard() {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const t = (key: string) => (translations[language] as any)[key] || key;
  const [user, setUser] = useState<any>(null);
  const [farms, setFarms] = useState<FarmData[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedFarm, setSelectedFarm] = useState<FarmData | null>(null);
  const [recommendation, setRecommendation] = useState<Recommendation | null>(
    null
  );

  const [formData, setFormData] = useState({
    crop: "",
    area: "",
    season: "",
  });

  useEffect(() => {
    // Check if user is logged in
    const currentUser = localStorage.getItem("currentUser");
    if (!currentUser || JSON.parse(currentUser).role !== "farmer") {
      navigate("/login");
      return;
    }
    setUser(JSON.parse(currentUser));

    // Load farm data
    const farmData = JSON.parse(localStorage.getItem("farmData") || "[]");
    const userFarms = farmData.filter(
      (f: FarmData) => f.userId === JSON.parse(currentUser).id
    );
    setFarms(userFarms);
  }, [navigate]);

  const getRiskLevel = (crop: string, season: string): "Low" | "Medium" | "High" => {
    const riskMap: Record<string, Record<string, "Low" | "Medium" | "High">> = {
      Wheat: { Spring: "Low", Summer: "High", Fall: "Medium", Winter: "Low" },
      Barley: { Spring: "Low", Summer: "High", Fall: "Medium", Winter: "Low" },
      Dates: { Spring: "Low", Summer: "Low", Fall: "Medium", Winter: "High" },
      Tomatoes: { Spring: "Low", Summer: "High", Fall: "Medium", Winter: "High" },
      Cucumber: { Spring: "Medium", Summer: "High", Fall: "Low", Winter: "High" },
      Carrot: { Spring: "Low", Summer: "High", Fall: "Low", Winter: "Medium" },
      Onion: { Spring: "Low", Summer: "Medium", Fall: "Low", Winter: "Medium" },
      Potato: { Spring: "Medium", Summer: "High", Fall: "Medium", Winter: "Low" },
    };
    return riskMap[crop]?.[season] || "Medium";
  };

  const getRecommendations = (crop: string): Recommendation => {
    const allCrops = CROPS;
    const avoided = allCrops.filter((c) => c !== crop).slice(0, 2);
    const recommended = allCrops.filter(
      (c) => c !== crop && !avoided.includes(c)
    ).slice(0, 3);

    return {
      recommended,
      avoided,
      riskLevel: "Medium",
    };
  };

  const handleAddFarm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.crop || !formData.area || !formData.season) {
      alert("Please fill all fields");
      return;
    }

    const newFarm: FarmData = {
      id: Date.now().toString(),
      crop: formData.crop,
      area: formData.area,
      season: formData.season,
      submittedAt: new Date().toISOString(),
      userId: user.id,
    };

    const allFarms = JSON.parse(localStorage.getItem("farmData") || "[]");
    allFarms.push(newFarm);
    localStorage.setItem("farmData", JSON.stringify(allFarms));

    setFarms([...farms, newFarm]);
    setFormData({ crop: "", area: "", season: "" });
    setShowAddForm(false);
  };

  const handleViewRecommendation = (farm: FarmData) => {
    setSelectedFarm(farm);
    const rec = getRecommendations(farm.crop);
    rec.riskLevel = getRiskLevel(farm.crop, farm.season);
    setRecommendation(rec);
  };

  const handleDownloadReport = () => {
    if (!selectedFarm || !recommendation) return;

    const doc = `
    FARM RECOMMENDATION REPORT
    ========================
    
    Farm Owner: ${user.name}
    Date: ${new Date().toLocaleDateString()}
    
    FARM DATA
    ---------
    Crop: ${selectedFarm.crop}
    Area: ${selectedFarm.area} hectares
    Season: ${selectedFarm.season}
    
    RECOMMENDATIONS
    ----------------
    
    ✓ Recommended Crops:
    ${recommendation.recommended.map((c) => `  - ${c}`).join("\n")}
    
    ✗ Avoid Planting:
    ${recommendation.avoided.map((c) => `  - ${c}`).join("\n")}
    
    RISK ASSESSMENT
    ----------------
    Risk Level: ${recommendation.riskLevel}
    ${recommendation.riskLevel === "Low" ? "✓ Low risk - Good conditions for planting" : ""}
    ${recommendation.riskLevel === "Medium" ? "⚠ Medium risk - Consider market conditions" : ""}
    ${recommendation.riskLevel === "High" ? "⚠ High risk - Check weather and market before planting" : ""}
    
    MARKET INDICATORS
    ------------------
    Monitor supply-demand trends at the market analysis section
    for the best pricing strategies.
    
    Generated by AgroConnect
    `;

    const element = document.createElement("a");
    element.setAttribute(
      "href",
      "data:text/plain;charset=utf-8," + encodeURIComponent(doc)
    );
    element.setAttribute(
      "download",
      `Farm-Recommendation-${selectedFarm.crop}-${Date.now()}.txt`
    );
    element.style.display = "none";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handleLogout = () => {
    localStorage.removeItem("currentUser");
    navigate("/");
  };

  if (!user) {
    return <div className="min-h-screen bg-background flex items-center justify-center">Loading...</div>;
  }

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
            {t("farmer.dashboard")}
          </h1>
          <p className="text-muted-foreground">
            {t("farmer.manage")}
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-card border border-border rounded-xl p-6">
            <div className="text-sm text-muted-foreground">{t("farmer.totalFarms")}</div>
            <div className="text-3xl font-bold text-foreground mt-2">
              {farms.length}
            </div>
          </div>
          <div className="bg-card border border-border rounded-xl p-6">
            <div className="text-sm text-muted-foreground">{t("farmer.region")}</div>
            <div className="text-2xl font-bold text-foreground mt-2">
              {user.region || "-"}
            </div>
          </div>
          <div className="bg-card border border-border rounded-xl p-6">
            <div className="text-sm text-muted-foreground">{t("farmer.memberSince")}</div>
            <div className="text-lg font-semibold text-foreground mt-2">
              {new Date(user.createdAt).toLocaleDateString()}
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Farms List */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-foreground">{t("farmer.myFarms")}</h2>
              <button
                onClick={() => setShowAddForm(!showAddForm)}
                className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors"
              >
                <Plus className="w-5 h-5" />
                {t("farmer.addFarm")}
              </button>
            </div>

            {showAddForm && (
              <form
                onSubmit={handleAddFarm}
                className="bg-card border border-border rounded-xl p-6 mb-6"
              >
                <h3 className="font-bold text-lg text-foreground mb-4">
                  {t("farmer.addNewFarm")}
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      {t("farmer.crop")}
                    </label>
                    <select
                      value={formData.crop}
                      onChange={(e) =>
                        setFormData({ ...formData, crop: e.target.value })
                      }
                      className="w-full px-4 py-2 border border-border rounded-lg bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      <option value="">{t("farmer.selectCrop")}</option>
                      {CROPS.map((crop) => (
                        <option key={crop} value={crop}>
                          {crop}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      {t("farmer.area")}
                    </label>
                    <input
                      type="number"
                      value={formData.area}
                      onChange={(e) =>
                        setFormData({ ...formData, area: e.target.value })
                      }
                      placeholder={t("farmer.enterArea")}
                      className="w-full px-4 py-2 border border-border rounded-lg bg-input text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      {t("farmer.season")}
                    </label>
                    <select
                      value={formData.season}
                      onChange={(e) =>
                        setFormData({ ...formData, season: e.target.value })
                      }
                      className="w-full px-4 py-2 border border-border rounded-lg bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      <option value="">{t("farmer.selectSeason")}</option>
                      {SEASONS.map((season) => (
                        <option key={season} value={season}>
                          {season}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="flex gap-4">
                    <button
                      type="submit"
                      className="flex-1 bg-primary text-primary-foreground py-2 rounded-lg font-semibold hover:bg-primary/90 transition-colors"
                    >
                      {t("common.addFarm")}
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

            {farms.length === 0 ? (
              <div className="bg-card border border-border rounded-xl p-8 text-center">
                <Leaf className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">{t("farmer.noFarms")}</p>
                <p className="text-sm text-muted-foreground mt-2">
                  {t("farmer.addFirstFarm")}
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {farms.map((farm) => (
                  <div
                    key={farm.id}
                    className="bg-card border border-border rounded-xl p-6 hover:border-primary transition-colors cursor-pointer"
                    onClick={() => handleViewRecommendation(farm)}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-bold text-lg text-foreground">
                          {farm.crop}
                        </h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          Area: {farm.area} hectares | Season: {farm.season}
                        </p>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {new Date(farm.submittedAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Recommendation Panel */}
          <div>
            <h2 className="text-2xl font-bold text-foreground mb-6">
              {t("farmer.recommendation")}
            </h2>

            {!selectedFarm ? (
              <div className="bg-card border border-border rounded-xl p-6 text-center">
                <Leaf className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">
                  {t("farmer.selectFarm")}
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="bg-card border border-border rounded-xl p-6">
                  <h3 className="font-bold text-foreground mb-4">
                    {selectedFarm.crop} - {selectedFarm.season}
                  </h3>

                  {/* Risk Level */}
                  <div className="mb-6 p-4 rounded-lg bg-primary/10 border border-primary/20">
                    <div className="flex items-center gap-2 mb-2">
                      {recommendation?.riskLevel === "Low" && (
                        <CheckCircle className="w-5 h-5 text-green-600" />
                      )}
                      {recommendation?.riskLevel === "Medium" && (
                        <AlertTriangle className="w-5 h-5 text-yellow-600" />
                      )}
                      {recommendation?.riskLevel === "High" && (
                        <AlertTriangle className="w-5 h-5 text-red-600" />
                      )}
                      <span className="font-semibold text-foreground">
                        {t("farmer.riskLevel")}: {recommendation?.riskLevel}
                      </span>
                    </div>
                  </div>

                  {/* Recommendations */}
                  <div className="mb-6">
                    <h4 className="font-semibold text-foreground mb-3 text-sm">
                      {t("farmer.recommended")}
                    </h4>
                    <ul className="space-y-2">
                      {recommendation?.recommended.map((crop) => (
                        <li
                          key={crop}
                          className="text-sm text-muted-foreground flex items-center gap-2"
                        >
                          <CheckCircle className="w-4 h-4 text-primary" />
                          {crop}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="mb-6">
                    <h4 className="font-semibold text-foreground mb-3 text-sm">
                      {t("farmer.avoid")}
                    </h4>
                    <ul className="space-y-2">
                      {recommendation?.avoided.map((crop) => (
                        <li
                          key={crop}
                          className="text-sm text-muted-foreground flex items-center gap-2"
                        >
                          <AlertTriangle className="w-4 h-4 text-destructive" />
                          {crop}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <button
                    onClick={handleDownloadReport}
                    className="w-full flex items-center justify-center gap-2 bg-secondary text-secondary-foreground py-2 rounded-lg hover:bg-secondary/90 transition-colors font-semibold"
                  >
                    <Download className="w-5 h-5" />
                    {t("farmer.downloadReport")}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
