import React, { useState, useRef } from 'react';
import { Header } from '@/components/Header';
import Footer from '@/components/Footer';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  Search, 
  Filter, 
  Download, 
  Upload, 
  UserPlus, 
  Mail, 
  Eye, 
  MoreHorizontal,
  Calendar,
  Award,
  CheckCircle,
  XCircle,
  Clock,
  Users,
  FileSpreadsheet,
  Send
} from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface Recipient {
  id: string;
  name: string;
  email: string;
  organization?: string;
  certificateType: string;
  status: 'pending' | 'issued' | 'expired' | 'revoked';
  issueDate?: string;
  expirationDate?: string;
  blockchainTxHash?: string;
  lastActivity: string;
}

interface CertificateTemplate {
  id: string;
  name: string;
  category: string;
}

const RecipientManagement = () => {
  const [recipients, setRecipients] = useState<Recipient[]>([
    {
      id: '1',
      name: 'John Smith',
      email: 'john.smith@example.com',
      organization: 'Tech Corp',
      certificateType: 'Web Development Certification',
      status: 'issued',
      issueDate: '2024-01-15',
      expirationDate: '2025-01-15',
      blockchainTxHash: '0x1234...abcd',
      lastActivity: '2024-01-15'
    },
    {
      id: '2',
      name: 'Sarah Johnson',
      email: 'sarah.j@company.com',
      organization: 'Innovation Labs',
      certificateType: 'Blockchain Development',
      status: 'pending',
      lastActivity: '2024-01-14'
    },
    {
      id: '3',
      name: 'Mike Chen',
      email: 'mike.chen@startup.io',
      certificateType: 'Data Science Certification',
      status: 'expired',
      issueDate: '2023-01-10',
      expirationDate: '2024-01-10',
      blockchainTxHash: '0x5678...efgh',
      lastActivity: '2024-01-10'
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedRecipients, setSelectedRecipients] = useState<string[]>([]);

  const downloadCertificate = (recipient: Recipient) => {
    // Generate certificate content
    const certificateContent = `
CERTIFICATE OF COMPLETION

This is to certify that

${recipient.name}

has successfully completed the requirements for

${recipient.certificateType}

Issued on: ${recipient.issueDate || 'N/A'}
Expiration: ${recipient.expirationDate || 'N/A'}
Verification Code: ${recipient.blockchainTxHash || 'PENDING'}

Organization: ${recipient.organization || 'N/A'}
Recipient Email: ${recipient.email}

This certificate is blockchain-verified and tamper-proof.
    `;
    
    const blob = new Blob([certificateContent], { type: 'text/plain;charset=utf-8;' });
    const link = document.createElement('a');
    
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `certificate-${recipient.name.replace(/\s+/g, '-').toLowerCase()}.txt`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isBulkIssueOpen, setIsBulkIssueOpen] = useState(false);

  const templates: CertificateTemplate[] = [
    { id: '1', name: 'Web Development Certification', category: 'Technical Skills' },
    { id: '2', name: 'Blockchain Development', category: 'Technical Skills' },
    { id: '3', name: 'Data Science Certification', category: 'Technical Skills' },
    { id: '4', name: 'Project Management', category: 'Professional Development' }
  ];

  const [newRecipient, setNewRecipient] = useState({
    name: '',
    email: '',
    organization: '',
    certificateType: ''
  });

  const filteredRecipients = recipients.filter(recipient => {
    const matchesSearch = recipient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         recipient.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         recipient.certificateType.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || recipient.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { color: 'bg-yellow-600', icon: Clock, text: 'Pending' },
      issued: { color: 'bg-green-600', icon: CheckCircle, text: 'Issued' },
      expired: { color: 'bg-red-600', icon: XCircle, text: 'Expired' },
      revoked: { color: 'bg-gray-600', icon: XCircle, text: 'Revoked' }
    };
    
    const config = statusConfig[status as keyof typeof statusConfig];
    const Icon = config.icon;
    
    return (
      <Badge className={`${config.color} text-white`}>
        <Icon className="h-3 w-3 mr-1" />
        {config.text}
      </Badge>
    );
  };

  const handleAddRecipient = () => {
    const recipient: Recipient = {
      id: Date.now().toString(),
      ...newRecipient,
      status: 'pending',
      lastActivity: new Date().toISOString().split('T')[0]
    };
    setRecipients(prev => [...prev, recipient]);
    setNewRecipient({ name: '', email: '', organization: '', certificateType: '' });
    setIsAddDialogOpen(false);
  };

  const handleBulkIssue = () => {
    const pendingRecipients = recipients.filter(r => 
      selectedRecipients.includes(r.id) && r.status === 'pending'
    );
    
    setRecipients(prev => prev.map(recipient => {
      if (selectedRecipients.includes(recipient.id) && recipient.status === 'pending') {
        return {
          ...recipient,
          status: 'issued' as const,
          issueDate: new Date().toISOString().split('T')[0],
          expirationDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          blockchainTxHash: `0x${Math.random().toString(16).substr(2, 8)}...${Math.random().toString(16).substr(2, 4)}`,
          lastActivity: new Date().toISOString().split('T')[0]
        };
      }
      return recipient;
    }));
    
    setSelectedRecipients([]);
    setIsBulkIssueOpen(false);
  };

  const stats = {
    total: recipients.length,
    issued: recipients.filter(r => r.status === 'issued').length,
    pending: recipients.filter(r => r.status === 'pending').length,
    expired: recipients.filter(r => r.status === 'expired').length
  };

  return (
    <div className="min-h-screen bg-gray-900">
      <Header />
      <motion.main 
        className="container mx-auto px-4 py-8 pt-24"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">Recipient Management</h1>
              <p className="text-gray-400">Manage certificate recipients and track issuance</p>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" className="bg-gray-800 text-white border-gray-700">
                <Upload className="h-4 w-4 mr-2" />
                Import CSV
              </Button>
              <Button variant="outline" className="bg-gray-800 text-white border-gray-700">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
              <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-green-600 hover:bg-green-700">
                    <UserPlus className="h-4 w-4 mr-2" />
                    Add Recipient
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-gray-800 border-gray-700 text-white">
                  <DialogHeader>
                    <DialogTitle>Add New Recipient</DialogTitle>
                    <DialogDescription className="text-gray-400">
                      Add a new recipient for certificate issuance
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        value={newRecipient.name}
                        onChange={(e) => setNewRecipient(prev => ({ ...prev, name: e.target.value }))}
                        className="bg-gray-700 border-gray-600 text-white"
                        placeholder="Enter full name"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input
                        id="email"
                        type="email"
                        value={newRecipient.email}
                        onChange={(e) => setNewRecipient(prev => ({ ...prev, email: e.target.value }))}
                        className="bg-gray-700 border-gray-600 text-white"
                        placeholder="Enter email address"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="organization">Organization (Optional)</Label>
                      <Input
                        id="organization"
                        value={newRecipient.organization}
                        onChange={(e) => setNewRecipient(prev => ({ ...prev, organization: e.target.value }))}
                        className="bg-gray-700 border-gray-600 text-white"
                        placeholder="Enter organization"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="certificateType">Certificate Template</Label>
                      <Select value={newRecipient.certificateType} onValueChange={(value) => setNewRecipient(prev => ({ ...prev, certificateType: value }))}>
                        <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                          <SelectValue placeholder="Select certificate template" />
                        </SelectTrigger>
                        <SelectContent className="bg-gray-700 border-gray-600">
                          {templates.map((template) => (
                            <SelectItem key={template.id} value={template.name} className="text-white">
                              {template.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsAddDialogOpen(false)} className="bg-gray-700 text-white border-gray-600">
                      Cancel
                    </Button>
                    <Button onClick={handleAddRecipient} className="bg-green-600 hover:bg-green-700">
                      Add Recipient
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card className="bg-gray-800 border-gray-700">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">Total Recipients</p>
                    <p className="text-2xl font-bold text-white">{stats.total}</p>
                  </div>
                  <Users className="h-8 w-8 text-blue-500" />
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-gray-800 border-gray-700">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">Certificates Issued</p>
                    <p className="text-2xl font-bold text-white">{stats.issued}</p>
                  </div>
                  <Award className="h-8 w-8 text-green-500" />
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-gray-800 border-gray-700">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">Pending Issuance</p>
                    <p className="text-2xl font-bold text-white">{stats.pending}</p>
                  </div>
                  <Clock className="h-8 w-8 text-yellow-500" />
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-gray-800 border-gray-700">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">Expired</p>
                    <p className="text-2xl font-bold text-white">{stats.expired}</p>
                  </div>
                  <XCircle className="h-8 w-8 text-red-500" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Filters and Actions */}
          <Card className="bg-gray-800 border-gray-700 mb-6">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                <div className="flex gap-4 items-center w-full md:w-auto">
                  <div className="relative flex-1 md:w-80">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      placeholder="Search recipients..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 bg-gray-700 border-gray-600 text-white"
                    />
                  </div>
                  
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-40 bg-gray-700 border-gray-600 text-white">
                      <Filter className="h-4 w-4 mr-2" />
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-700 border-gray-600">
                      <SelectItem value="all" className="text-white">All Status</SelectItem>
                      <SelectItem value="pending" className="text-white">Pending</SelectItem>
                      <SelectItem value="issued" className="text-white">Issued</SelectItem>
                      <SelectItem value="expired" className="text-white">Expired</SelectItem>
                      <SelectItem value="revoked" className="text-white">Revoked</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                {selectedRecipients.length > 0 && (
                  <div className="flex gap-2">
                    <Dialog open={isBulkIssueOpen} onOpenChange={setIsBulkIssueOpen}>
                      <DialogTrigger asChild>
                        <Button className="bg-green-600 hover:bg-green-700">
                          <Send className="h-4 w-4 mr-2" />
                          Issue Certificates ({selectedRecipients.length})
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="bg-gray-800 border-gray-700 text-white">
                        <DialogHeader>
                          <DialogTitle>Bulk Issue Certificates</DialogTitle>
                          <DialogDescription className="text-gray-400">
                            Issue certificates to {selectedRecipients.length} selected recipients?
                          </DialogDescription>
                        </DialogHeader>
                        <DialogFooter>
                          <Button variant="outline" onClick={() => setIsBulkIssueOpen(false)} className="bg-gray-700 text-white border-gray-600">
                            Cancel
                          </Button>
                          <Button onClick={handleBulkIssue} className="bg-green-600 hover:bg-green-700">
                            Issue Certificates
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                    
                    <Button variant="outline" className="bg-gray-700 text-white border-gray-600">
                      <Mail className="h-4 w-4 mr-2" />
                      Send Reminder
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Recipients Table */}
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Recipients</CardTitle>
              <CardDescription className="text-gray-400">
                Manage and track certificate recipients
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow className="border-gray-700">
                    <TableHead className="text-gray-300">
                      <input
                        type="checkbox"
                        checked={selectedRecipients.length === filteredRecipients.length && filteredRecipients.length > 0}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedRecipients(filteredRecipients.map(r => r.id));
                          } else {
                            setSelectedRecipients([]);
                          }
                        }}
                        className="rounded"
                      />
                    </TableHead>
                    <TableHead className="text-gray-300">Recipient</TableHead>
                    <TableHead className="text-gray-300">Certificate</TableHead>
                    <TableHead className="text-gray-300">Status</TableHead>
                    <TableHead className="text-gray-300">Issue Date</TableHead>
                    <TableHead className="text-gray-300">Expiration</TableHead>
                    <TableHead className="text-gray-300">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRecipients.map((recipient) => (
                    <TableRow key={recipient.id} className="border-gray-700">
                      <TableCell>
                        <input
                          type="checkbox"
                          checked={selectedRecipients.includes(recipient.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedRecipients(prev => [...prev, recipient.id]);
                            } else {
                              setSelectedRecipients(prev => prev.filter(id => id !== recipient.id));
                            }
                          }}
                          className="rounded"
                        />
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium text-white">{recipient.name}</div>
                          <div className="text-sm text-gray-400">{recipient.email}</div>
                          {recipient.organization && (
                            <div className="text-xs text-gray-500">{recipient.organization}</div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-white">{recipient.certificateType}</div>
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(recipient.status)}
                      </TableCell>
                      <TableCell>
                        <div className="text-gray-300">
                          {recipient.issueDate || '-'}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-gray-300">
                          {recipient.expirationDate || '-'}
                        </div>
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0 text-gray-400 hover:text-white">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="bg-gray-700 border-gray-600">
                            <DropdownMenuLabel className="text-gray-200">Actions</DropdownMenuLabel>
                            <DropdownMenuItem className="text-gray-200 hover:bg-gray-600">
                              <Eye className="h-4 w-4 mr-2" />
                              View Certificate
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-gray-200 hover:bg-gray-600">
                              <Mail className="h-4 w-4 mr-2" />
                              Send Email
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              className="text-gray-200 hover:bg-gray-600"
                              onClick={() => downloadCertificate(recipient)}
                            >
                              <Download className="h-4 w-4 mr-2" />
                              Download PDF
                            </DropdownMenuItem>
                            <DropdownMenuSeparator className="bg-gray-600" />
                            {recipient.status === 'pending' && (
                              <DropdownMenuItem className="text-green-400 hover:bg-gray-600">
                                <CheckCircle className="h-4 w-4 mr-2" />
                                Issue Certificate
                              </DropdownMenuItem>
                            )}
                            {recipient.status === 'issued' && (
                              <DropdownMenuItem className="text-red-400 hover:bg-gray-600">
                                <XCircle className="h-4 w-4 mr-2" />
                                Revoke Certificate
                              </DropdownMenuItem>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              
              {filteredRecipients.length === 0 && (
                <div className="text-center py-8 text-gray-400">
                  No recipients found matching your criteria.
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </motion.main>
      <Footer />
    </div>
  );
};

export default RecipientManagement;