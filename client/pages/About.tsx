import { Leaf, TrendingUp, Users, Target } from "lucide-react";
import { Link } from "react-router-dom";
import { useLanguage } from "@/components/LanguageProvider";
import { translations } from "@/utils/language";

export default function About() {
  const { language } = useLanguage();
  const t = (key: string) => (translations[language] as any)[key] || key;

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
            <Link to="/about" className="text-primary font-medium text-sm">
              {t("nav.about")}
            </Link>
            <Link to="/contact" className="text-foreground hover:text-primary transition-colors text-sm">
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
            {t("about.title")}
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {t("about.subtitle")}
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="bg-secondary/5 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-foreground mb-4">
                {t("about.mission")}
              </h2>
              <p className="text-muted-foreground mb-4">
                {t("about.missionDesc")}
              </p>
              <p className="text-muted-foreground">
                {t("about.missionDesc2")}
              </p>
            </div>
            <div className="bg-primary/10 rounded-2xl h-96 flex items-center justify-center">
              <Target className="w-32 h-32 text-primary opacity-50" />
            </div>
          </div>
        </div>
      </section>

      {/* Vision & Values */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-foreground mb-12 text-center">
            {t("about.vision")}
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-card rounded-xl p-8 border border-border">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <Leaf className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-bold text-lg text-foreground mb-3">
                {t("about.sustainability")}
              </h3>
              <p className="text-muted-foreground text-sm">
                {t("about.sustainabilityDesc")}
              </p>
            </div>

            <div className="bg-card rounded-xl p-8 border border-border">
              <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center mb-4">
                <TrendingUp className="w-6 h-6 text-secondary" />
              </div>
              <h3 className="font-bold text-lg text-foreground mb-3">
                {t("about.innovation")}
              </h3>
              <p className="text-muted-foreground text-sm">
                {t("about.innovationDesc")}
              </p>
            </div>

            <div className="bg-card rounded-xl p-8 border border-border">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-bold text-lg text-foreground mb-3">
                {t("about.community")}
              </h3>
              <p className="text-muted-foreground text-sm">
                {t("about.communityDesc")}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="bg-secondary/5 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-foreground mb-4">
            {t("about.team")}
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto mb-8">
            {t("about.teamDesc")}
          </p>
          <div className="bg-card rounded-xl p-8 border border-border inline-block">
            <p className="text-muted-foreground">
              {t("about.joiningTeam")}
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary text-primary-foreground py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">
            {t("about.readyJoin")}
          </h2>
          <p className="text-lg opacity-90 mb-8 max-w-2xl mx-auto">
            {t("about.joinDesc")}
          </p>
          <Link
            to="/register"
            className="bg-primary-foreground text-primary px-8 py-3 rounded-lg hover:bg-primary-foreground/90 transition-colors font-semibold inline-block"
          >
            {t("about.startNow")}
          </Link>
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
