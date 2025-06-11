import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Header } from '@/components/Header';
import Footer from '@/components/Footer';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Users, 
  Award, 
  TrendingUp, 
  FileText, 
  Settings, 
  Plus,
  Download,
  Users as UsersIcon,
  Calendar,
  Shield,
  BarChart3,
  PieChart,
  Activity
} from 'lucide-react';

interface DashboardStats {
  totalCertifications: number;
  activeCertifications: number;
  totalRecipients: number;
  activeRecipients: number;
  templatesCreated: number;
  verificationRate: number;
  monthlyGrowth: number;
}

interface CertificationTemplate {
  id: string;
  name: string;
  description: string;
  issued: number;
  status: 'active' | 'draft' | 'archived';
  createdAt: string;
}

const OrganizationDashboard = () => {
  const [stats] = useState<DashboardStats>({
    totalCertifications: 1247,
    activeCertifications: 23,
    totalRecipients: 892,
    activeRecipients: 734,
    templatesCreated: 15,
    verificationRate: 98.5,
    monthlyGrowth: 12.5
  });

  const handleExportData = () => {
    const csvData = [
      ['Metric', 'Value'],
      ['Total Certifications', stats.totalCertifications],
      ['Active Recipients', stats.activeRecipients],
      ['Templates Created', stats.templatesCreated],
      ['Verification Rate', `${stats.verificationRate}%`],
      ['Export Date', new Date().toLocaleDateString()]
    ];
    
    const csvContent = csvData.map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `organization-data-${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handleIssueCertificate = (templateId: string) => {
    // Generate a unique certificate ID and verification code
    const certificateId = `CERT-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
    const verificationCode = `VER-${Math.random().toString(36).substr(2, 12).toUpperCase()}`;
    
    // In a real application, this would interact with blockchain
    console.log('Issuing certificate:', {
      templateId,
      certificateId,
      verificationCode,
      issuedAt: new Date().toISOString(),
      blockchain: 'Ethereum',
      status: 'issued'
    });
    
    // Show success message or redirect to recipient management
    alert(`Certificate issued successfully!\nCertificate ID: ${certificateId}\nVerification Code: ${verificationCode}`);
  };

  const [templates] = useState<CertificationTemplate[]>([
    {
      id: '1',
      name: 'Web Development Certification',
      description: 'Full-stack web development course completion',
      issued: 156,
      status: 'active',
      createdAt: '2024-01-15'
    },
    {
      id: '2',
      name: 'Blockchain Fundamentals',
      description: 'Introduction to blockchain technology',
      issued: 89,
      status: 'active',
      createdAt: '2024-02-01'
    },
    {
      id: '3',
      name: 'Security Training',
      description: 'Cybersecurity awareness training',
      issued: 234,
      status: 'active',
      createdAt: '2024-01-10'
    }
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500';
      case 'draft': return 'bg-yellow-500';
      case 'archived': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="min-h-screen bg-gray-900">
      <Header />
      <motion.main 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="container mx-auto px-4 py-8 pt-24"
      >
        <div className="max-w-7xl mx-auto">
          {/* Header Section */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">Organization Dashboard</h1>
              <p className="text-gray-400">Manage your certification programs and track performance</p>
            </div>
            <div className="flex gap-3">
              <Button 
                variant="outline" 
                className="bg-gray-800 text-white border-gray-700"
                onClick={handleExportData}
              >
                <Download className="h-4 w-4 mr-2" />
                Export Data
              </Button>
              <Button className="bg-green-600 hover:bg-green-700" asChild>
                <Link to="/template-builder">
                  <Plus className="h-4 w-4 mr-2" />
                  New Template
                </Link>
              </Button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-200">Total Certifications</CardTitle>
                <Award className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">{stats.totalCertifications.toLocaleString()}</div>
                <p className="text-xs text-gray-400">Issued to date</p>
              </CardContent>
            </Card>

            <Card className="bg-gray-800 border-gray-700">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-200">Active Templates</CardTitle>
                <FileText className="h-4 w-4 text-blue-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">{stats.activeCertifications}</div>
                <p className="text-xs text-gray-400">Currently available</p>
              </CardContent>
            </Card>

            <Card className="bg-gray-800 border-gray-700">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-200">Total Recipients</CardTitle>
                <Users className="h-4 w-4 text-purple-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">{stats.totalRecipients.toLocaleString()}</div>
                <p className="text-xs text-gray-400">Unique certificate holders</p>
              </CardContent>
            </Card>

            <Card className="bg-gray-800 border-gray-700">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-200">Monthly Growth</CardTitle>
                <TrendingUp className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">+{stats.monthlyGrowth}%</div>
                <p className="text-xs text-gray-400">From last month</p>
              </CardContent>
            </Card>
          </div>

          {/* Main Content Tabs */}
          <Tabs defaultValue="templates" className="space-y-6">
            <TabsList className="bg-gray-800 border-gray-700">
              <TabsTrigger value="templates" className="data-[state=active]:bg-gray-700 text-gray-200">
                <FileText className="h-4 w-4 mr-2" />
                Templates
              </TabsTrigger>
              <TabsTrigger value="analytics" className="data-[state=active]:bg-gray-700 text-gray-200">
                <BarChart3 className="h-4 w-4 mr-2" />
                Analytics
              </TabsTrigger>
              <TabsTrigger value="recipients" className="data-[state=active]:bg-gray-700 text-gray-200">
                <Users className="h-4 w-4 mr-2" />
                Recipients
              </TabsTrigger>
              <TabsTrigger value="settings" className="data-[state=active]:bg-gray-700 text-gray-200">
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </TabsTrigger>
            </TabsList>

            <TabsContent value="templates" className="space-y-6">
              <div className="grid gap-6">
                {templates.map((template) => (
                  <Card key={template.id} className="bg-gray-800 border-gray-700">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-white">{template.name}</CardTitle>
                          <CardDescription className="text-gray-400">{template.description}</CardDescription>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge className={`${getStatusColor(template.status)} text-white`}>
                            {template.status}
                          </Badge>
                          <Button variant="outline" size="sm" className="bg-gray-700 text-white border-gray-600" asChild>
                            <Link to={`/template-builder?edit=${template.id}`}>
                              Edit
                            </Link>
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-4">
                          <div className="text-sm text-gray-400">
                            <span className="text-white font-medium">{template.issued}</span> issued
                          </div>
                          <div className="text-sm text-gray-400">
                            Created {new Date(template.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" className="bg-gray-700 text-white border-gray-600">
                            <Shield className="h-4 w-4 mr-1" />
                            Verify
                          </Button>
                          <Button 
                            size="sm" 
                            className="bg-green-600 hover:bg-green-700"
                            onClick={() => handleIssueCertificate(template.id)}
                          >
                            Issue Certificate
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="analytics" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="bg-gray-800 border-gray-700">
                  <CardHeader>
                    <CardTitle className="text-white">Issuance Trends</CardTitle>
                    <CardDescription className="text-gray-400">Certificate issuance over time</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-64 flex items-center justify-center text-gray-400">
                      Chart placeholder - Integration with charting library needed
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gray-800 border-gray-700">
                  <CardHeader>
                    <CardTitle className="text-white">Template Performance</CardTitle>
                    <CardDescription className="text-gray-400">Most popular certification types</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {templates.map((template) => (
                        <div key={template.id} className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-200">{template.name}</span>
                            <span className="text-gray-400">{template.issued} issued</span>
                          </div>
                          <Progress value={(template.issued / 250) * 100} className="h-2" />
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="recipients" className="space-y-6">
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white">Recent Recipients</CardTitle>
                  <CardDescription className="text-gray-400">Latest certificate recipients</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <p className="text-gray-400 mb-4">Manage your certificate recipients</p>
                    <Button className="bg-green-600 hover:bg-green-700" asChild>
                      <Link to="/recipient-management">
                        <Users className="h-4 w-4 mr-2" />
                        Manage Recipients
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="settings" className="space-y-6">
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white">Organization Settings</CardTitle>
                  <CardDescription className="text-gray-400">Configure your certification platform</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8 text-gray-400">
                    Settings interface - To be implemented
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </motion.main>
      <Footer />
    </div>
  );
};

export default OrganizationDashboard;