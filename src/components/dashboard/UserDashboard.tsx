
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Home, 
  User, 
  Settings, 
  Heart, 
  MessageSquare, 
  Plus,
  LogOut,
  Shield,
  Eye,
  Users,
  BarChart3,
  Bell
} from "lucide-react";
import { useAuth, User as UserType } from "@/hooks/useAuth";
import TenantDashboard from "./TenantDashboard";
import LandlordDashboard from "./LandlordDashboard";
import AdminDashboard from "./AdminDashboard";

interface UserDashboardProps {
  user: UserType;
}

const UserDashboard = ({ user }: UserDashboardProps) => {
  const { logout, loading } = useAuth();

  const handleLogout = async () => {
    await logout();
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'landlord':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'tenant':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin':
        return <Shield className="h-3 w-3" />;
      case 'landlord':
        return <Home className="h-3 w-3" />;
      case 'tenant':
        return <Users className="h-3 w-3" />;
      default:
        return <User className="h-3 w-3" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="bg-white/95 backdrop-blur-md border-b border-slate-200 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <Home className="h-8 w-8 text-blue-600" />
                <div className="absolute -inset-1 bg-blue-600 rounded-full blur opacity-20"></div>
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-transparent">
                RentKenya
              </span>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* Notifications */}
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></div>
              </Button>

              {/* User Profile */}
              <div className="flex items-center space-x-3 bg-slate-50 rounded-full pl-1 pr-4 py-1">
                <Avatar className="h-9 w-9 border-2 border-white shadow-md">
                  <AvatarImage src={user.avatar} />
                  <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white font-semibold">
                    {user.firstName[0]}{user.lastName[0]}
                  </AvatarFallback>
                </Avatar>
                <div className="hidden md:block">
                  <p className="text-sm font-semibold text-slate-900">
                    {user.firstName} {user.lastName}
                  </p>
                  <div className="flex items-center space-x-2">
                    <Badge className={`text-xs border ${getRoleColor(user.role)}`}>
                      {getRoleIcon(user.role)}
                      <span className="ml-1 capitalize">{user.role}</span>
                    </Badge>
                  </div>
                </div>
              </div>
              
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleLogout}
                disabled={loading}
                className="border-slate-300 hover:bg-slate-50"
              >
                <LogOut className="h-4 w-4 mr-2" />
                {loading ? 'Logging out...' : 'Logout'}
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Dashboard Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg">
              <div className="text-white text-lg">👋</div>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-900">
                Welcome back, {user.firstName}!
              </h1>
              <p className="text-slate-600 mt-1">
                {user.role === 'tenant' && "Discover amazing rental properties tailored just for you"}
                {user.role === 'landlord' && "Manage your properties and connect with quality tenants"}
                {user.role === 'admin' && "Monitor platform activity and ensure quality service"}
              </p>
            </div>
          </div>
        </div>

        {/* Role-specific Dashboard */}
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 rounded-3xl"></div>
          <div className="relative">
            {user.role === 'tenant' && <TenantDashboard user={user} />}
            {user.role === 'landlord' && <LandlordDashboard user={user} />}
            {user.role === 'admin' && <AdminDashboard user={user} />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
