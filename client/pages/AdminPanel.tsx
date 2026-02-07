import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Leaf, LogOut, Users, CheckCircle, X } from "lucide-react";

interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  region: string;
  role: "farmer" | "trader" | "admin";
  createdAt: string;
  approved?: boolean;
}

interface FarmData {
  id: string;
  userId: string;
  crop: string;
  area: string;
  season: string;
  submittedAt: string;
  approved?: boolean;
}

interface DemandData {
  id: string;
  userId: string;
  product: string;
  quantity: string;
  period: string;
  submittedAt: string;
  approved?: boolean;
}

export default function AdminPanel() {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [farmData, setFarmData] = useState<(FarmData & { userName: string })[]>([]);
  const [demandData, setDemandData] = useState<(DemandData & { userName: string })[]>([]);
  const [activeTab, setActiveTab] = useState<"users" | "farms" | "demands">(
    "users"
  );

  useEffect(() => {
    const currentUser = localStorage.getItem("currentUser");
    if (!currentUser) {
      navigate("/login");
      return;
    }

    // Check if user is admin (hardcoded for now)
    const parsed = JSON.parse(currentUser);
    if (parsed.role !== "admin") {
      navigate("/");
      return;
    }

    setUser(parsed);
    loadData();
  }, [navigate]);

  const loadData = () => {
    const allUsers = JSON.parse(localStorage.getItem("users") || "[]");
    setUsers(allUsers);

    const allFarms = JSON.parse(localStorage.getItem("farmData") || "[]");
    const farmsWithNames = allFarms.map((farm: FarmData) => {
      const userName = allUsers.find((u: User) => u.id === farm.userId)?.name || "Unknown";
      return { ...farm, userName };
    });
    setFarmData(farmsWithNames);

    const allDemands = JSON.parse(localStorage.getItem("demandData") || "[]");
    const demandsWithNames = allDemands.map((demand: DemandData) => {
      const userName = allUsers.find((u: User) => u.id === demand.userId)?.name || "Unknown";
      return { ...demand, userName };
    });
    setDemandData(demandsWithNames);
  };

  const handleApproveFarm = (farmId: string) => {
    const updated = farmData.map((f) =>
      f.id === farmId ? { ...f, approved: true } : f
    );
    setFarmData(updated);

    const allFarms = JSON.parse(localStorage.getItem("farmData") || "[]");
    const updatedFarms = allFarms.map((f: FarmData) =>
      f.id === farmId ? { ...f, approved: true } : f
    );
    localStorage.setItem("farmData", JSON.stringify(updatedFarms));
  };

  const handleApproveDemand = (demandId: string) => {
    const updated = demandData.map((d) =>
      d.id === demandId ? { ...d, approved: true } : d
    );
    setDemandData(updated);

    const allDemands = JSON.parse(localStorage.getItem("demandData") || "[]");
    const updatedDemands = allDemands.map((d: DemandData) =>
      d.id === demandId ? { ...d, approved: true } : d
    );
    localStorage.setItem("demandData", JSON.stringify(updatedDemands));
  };

  const handleRejectFarm = (farmId: string) => {
    const updated = farmData.filter((f) => f.id !== farmId);
    setFarmData(updated);

    const allFarms = JSON.parse(localStorage.getItem("farmData") || "[]");
    const filteredFarms = allFarms.filter((f: FarmData) => f.id !== farmId);
    localStorage.setItem("farmData", JSON.stringify(filteredFarms));
  };

  const handleRejectDemand = (demandId: string) => {
    const updated = demandData.filter((d) => d.id !== demandId);
    setDemandData(updated);

    const allDemands = JSON.parse(localStorage.getItem("demandData") || "[]");
    const filteredDemands = allDemands.filter((d: DemandData) => d.id !== demandId);
    localStorage.setItem("demandData", JSON.stringify(filteredDemands));
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

  const farmers = users.filter((u) => u.role === "farmer");
  const traders = users.filter((u) => u.role === "trader");
  const approvedFarms = farmData.filter((f) => f.approved).length;
  const approvedDemands = demandData.filter((d) => d.approved).length;

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b border-border bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Leaf className="w-8 h-8 text-primary" />
            <span className="font-bold text-xl text-foreground">Agrivers Admin</span>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-foreground hover:text-destructive transition-colors"
          >
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Admin Dashboard
          </h1>
          <p className="text-muted-foreground">
            Manage users and submitted data
          </p>
        </div>

        {/* Summary Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="bg-card border border-border rounded-xl p-6">
            <div className="text-sm text-muted-foreground">Total Users</div>
            <div className="text-3xl font-bold text-foreground mt-2">
              {users.length}
            </div>
          </div>
          <div className="bg-card border border-border rounded-xl p-6">
            <div className="text-sm text-muted-foreground">Farmers</div>
            <div className="text-3xl font-bold text-primary mt-2">
              {farmers.length}
            </div>
          </div>
          <div className="bg-card border border-border rounded-xl p-6">
            <div className="text-sm text-muted-foreground">Traders</div>
            <div className="text-3xl font-bold text-secondary mt-2">
              {traders.length}
            </div>
          </div>
          <div className="bg-card border border-border rounded-xl p-6">
            <div className="text-sm text-muted-foreground">Pending Approval</div>
            <div className="text-3xl font-bold text-yellow-600 mt-2">
              {farmData.filter((f) => !f.approved).length +
                demandData.filter((d) => !d.approved).length}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 border-b border-border">
          <button
            onClick={() => setActiveTab("users")}
            className={`px-4 py-3 font-medium border-b-2 transition-colors ${
              activeTab === "users"
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            Users
          </button>
          <button
            onClick={() => setActiveTab("farms")}
            className={`px-4 py-3 font-medium border-b-2 transition-colors ${
              activeTab === "farms"
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            Farm Data
          </button>
          <button
            onClick={() => setActiveTab("demands")}
            className={`px-4 py-3 font-medium border-b-2 transition-colors ${
              activeTab === "demands"
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            Demand Data
          </button>
        </div>

        {/* Users Tab */}
        {activeTab === "users" && (
          <div className="bg-card border border-border rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border bg-muted/30">
                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                      Name
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                      Email
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                      Role
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                      Region
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                      Joined
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u) => (
                    <tr
                      key={u.id}
                      className="border-b border-border hover:bg-muted/20 transition-colors"
                    >
                      <td className="px-6 py-4 font-medium text-foreground">
                        {u.name}
                      </td>
                      <td className="px-6 py-4 text-muted-foreground">
                        {u.email}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`text-xs font-semibold px-3 py-1 rounded-full ${
                            u.role === "farmer"
                              ? "bg-primary/10 text-primary"
                              : "bg-secondary/10 text-secondary"
                          }`}
                        >
                          {u.role === "farmer" ? "🚜 Farmer" : "📊 Trader"}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-muted-foreground">
                        {u.region || "-"}
                      </td>
                      <td className="px-6 py-4 text-muted-foreground text-sm">
                        {new Date(u.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Farm Data Tab */}
        {activeTab === "farms" && (
          <div className="space-y-4">
            {farmData.length === 0 ? (
              <div className="bg-card border border-border rounded-xl p-8 text-center">
                <p className="text-muted-foreground">No farm data submitted yet</p>
              </div>
            ) : (
              farmData.map((farm) => (
                <div
                  key={farm.id}
                  className="bg-card border border-border rounded-xl p-6"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-bold text-lg text-foreground">
                          {farm.crop}
                        </h3>
                        {farm.approved && (
                          <CheckCircle className="w-5 h-5 text-primary" />
                        )}
                      </div>
                      <p className="text-muted-foreground mb-3">
                        Farmer: {farm.userName}
                      </p>
                      <div className="grid md:grid-cols-3 gap-4">
                        <div>
                          <span className="text-xs text-muted-foreground">Area</span>
                          <p className="font-medium text-foreground">
                            {farm.area} hectares
                          </p>
                        </div>
                        <div>
                          <span className="text-xs text-muted-foreground">Season</span>
                          <p className="font-medium text-foreground">
                            {farm.season}
                          </p>
                        </div>
                        <div>
                          <span className="text-xs text-muted-foreground">Submitted</span>
                          <p className="font-medium text-foreground">
                            {new Date(farm.submittedAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </div>
                    {!farm.approved && (
                      <div className="flex gap-2 ml-4">
                        <button
                          onClick={() => handleApproveFarm(farm.id)}
                          className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium text-sm"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleRejectFarm(farm.id)}
                          className="px-4 py-2 border border-border text-foreground rounded-lg hover:bg-muted/30 transition-colors"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Demand Data Tab */}
        {activeTab === "demands" && (
          <div className="space-y-4">
            {demandData.length === 0 ? (
              <div className="bg-card border border-border rounded-xl p-8 text-center">
                <p className="text-muted-foreground">No demand data submitted yet</p>
              </div>
            ) : (
              demandData.map((demand) => (
                <div
                  key={demand.id}
                  className="bg-card border border-border rounded-xl p-6"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-bold text-lg text-foreground">
                          {demand.product}
                        </h3>
                        {demand.approved && (
                          <CheckCircle className="w-5 h-5 text-primary" />
                        )}
                      </div>
                      <p className="text-muted-foreground mb-3">
                        Trader: {demand.userName}
                      </p>
                      <div className="grid md:grid-cols-3 gap-4">
                        <div>
                          <span className="text-xs text-muted-foreground">Quantity</span>
                          <p className="font-medium text-foreground">
                            {demand.quantity} units
                          </p>
                        </div>
                        <div>
                          <span className="text-xs text-muted-foreground">Period</span>
                          <p className="font-medium text-foreground">
                            {demand.period}
                          </p>
                        </div>
                        <div>
                          <span className="text-xs text-muted-foreground">Submitted</span>
                          <p className="font-medium text-foreground">
                            {new Date(demand.submittedAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </div>
                    {!demand.approved && (
                      <div className="flex gap-2 ml-4">
                        <button
                          onClick={() => handleApproveDemand(demand.id)}
                          className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium text-sm"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleRejectDemand(demand.id)}
                          className="px-4 py-2 border border-border text-foreground rounded-lg hover:bg-muted/30 transition-colors"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
