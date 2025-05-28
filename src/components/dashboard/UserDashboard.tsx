
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  BarChart3
} from "lucide-react";
import { useAuth, User as UserType } from "@/hooks/useAuth";
import TenantDashboard from "./TenantDashboard";
import LandlordDashboard from "./LandlordDashboard";
import AdminDashboard from "./AdminDashboard";

interface UserDashboardProps {
  user: UserType;
}

const UserDashboard = ({ user }: UserDashboardProps) => {
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin':
        return 'bg-red-100 text-red-800';
      case 'landlord':
        return 'bg-blue-100 text-blue-800';
      case 'tenant':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin':
        return <Shield className="h-4 w-4" />;
      case 'landlord':
        return <Home className="h-4 w-4" />;
      case 'tenant':
        return <Users className="h-4 w-4" />;
      default:
        return <User className="h-4 w-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <Home className="h-8 w-8 text-blue-600" />
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
                RentKenya
              </span>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <Avatar>
                  <AvatarImage src={user.avatar} />
                  <AvatarFallback>
                    {user.firstName[0]}{user.lastName[0]}
                  </AvatarFallback>
                </Avatar>
                <div className="hidden md:block">
                  <p className="text-sm font-medium text-gray-900">
                    {user.firstName} {user.lastName}
                  </p>
                  <div className="flex items-center space-x-2">
                    <Badge className={`text-xs ${getRoleColor(user.role)}`}>
                      {getRoleIcon(user.role)}
                      <span className="ml-1 capitalize">{user.role}</span>
                    </Badge>
                    {!user.isVerified && (
                      <Badge variant="destructive" className="text-xs">
                        Unverified
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
              
              <Button variant="outline" size="sm" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Dashboard Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {user.firstName}!
          </h1>
          <p className="text-gray-600 mt-1">
            {user.role === 'tenant' && "Find your perfect rental home"}
            {user.role === 'landlord' && "Manage your properties and tenants"}
            {user.role === 'admin' && "Monitor platform activity and users"}
          </p>
        </div>

        {/* Role-specific Dashboard */}
        {user.role === 'tenant' && <TenantDashboard user={user} />}
        {user.role === 'landlord' && <LandlordDashboard user={user} />}
        {user.role === 'admin' && <AdminDashboard user={user} />}
      </div>
    </div>
  );
};

export default UserDashboard;
