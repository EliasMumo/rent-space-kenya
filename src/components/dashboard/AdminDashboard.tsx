
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Users, 
  Home, 
  AlertTriangle, 
  TrendingUp,
  Shield,
  CheckCircle,
  XCircle,
  Clock
} from "lucide-react";
import { User } from "@/hooks/useAuth";

interface AdminDashboardProps {
  user: User;
}

const AdminDashboard = ({ user }: AdminDashboardProps) => {
  // Sample admin data
  const stats = {
    totalUsers: 1250,
    totalLandlords: 350,
    totalTenants: 850,
    totalProperties: 425,
    pendingVerifications: 12,
    reportedListings: 3,
    activeListings: 387,
    newUsersThisWeek: 45
  };

  const pendingVerifications = [
    {
      id: 1,
      name: "John Kimani",
      email: "john.kimani@example.com",
      role: "landlord",
      submittedAt: "2024-01-15",
      documents: ["National ID", "Title Deed"]
    },
    {
      id: 2,
      name: "Mary Wanjiku",
      email: "mary.wanjiku@example.com", 
      role: "landlord",
      submittedAt: "2024-01-14",
      documents: ["National ID", "Business Permit"]
    }
  ];

  const reportedListings = [
    {
      id: 1,
      property: "2BR Apartment in Westlands",
      reporter: "Jane Doe",
      reason: "Misleading photos",
      status: "pending",
      reportedAt: "2024-01-15"
    },
    {
      id: 2,
      property: "3BR House in Karen",
      reporter: "Peter Mwangi",
      reason: "Fake listing",
      status: "investigating",
      reportedAt: "2024-01-14"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'investigating':
        return 'bg-blue-100 text-blue-800';
      case 'resolved':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Platform Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalUsers}</div>
            <p className="text-xs text-muted-foreground">
              +{stats.newUsersThisWeek} this week
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Properties</CardTitle>
            <Home className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalProperties}</div>
            <p className="text-xs text-muted-foreground">
              {stats.activeListings} active
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Verifications</CardTitle>
            <Clock className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pendingVerifications}</div>
            <p className="text-xs text-muted-foreground">Require approval</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Reports</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.reportedListings}</div>
            <p className="text-xs text-muted-foreground">Need attention</p>
          </CardContent>
        </Card>
      </div>

      {/* User Distribution */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>User Distribution</CardTitle>
            <CardDescription>Breakdown of platform users by role</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Users className="h-4 w-4 text-green-500" />
                  <span>Tenants</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant="secondary">{stats.totalTenants}</Badge>
                  <span className="text-sm text-gray-500">
                    {Math.round((stats.totalTenants / stats.totalUsers) * 100)}%
                  </span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Home className="h-4 w-4 text-blue-500" />
                  <span>Landlords</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant="secondary">{stats.totalLandlords}</Badge>
                  <span className="text-sm text-gray-500">
                    {Math.round((stats.totalLandlords / stats.totalUsers) * 100)}%
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Platform activity overview</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm">New registrations today</span>
                <Badge variant="secondary">12</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Properties posted today</span>
                <Badge variant="secondary">8</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Verifications completed</span>
                <Badge variant="secondary">5</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Reports resolved</span>
                <Badge variant="secondary">2</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Management Tabs */}
      <Tabs defaultValue="verifications" className="space-y-4">
        <TabsList>
          <TabsTrigger value="verifications">Pending Verifications</TabsTrigger>
          <TabsTrigger value="reports">Reported Listings</TabsTrigger>
          <TabsTrigger value="users">User Management</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="verifications" className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">KYC Verifications</h3>
            <Badge variant="secondary">{pendingVerifications.length} pending</Badge>
          </div>
          
          <div className="space-y-4">
            {pendingVerifications.map((verification) => (
              <Card key={verification.id}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="space-y-2">
                      <h4 className="font-semibold">{verification.name}</h4>
                      <p className="text-sm text-gray-600">{verification.email}</p>
                      <Badge className="bg-blue-100 text-blue-800 capitalize">
                        <Shield className="h-3 w-3 mr-1" />
                        {verification.role}
                      </Badge>
                      <div className="text-sm text-gray-500">
                        Submitted: {verification.submittedAt}
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {verification.documents.map((doc, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {doc}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    
                    <div className="flex space-x-2">
                      <Button size="sm" className="bg-green-600 hover:bg-green-700">
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Approve
                      </Button>
                      <Button size="sm" variant="destructive">
                        <XCircle className="h-4 w-4 mr-1" />
                        Reject
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="reports" className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Reported Listings</h3>
            <Badge variant="destructive">{reportedListings.length} active</Badge>
          </div>
          
          <div className="space-y-4">
            {reportedListings.map((report) => (
              <Card key={report.id}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="space-y-2">
                      <h4 className="font-semibold">{report.property}</h4>
                      <p className="text-sm text-gray-600">
                        Reported by: {report.reporter}
                      </p>
                      <p className="text-sm">
                        Reason: <span className="font-medium">{report.reason}</span>
                      </p>
                      <div className="text-sm text-gray-500">
                        Reported: {report.reportedAt}
                      </div>
                      <Badge className={getStatusColor(report.status)}>
                        {report.status}
                      </Badge>
                    </div>
                    
                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline">
                        Investigate
                      </Button>
                      <Button size="sm" variant="destructive">
                        Remove Listing
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="users" className="space-y-4">
          <div className="text-center py-8 text-gray-500">
            <Users className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p>User management interface</p>
            <p className="text-sm">Search, filter, and manage platform users</p>
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="text-center py-8 text-gray-500">
            <TrendingUp className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p>Analytics dashboard</p>
            <p className="text-sm">Platform metrics and insights</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminDashboard;
