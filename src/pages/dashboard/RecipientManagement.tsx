import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Header } from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  Plus, 
  Search, 
  Filter, 
  Download, 
  Mail, 
  User, 
  Calendar, 
  Award, 
  Eye,
  Edit,
  Trash2,
  Upload,
  FileText,
  MoreHorizontal
} from 'lucide-react';

interface Recipient {
  id: string;
  name: string;
  email: string;
  organization?: string;
  certificatesIssued: number;
  lastIssued: string;
  status: 'active' | 'pending' | 'inactive';
  joinedDate: string;
}

interface Certificate {
  id: string;
  recipientId: string;
  templateName: string;
  issuedDate: string;
  status: 'issued' | 'pending' | 'revoked';
  verificationCode: string;
}

const RecipientManagement: React.FC = () => {
  const [activeTab, setActiveTab] = useState('recipients');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [selectedRecipient, setSelectedRecipient] = useState<Recipient | null>(null);
  
  // Form states
  const [newRecipient, setNewRecipient] = useState({
    name: '',
    email: '',
    organization: ''
  });

  // Mock data
  const [recipients, setRecipients] = useState<Recipient[]>([
    {
      id: '1',
      name: 'John Doe',
      email: 'john.doe@example.com',
      organization: 'Tech Corp',
      certificatesIssued: 3,
      lastIssued: '2024-01-15',
      status: 'active',
      joinedDate: '2023-06-15'
    },
    {
      id: '2',
      name: 'Jane Smith',
      email: 'jane.smith@example.com',
      organization: 'Design Studio',
      certificatesIssued: 1,
      lastIssued: '2024-01-10',
      status: 'active',
      joinedDate: '2023-08-20'
    },
    {
      id: '3',
      name: 'Mike Johnson',
      email: 'mike.johnson@example.com',
      certificatesIssued: 0,
      lastIssued: 'Never',
      status: 'pending',
      joinedDate: '2024-01-01'
    }
  ]);

  const [certificates, setCertificates] = useState<Certificate[]>([
    {
      id: 'cert-1',
      recipientId: '1',
      templateName: 'Web Development Certificate',
      issuedDate: '2024-01-15',
      status: 'issued',
      verificationCode: 'WDC-2024-001'
    },
    {
      id: 'cert-2',
      recipientId: '1',
      templateName: 'React Mastery Certificate',
      issuedDate: '2024-01-10',
      status: 'issued',
      verificationCode: 'RMC-2024-002'
    },
    {
      id: 'cert-3',
      recipientId: '2',
      templateName: 'UI/UX Design Certificate',
      issuedDate: '2024-01-10',
      status: 'issued',
      verificationCode: 'UXC-2024-003'
    }
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
      case 'issued':
        return 'bg-green-600';
      case 'pending':
        return 'bg-yellow-600';
      case 'inactive':
      case 'revoked':
        return 'bg-red-600';
      default:
        return 'bg-gray-600';
    }
  };

  const filteredRecipients = recipients.filter(recipient => {
    const matchesSearch = recipient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         recipient.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || recipient.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const addRecipient = () => {
    if (newRecipient.name && newRecipient.email) {
      const recipient: Recipient = {
        id: Date.now().toString(),
        name: newRecipient.name,
        email: newRecipient.email,
        organization: newRecipient.organization,
        certificatesIssued: 0,
        lastIssued: 'Never',
        status: 'pending',
        joinedDate: new Date().toISOString().split('T')[0]
      };
      setRecipients([...recipients, recipient]);
      setNewRecipient({ name: '', email: '', organization: '' });
      setIsAddDialogOpen(false);
    }
  };

  const bulkImport = () => {
    // Implementation for bulk import
    console.log('Bulk import functionality');
  };

  const exportData = () => {
    const csvData = [
      ['Name', 'Email', 'Organization', 'Certificates Issued', 'Last Issued', 'Status', 'Joined Date'],
      ...recipients.map(recipient => [
        recipient.name,
        recipient.email,
        recipient.organization,
        recipient.certificatesIssued,
        recipient.lastIssued,
        recipient.status,
        recipient.joinedDate
      ])
    ];
    
    const csvContent = csvData.map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `recipients-data-${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      <Header />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="container mx-auto px-4 py-8"
      >
        <div className="mb-8">
          <motion.h1 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="text-4xl font-bold text-white mb-2"
          >
            Recipient Management
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="text-gray-400 text-lg"
          >
            Manage certificate recipients and track issuance history
          </motion.p>
        </div>

        {/* Action Bar */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6"
        >
          <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              className="relative"
            >
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search recipients..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-gray-700 border-gray-600 text-white w-full sm:w-64 transition-all duration-200 focus:ring-2 focus:ring-blue-500"
              />
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6, duration: 0.5 }}
            >
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="bg-gray-700 border-gray-600 text-white w-full sm:w-40 transition-all duration-200 hover:bg-gray-600">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-gray-700 border-gray-600">
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </motion.div>
          </div>
          
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.7, duration: 0.5 }}
            className="flex flex-col sm:flex-row gap-2 w-full lg:w-auto"
          >
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button 
                onClick={bulkImport}
                variant="outline" 
                className="w-full sm:w-auto bg-gray-700 border-gray-600 text-white hover:bg-gray-600 transition-all duration-200"
              >
                <Upload className="h-4 w-4 mr-2" />
                Import
              </Button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button 
                onClick={exportData}
                variant="outline" 
                className="w-full sm:w-auto bg-gray-700 border-gray-600 text-white hover:bg-gray-600 transition-all duration-200"
              >
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </motion.div>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button className="w-full sm:w-auto bg-green-600 hover:bg-green-700 transition-all duration-200 shadow-lg hover:shadow-green-500/25">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Recipient
                  </Button>
                </motion.div>
              </DialogTrigger>
              <DialogContent className="bg-gray-800 border-gray-700 text-white">
                <DialogHeader>
                  <DialogTitle>Add New Recipient</DialogTitle>
                  <DialogDescription className="text-gray-400">
                    Add a new recipient to your organization
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="name" className="text-gray-300">Full Name</Label>
                    <Input
                      id="name"
                      value={newRecipient.name}
                      onChange={(e) => setNewRecipient({...newRecipient, name: e.target.value})}
                      placeholder="Enter full name"
                      className="bg-gray-700 border-gray-600 text-white"
                    />
                  </div>
                  <div>
                    <Label htmlFor="email" className="text-gray-300">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      value={newRecipient.email}
                      onChange={(e) => setNewRecipient({...newRecipient, email: e.target.value})}
                      placeholder="Enter email address"
                      className="bg-gray-700 border-gray-600 text-white"
                    />
                  </div>
                  <div>
                    <Label htmlFor="organization" className="text-gray-300">Organization (Optional)</Label>
                    <Input
                      id="organization"
                      value={newRecipient.organization}
                      onChange={(e) => setNewRecipient({...newRecipient, organization: e.target.value})}
                      placeholder="Enter organization name"
                      className="bg-gray-700 border-gray-600 text-white"
                    />
                  </div>
                  <div className="flex justify-end gap-2 pt-4">
                    <Button 
                      variant="outline" 
                      onClick={() => setIsAddDialogOpen(false)}
                      className="bg-gray-700 border-gray-600 text-white hover:bg-gray-600"
                    >
                      Cancel
                    </Button>
                    <Button onClick={addRecipient} className="bg-green-600 hover:bg-green-700">
                      Add Recipient
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </motion.div>
        </motion.div>

        {/* Main Content */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
        >
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6, duration: 0.5 }}
            >
              <TabsList className="grid w-full grid-cols-2 bg-gray-800 border-gray-700 p-1">
                <TabsTrigger 
                  value="recipients" 
                  className="data-[state=active]:bg-gray-700 text-white transition-all duration-200 data-[state=active]:shadow-lg"
                >
                  <User className="h-4 w-4 mr-2" />
                  <span className="hidden sm:inline">Recipients</span>
                  <span className="sm:hidden">Users</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="certificates" 
                  className="data-[state=active]:bg-gray-700 text-white transition-all duration-200 data-[state=active]:shadow-lg"
                >
                  <Award className="h-4 w-4 mr-2" />
                  <span className="hidden sm:inline">Certificates</span>
                  <span className="sm:hidden">Certs</span>
                </TabsTrigger>
              </TabsList>
            </motion.div>
            
            <TabsContent value="recipients" className="mt-6">
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white">Recipients ({filteredRecipients.length})</CardTitle>
                  <CardDescription className="text-gray-400">
                    Manage your certificate recipients
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow className="border-gray-700">
                          <TableHead className="text-gray-300">Name</TableHead>
                          <TableHead className="text-gray-300">Email</TableHead>
                          <TableHead className="text-gray-300 hidden sm:table-cell">Organization</TableHead>
                          <TableHead className="text-gray-300 hidden md:table-cell">Certificates</TableHead>
                          <TableHead className="text-gray-300 hidden lg:table-cell">Last Issued</TableHead>
                          <TableHead className="text-gray-300">Status</TableHead>
                          <TableHead className="text-gray-300">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredRecipients.map((recipient, index) => (
                          <motion.tr
                            key={recipient.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1, duration: 0.3 }}
                            className="border-gray-700 hover:bg-gray-700/50"
                          >
                            <TableCell className="text-white font-medium">{recipient.name}</TableCell>
                            <TableCell className="text-gray-300">{recipient.email}</TableCell>
                            <TableCell className="text-gray-300 hidden sm:table-cell">
                              {recipient.organization || 'N/A'}
                            </TableCell>
                            <TableCell className="text-gray-300 hidden md:table-cell">
                              {recipient.certificatesIssued}
                            </TableCell>
                            <TableCell className="text-gray-300 hidden lg:table-cell">
                              {recipient.lastIssued}
                            </TableCell>
                            <TableCell>
                              <Badge className={`${getStatusColor(recipient.status)} text-white`}>
                                {recipient.status}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <div className="flex gap-1">
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  className="text-gray-400 hover:text-white hover:bg-gray-700"
                                  onClick={() => setSelectedRecipient(recipient)}
                                >
                                  <Eye className="h-4 w-4" />
                                </Button>
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  className="text-gray-400 hover:text-white hover:bg-gray-700"
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  className="text-gray-400 hover:text-red-400 hover:bg-gray-700"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </motion.tr>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="certificates" className="mt-6">
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white">Issued Certificates ({certificates.length})</CardTitle>
                  <CardDescription className="text-gray-400">
                    Track all issued certificates
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow className="border-gray-700">
                          <TableHead className="text-gray-300">Certificate</TableHead>
                          <TableHead className="text-gray-300">Recipient</TableHead>
                          <TableHead className="text-gray-300 hidden sm:table-cell">Issued Date</TableHead>
                          <TableHead className="text-gray-300 hidden md:table-cell">Verification Code</TableHead>
                          <TableHead className="text-gray-300">Status</TableHead>
                          <TableHead className="text-gray-300">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {certificates.map((certificate, index) => {
                          const recipient = recipients.find(r => r.id === certificate.recipientId);
                          return (
                            <motion.tr
                              key={certificate.id}
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: index * 0.1, duration: 0.3 }}
                              className="border-gray-700 hover:bg-gray-700/50"
                            >
                              <TableCell className="text-white font-medium">
                                {certificate.templateName}
                              </TableCell>
                              <TableCell className="text-gray-300">
                                {recipient?.name || 'Unknown'}
                              </TableCell>
                              <TableCell className="text-gray-300 hidden sm:table-cell">
                                {certificate.issuedDate}
                              </TableCell>
                              <TableCell className="text-gray-300 hidden md:table-cell font-mono text-sm">
                                {certificate.verificationCode}
                              </TableCell>
                              <TableCell>
                                <Badge className={`${getStatusColor(certificate.status)} text-white`}>
                                  {certificate.status}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                <div className="flex gap-1">
                                  <Button 
                                    variant="ghost" 
                                    size="sm" 
                                    className="text-gray-400 hover:text-white hover:bg-gray-700"
                                  >
                                    <Eye className="h-4 w-4" />
                                  </Button>
                                  <Button 
                                    variant="ghost" 
                                    size="sm" 
                                    className="text-gray-400 hover:text-white hover:bg-gray-700"
                                  >
                                    <Download className="h-4 w-4" />
                                  </Button>
                                  <Button 
                                    variant="ghost" 
                                    size="sm" 
                                    className="text-gray-400 hover:text-white hover:bg-gray-700"
                                  >
                                    <Mail className="h-4 w-4" />
                                  </Button>
                                </div>
                              </TableCell>
                            </motion.tr>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>
      </motion.div>
      
      <Footer />
    </div>
  );
};

export default RecipientManagement;