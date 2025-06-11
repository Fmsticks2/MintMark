import React, { useState } from 'react';
import { Header } from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { 
  TrendingUp, 
  TrendingDown, 
  Users, 
  Award, 
  Calendar, 
  Download,
  BarChart3,
  PieChart,
  Activity,
  Globe,
  Building,
  Clock
} from 'lucide-react';

interface MetricCard {
  title: string;
  value: string;
  change: string;
  trend: 'up' | 'down' | 'neutral';
  icon: React.ComponentType<{ className?: string; size?: number }>;
}

interface ChartData {
  name: string;
  value: number;
  color?: string;
}

const Analytics = () => {
  const [timeRange, setTimeRange] = useState('30d');
  const [selectedMetric, setSelectedMetric] = useState('certificates');

  const handleExportReport = () => {
    const reportData = [
      ['Analytics Report - ' + new Date().toLocaleDateString()],
      [''],
      ['Key Metrics'],
      ['Total Certificates Issued', '2,847'],
      ['Active Recipients', '1,234'],
      ['Templates Created', '23'],
      ['Verification Rate', '98.5%'],
      [''],
      ['Certificate Types Distribution'],
      ['Professional Development', '45%'],
      ['Technical Skills', '30%'],
      ['Leadership Training', '15%'],
      ['Compliance Training', '10%'],
      [''],
      ['Top Organizations'],
      ['TechCorp Solutions', '342 certificates'],
      ['Innovation Labs', '298 certificates'],
      ['Digital Dynamics', '267 certificates'],
      ['Future Systems', '234 certificates'],
      ['Smart Industries', '198 certificates'],
      [''],
      ['Regional Distribution'],
      ['North America', '45% (1,281 certificates)'],
      ['Europe', '32% (911 certificates)'],
      ['Asia Pacific', '18% (512 certificates)'],
      ['Others', '5% (143 certificates)']
    ];
    
    const csvContent = reportData.map(row => Array.isArray(row) ? row.join(',') : row).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `analytics-report-${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const metrics: MetricCard[] = [
    {
      title: 'Total Certificates Issued',
      value: '2,847',
      change: '+12.5%',
      trend: 'up',
      icon: (props) => <Award {...props} />
    },
    {
      title: 'Active Recipients',
      value: '1,923',
      change: '+8.2%',
      trend: 'up',
      icon: (props) => <Users {...props} />
    },
    {
      title: 'Verification Rate',
      value: '94.7%',
      change: '+2.1%',
      trend: 'up',
      icon: (props) => <Activity {...props} />
    },
    {
      title: 'Avg. Issue Time',
      value: '2.3 min',
      change: '-15.3%',
      trend: 'up',
      icon: (props) => <Clock {...props} />
    }
  ];

  const certificatesByType: ChartData[] = [
    { name: 'Technical Skills', value: 1247, color: '#10b981' },
    { name: 'Professional Development', value: 892, color: '#3b82f6' },
    { name: 'Compliance Training', value: 456, color: '#f59e0b' },
    { name: 'Academic Achievement', value: 252, color: '#ef4444' }
  ];

  const monthlyIssuance = [
    { name: 'Jan', value: 245 },
    { name: 'Feb', value: 312 },
    { name: 'Mar', value: 398 },
    { name: 'Apr', value: 467 },
    { name: 'May', value: 523 },
    { name: 'Jun', value: 589 },
    { name: 'Jul', value: 634 },
    { name: 'Aug', value: 712 },
    { name: 'Sep', value: 798 },
    { name: 'Oct', value: 856 },
    { name: 'Nov', value: 923 },
    { name: 'Dec', value: 1047 }
  ];

  const topOrganizations = [
    { name: 'TechCorp Solutions', certificates: 342, growth: '+23%' },
    { name: 'Innovation Labs', certificates: 298, growth: '+18%' },
    { name: 'Digital Dynamics', certificates: 267, growth: '+15%' },
    { name: 'Future Systems', certificates: 234, growth: '+12%' },
    { name: 'Smart Industries', certificates: 198, growth: '+8%' }
  ];

  const geographicData = [
    { region: 'North America', percentage: 45, certificates: 1281 },
    { region: 'Europe', percentage: 32, certificates: 911 },
    { region: 'Asia Pacific', percentage: 18, certificates: 512 },
    { region: 'Others', percentage: 5, certificates: 143 }
  ];

  const getTrendIcon = (trend: string) => {
    if (trend === 'up') return <TrendingUp className="h-4 w-4 text-green-500" />;
    if (trend === 'down') return <TrendingDown className="h-4 w-4 text-red-500" />;
    return <Activity className="h-4 w-4 text-gray-500" />;
  };

  const getTrendColor = (trend: string) => {
    if (trend === 'up') return 'text-green-500';
    if (trend === 'down') return 'text-red-500';
    return 'text-gray-500';
  };

  return (
    <div className="min-h-screen bg-gray-900">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">Analytics Dashboard</h1>
              <p className="text-gray-400">Track certification metrics and performance insights</p>
            </div>
            <div className="flex gap-3">
              <Select value={timeRange} onValueChange={setTimeRange}>
                <SelectTrigger className="w-40 bg-gray-800 border-gray-700 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-700">
                  <SelectItem value="7d" className="text-white">Last 7 days</SelectItem>
                  <SelectItem value="30d" className="text-white">Last 30 days</SelectItem>
                  <SelectItem value="90d" className="text-white">Last 90 days</SelectItem>
                  <SelectItem value="1y" className="text-white">Last year</SelectItem>
                </SelectContent>
              </Select>
              <Button 
                variant="outline" 
                className="bg-gray-800 text-white border-gray-700"
                onClick={handleExportReport}
              >
                <Download className="h-4 w-4 mr-2" />
                Export Report
              </Button>
            </div>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {metrics.map((metric, index) => {
              const Icon = metric.icon;
              return (
                <Card key={index} className="bg-gray-800 border-gray-700">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-400 text-sm font-medium">{metric.title}</p>
                        <p className="text-2xl font-bold text-white mt-1">{metric.value}</p>
                        <div className="flex items-center mt-2">
                          {getTrendIcon(metric.trend)}
                          <span className={`text-sm ml-1 ${getTrendColor(metric.trend)}`}>
                            {metric.change}
                          </span>
                          <span className="text-gray-500 text-sm ml-1">vs last period</span>
                        </div>
                      </div>
                      <Icon className="h-8 w-8 text-green-500" />
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList className="bg-gray-800 border-gray-700">
              <TabsTrigger value="overview" className="data-[state=active]:bg-gray-700 text-gray-200">
                <BarChart3 className="h-4 w-4 mr-2" />
                Overview
              </TabsTrigger>
              <TabsTrigger value="certificates" className="data-[state=active]:bg-gray-700 text-gray-200">
                <Award className="h-4 w-4 mr-2" />
                Certificates
              </TabsTrigger>
              <TabsTrigger value="organizations" className="data-[state=active]:bg-gray-700 text-gray-200">
                <Building className="h-4 w-4 mr-2" />
                Organizations
              </TabsTrigger>
              <TabsTrigger value="geographic" className="data-[state=active]:bg-gray-700 text-gray-200">
                <Globe className="h-4 w-4 mr-2" />
                Geographic
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Monthly Issuance Chart */}
                <Card className="bg-gray-800 border-gray-700">
                  <CardHeader>
                    <CardTitle className="text-white">Monthly Certificate Issuance</CardTitle>
                    <CardDescription className="text-gray-400">
                      Certificates issued over the past 12 months
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-80 flex items-end justify-between space-x-2">
                      {monthlyIssuance.map((month, index) => {
                        const maxValue = Math.max(...monthlyIssuance.map(m => m.value));
                        const height = (month.value / maxValue) * 100;
                        return (
                          <div key={index} className="flex flex-col items-center flex-1">
                            <div className="text-xs text-gray-400 mb-2">{month.value}</div>
                            <div 
                              className="bg-green-500 w-full rounded-t transition-all duration-300 hover:bg-green-400"
                              style={{ height: `${height}%` }}
                            ></div>
                            <div className="text-xs text-gray-400 mt-2">{month.name}</div>
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>

                {/* Certificate Types Distribution */}
                <Card className="bg-gray-800 border-gray-700">
                  <CardHeader>
                    <CardTitle className="text-white">Certificate Types Distribution</CardTitle>
                    <CardDescription className="text-gray-400">
                      Breakdown by certificate category
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {certificatesByType.map((type, index) => {
                        const total = certificatesByType.reduce((sum, t) => sum + t.value, 0);
                        const percentage = ((type.value / total) * 100).toFixed(1);
                        return (
                          <div key={index} className="space-y-2">
                            <div className="flex justify-between items-center">
                              <span className="text-gray-300 text-sm">{type.name}</span>
                              <span className="text-gray-400 text-sm">{type.value} ({percentage}%)</span>
                            </div>
                            <div className="w-full bg-gray-700 rounded-full h-2">
                              <div 
                                className="h-2 rounded-full transition-all duration-300"
                                style={{ 
                                  width: `${percentage}%`, 
                                  backgroundColor: type.color 
                                }}
                              ></div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="certificates" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="bg-gray-800 border-gray-700">
                  <CardHeader>
                    <CardTitle className="text-white">Certificate Status Overview</CardTitle>
                    <CardDescription className="text-gray-400">
                      Current status of all certificates
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center p-3 bg-gray-700 rounded">
                        <span className="text-gray-300">Active Certificates</span>
                        <span className="text-green-400 font-semibold">2,394</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-gray-700 rounded">
                        <span className="text-gray-300">Pending Verification</span>
                        <span className="text-yellow-400 font-semibold">156</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-gray-700 rounded">
                        <span className="text-gray-300">Expired</span>
                        <span className="text-red-400 font-semibold">89</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-gray-700 rounded">
                        <span className="text-gray-300">Revoked</span>
                        <span className="text-gray-400 font-semibold">12</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gray-800 border-gray-700">
                  <CardHeader>
                    <CardTitle className="text-white">Verification Trends</CardTitle>
                    <CardDescription className="text-gray-400">
                      Certificate verification activity
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-300">Daily Verifications</span>
                        <span className="text-white font-semibold">1,247</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-300">Success Rate</span>
                        <span className="text-green-400 font-semibold">98.7%</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-300">Avg. Response Time</span>
                        <span className="text-blue-400 font-semibold">0.8s</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-300">Failed Verifications</span>
                        <span className="text-red-400 font-semibold">16</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="organizations" className="space-y-6">
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white">Top Performing Organizations</CardTitle>
                  <CardDescription className="text-gray-400">
                    Organizations with highest certificate issuance
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {topOrganizations.map((org, index) => (
                      <div key={index} className="flex items-center justify-between p-4 bg-gray-700 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                            {index + 1}
                          </div>
                          <div>
                            <div className="text-white font-medium">{org.name}</div>
                            <div className="text-gray-400 text-sm">{org.certificates} certificates</div>
                          </div>
                        </div>
                        <div className="text-green-400 font-semibold">{org.growth}</div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="geographic" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="bg-gray-800 border-gray-700">
                  <CardHeader>
                    <CardTitle className="text-white">Geographic Distribution</CardTitle>
                    <CardDescription className="text-gray-400">
                      Certificate distribution by region
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {geographicData.map((region, index) => (
                        <div key={index} className="space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="text-gray-300">{region.region}</span>
                            <span className="text-gray-400">{region.certificates} ({region.percentage}%)</span>
                          </div>
                          <div className="w-full bg-gray-700 rounded-full h-2">
                            <div 
                              className="bg-green-500 h-2 rounded-full transition-all duration-300"
                              style={{ width: `${region.percentage}%` }}
                            ></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gray-800 border-gray-700">
                  <CardHeader>
                    <CardTitle className="text-white">Regional Growth</CardTitle>
                    <CardDescription className="text-gray-400">
                      Month-over-month growth by region
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center p-3 bg-gray-700 rounded">
                        <span className="text-gray-300">North America</span>
                        <span className="text-green-400 font-semibold">+18.5%</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-gray-700 rounded">
                        <span className="text-gray-300">Europe</span>
                        <span className="text-green-400 font-semibold">+15.2%</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-gray-700 rounded">
                        <span className="text-gray-300">Asia Pacific</span>
                        <span className="text-green-400 font-semibold">+22.8%</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-gray-700 rounded">
                        <span className="text-gray-300">Others</span>
                        <span className="text-yellow-400 font-semibold">+8.1%</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Analytics;