import { ArrowRight, Leaf, TrendingUp, Users, Zap } from "lucide-react";
import { Link } from "react-router-dom";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { useLanguage } from "@/components/LanguageProvider";
import { translations } from "@/utils/language";

export default function Index() {
  const { language } = useLanguage();
  const t = (key: string) => (translations[language] as any)[key] || key;

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Leaf className="w-8 h-8 text-primary" />
            <span className="font-bold text-xl text-foreground">AgroConnect</span>
          </div>
          <div className="flex items-center gap-4">
            <LanguageSwitcher />
            <Link
              to="/login"
              className="text-foreground hover:text-primary transition-colors font-medium"
            >
              {t("nav.login")}
            </Link>
            <Link
              to="/register"
              className="bg-primary text-primary-foreground px-6 py-2 rounded-lg hover:bg-primary/90 transition-colors font-medium"
            >
              {t("nav.register")}
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 leading-tight">
              {t("home.title")}
            </h1>
            <p className="text-lg text-muted-foreground mb-8">
              {t("home.subtitle")}
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                to="/register"
                className="bg-primary text-primary-foreground px-8 py-3 rounded-lg hover:bg-primary/90 transition-colors font-semibold inline-flex items-center justify-center gap-2"
              >
                {t("home.getStarted")} <ArrowRight className="w-5 h-5" />
              </Link>
              <a
                href="#features"
                className="border-2 border-primary text-primary px-8 py-3 rounded-lg hover:bg-primary/5 transition-colors font-semibold"
              >
                {t("home.learnMore")}
              </a>
            </div>
          </div>
          <div className="rounded-2xl h-96 overflow-hidden shadow-lg">
            <img
              src="https://images.pexels.com/photos/29294526/pexels-photo-29294526.jpeg"
              alt="Farmer working in field at sunrise"
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
            />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="bg-secondary/5 py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              {t("home.platformFeatures")}
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {t("home.featuresDesc")}
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Farmer Features */}
            <div className="bg-card rounded-xl p-6 border border-border hover:border-primary transition-colors">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <Leaf className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-bold text-lg text-foreground mb-2">
                {t("home.forFarmers")}
              </h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>✓ {t("home.smartPlanting")}</li>
                <li>✓ {t("home.riskAssessment")}</li>
                <li>✓ {t("home.marketForecasts")}</li>
                <li>✓ {t("home.pdfReports")}</li>
              </ul>
            </div>

            {/* Trader Features */}
            <div className="bg-card rounded-xl p-6 border border-border hover:border-primary transition-colors">
              <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center mb-4">
                <TrendingUp className="w-6 h-6 text-secondary" />
              </div>
              <h3 className="font-bold text-lg text-foreground mb-2">
                {t("home.forTraders")}
              </h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>✓ {t("home.demandManagement")}</li>
                <li>✓ {t("home.supplyAlerts")}</li>
                <li>✓ {t("home.marketIntelligence")}</li>
                <li>✓ {t("home.priceInsights")}</li>
              </ul>
            </div>

            {/* Market Analysis */}
            <div className="bg-card rounded-xl p-6 border border-border hover:border-primary transition-colors">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <Zap className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-bold text-lg text-foreground mb-2">
                {t("home.marketAnalysis")}
              </h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>✓ {t("home.supplyVsDemand")}</li>
                <li>✓ {t("home.priceIndicators")}</li>
                <li>✓ {t("home.shortageDetection")}</li>
                <li>✓ {t("home.seasonalTrends")}</li>
              </ul>
            </div>

            {/* Coordination */}
            <div className="bg-card rounded-xl p-6 border border-border hover:border-primary transition-colors">
              <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-secondary" />
              </div>
              <h3 className="font-bold text-lg text-foreground mb-2">
                {t("home.prePlantingMatch")}
              </h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>✓ {t("home.findTradingPartners")}</li>
                <li>✓ {t("home.reduceUncertainty")}</li>
                <li>✓ {t("home.planProduction")}</li>
                <li>✓ {t("home.minimizeWaste")}</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              {t("home.howItWorks")}
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                1
              </div>
              <h3 className="font-bold text-lg text-foreground mb-2">
                {t("home.createAccount")}
              </h3>
              <p className="text-muted-foreground">
                {t("home.registerProfile")}
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                2
              </div>
              <h3 className="font-bold text-lg text-foreground mb-2">
                {t("home.submitData")}
              </h3>
              <p className="text-muted-foreground">
                {t("home.enterDetails")}
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                3
              </div>
              <h3 className="font-bold text-lg text-foreground mb-2">
                {t("home.makeDecisions")}
              </h3>
              <p className="text-muted-foreground">
                {t("home.viewInsights")}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary text-primary-foreground py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            {t("home.readyTransform")}
          </h2>
          <p className="text-lg opacity-90 mb-8 max-w-2xl mx-auto">
            {t("home.joinPlatform")}
          </p>
          <Link
            to="/register"
            className="bg-primary-foreground text-primary px-8 py-3 rounded-lg hover:bg-primary-foreground/90 transition-colors font-semibold inline-flex items-center gap-2"
          >
            {t("home.startFree")} <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-muted/30 border-t border-border py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center gap-2 mb-4 md:mb-0">
              <Leaf className="w-6 h-6 text-primary" />
              <span className="font-bold text-foreground">AgroConnect</span>
            </div>
            <p className="text-muted-foreground text-sm">
              © 2024 AgroConnect. Connecting farms to markets.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
