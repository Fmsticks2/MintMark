import React, { useState } from 'react';
import { Header } from '@/components/Header';
import Footer from '@/components/Footer';
import { useToast, toast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { 
  Save, 
  Eye, 
  Upload, 
  Palette, 
  Type, 
  Image as ImageIcon,
  Settings,
  Award,
  Calendar,
  User,
  Building,
  FileText
} from 'lucide-react';

interface TemplateConfig {
  name: string;
  description: string;
  category: string;
  backgroundColor: string;
  textColor: string;
  logoUrl: string;
  includeQR: boolean;
  includeDate: boolean;
  includeSignature: boolean;
  expirationEnabled: boolean;
  expirationMonths: number;
  customFields: CustomField[];
}

interface CustomField {
  id: string;
  label: string;
  type: 'text' | 'date' | 'number' | 'select';
  required: boolean;
  options?: string[];
}

const TemplateBuilder = () => {
  const [config, setConfig] = useState<TemplateConfig>({
    name: '',
    description: '',
    category: '',
    backgroundColor: '#1f2937',
    textColor: '#ffffff',
    logoUrl: '',
    includeQR: true,
    includeDate: true,
    includeSignature: true,
    expirationEnabled: false,
    expirationMonths: 12,
    customFields: []
  });

  const [activeTab, setActiveTab] = useState('basic');
  const [previewMode, setPreviewMode] = useState(false);

  const categories = [
    'Professional Development',
    'Technical Skills',
    'Compliance Training',
    'Academic Achievement',
    'Event Attendance',
    'Custom'
  ];

  const addCustomField = () => {
    const newField: CustomField = {
      id: Date.now().toString(),
      label: 'New Field',
      type: 'text',
      required: false
    };
    setConfig(prev => ({
      ...prev,
      customFields: [...prev.customFields, newField]
    }));
  };

  const updateCustomField = (id: string, updates: Partial<CustomField>) => {
    setConfig(prev => ({
      ...prev,
      customFields: prev.customFields.map(field => 
        field.id === id ? { ...field, ...updates } : field
      )
    }));
  };

  const removeCustomField = (id: string) => {
    setConfig(prev => ({
      ...prev,
      customFields: prev.customFields.filter(field => field.id !== id)
    }));
  };

  const handleSave = async () => {
    try {
      // Validate template configuration
       if (!config.name.trim()) {
         toast({
           title: "Validation Error",
           description: "Template name is required.",
           variant: "destructive",
         });
         return;
       }

      if (!config.description.trim()) {
        toast({
          title: "Validation Error",
          description: "Template description is required.",
          variant: "destructive",
        });
        return;
      }

      // Here you would typically save to your backend/blockchain
      // For now, we'll simulate the save operation
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Template Saved",
        description: "Your certificate template has been saved successfully.",
      });
    } catch (error) {
      toast({
        title: "Save Failed",
        description: error instanceof Error ? error.message : "Failed to save template.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-900">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">Certificate Template Builder</h1>
              <p className="text-gray-400">Design and configure your certification templates</p>
            </div>
            <div className="flex gap-3">
              <Button 
                variant="outline" 
                className="bg-gray-800 text-white border-gray-700"
                onClick={() => setPreviewMode(!previewMode)}
              >
                <Eye className="h-4 w-4 mr-2" />
                {previewMode ? 'Edit' : 'Preview'}
              </Button>
              <Button className="bg-green-600 hover:bg-green-700" onClick={handleSave}>
                <Save className="h-4 w-4 mr-2" />
                Save Template
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Configuration Panel */}
            <div className="lg:col-span-2">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
                <TabsList className="bg-gray-800 border-gray-700">
                  <TabsTrigger value="basic" className="data-[state=active]:bg-gray-700 text-gray-200">
                    <FileText className="h-4 w-4 mr-2" />
                    Basic Info
                  </TabsTrigger>
                  <TabsTrigger value="design" className="data-[state=active]:bg-gray-700 text-gray-200">
                    <Palette className="h-4 w-4 mr-2" />
                    Design
                  </TabsTrigger>
                  <TabsTrigger value="fields" className="data-[state=active]:bg-gray-700 text-gray-200">
                    <Type className="h-4 w-4 mr-2" />
                    Custom Fields
                  </TabsTrigger>
                  <TabsTrigger value="settings" className="data-[state=active]:bg-gray-700 text-gray-200">
                    <Settings className="h-4 w-4 mr-2" />
                    Settings
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="basic" className="space-y-6">
                  <Card className="bg-gray-800 border-gray-700">
                    <CardHeader>
                      <CardTitle className="text-white">Basic Information</CardTitle>
                      <CardDescription className="text-gray-400">
                        Configure the basic details of your certificate template
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="name" className="text-gray-200">Template Name</Label>
                        <Input
                          id="name"
                          value={config.name}
                          onChange={(e) => setConfig(prev => ({ ...prev, name: e.target.value }))}
                          placeholder="e.g., Web Development Certification"
                          className="bg-gray-700 border-gray-600 text-white"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="description" className="text-gray-200">Description</Label>
                        <Textarea
                          id="description"
                          value={config.description}
                          onChange={(e) => setConfig(prev => ({ ...prev, description: e.target.value }))}
                          placeholder="Describe what this certificate represents..."
                          className="bg-gray-700 border-gray-600 text-white h-24"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="category" className="text-gray-200">Category</Label>
                        <Select value={config.category} onValueChange={(value) => setConfig(prev => ({ ...prev, category: value }))}>
                          <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                            <SelectValue placeholder="Select a category" />
                          </SelectTrigger>
                          <SelectContent className="bg-gray-700 border-gray-600">
                            {categories.map((category) => (
                              <SelectItem key={category} value={category} className="text-white">
                                {category}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="design" className="space-y-6">
                  <Card className="bg-gray-800 border-gray-700">
                    <CardHeader>
                      <CardTitle className="text-white">Visual Design</CardTitle>
                      <CardDescription className="text-gray-400">
                        Customize the appearance of your certificates
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="bgColor" className="text-gray-200">Background Color</Label>
                          <div className="flex gap-2">
                            <Input
                              id="bgColor"
                              type="color"
                              value={config.backgroundColor}
                              onChange={(e) => setConfig(prev => ({ ...prev, backgroundColor: e.target.value }))}
                              className="w-16 h-10 p-1 bg-gray-700 border-gray-600"
                            />
                            <Input
                              value={config.backgroundColor}
                              onChange={(e) => setConfig(prev => ({ ...prev, backgroundColor: e.target.value }))}
                              className="bg-gray-700 border-gray-600 text-white"
                            />
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="textColor" className="text-gray-200">Text Color</Label>
                          <div className="flex gap-2">
                            <Input
                              id="textColor"
                              type="color"
                              value={config.textColor}
                              onChange={(e) => setConfig(prev => ({ ...prev, textColor: e.target.value }))}
                              className="w-16 h-10 p-1 bg-gray-700 border-gray-600"
                            />
                            <Input
                              value={config.textColor}
                              onChange={(e) => setConfig(prev => ({ ...prev, textColor: e.target.value }))}
                              className="bg-gray-700 border-gray-600 text-white"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="logo" className="text-gray-200">Organization Logo URL</Label>
                        <div className="flex gap-2">
                          <Input
                            id="logo"
                            value={config.logoUrl}
                            onChange={(e) => setConfig(prev => ({ ...prev, logoUrl: e.target.value }))}
                            placeholder="https://example.com/logo.png"
                            className="bg-gray-700 border-gray-600 text-white"
                          />
                          <Button variant="outline" className="bg-gray-700 text-white border-gray-600">
                            <Upload className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="fields" className="space-y-6">
                  <Card className="bg-gray-800 border-gray-700">
                    <CardHeader>
                      <div className="flex justify-between items-center">
                        <div>
                          <CardTitle className="text-white">Custom Fields</CardTitle>
                          <CardDescription className="text-gray-400">
                            Add custom fields to collect additional information
                          </CardDescription>
                        </div>
                        <Button onClick={addCustomField} className="bg-green-600 hover:bg-green-700">
                          Add Field
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {config.customFields.length === 0 ? (
                        <div className="text-center py-8 text-gray-400">
                          No custom fields added yet. Click "Add Field" to get started.
                        </div>
                      ) : (
                        config.customFields.map((field) => (
                          <div key={field.id} className="p-4 bg-gray-700 rounded-lg space-y-3">
                            <div className="flex justify-between items-center">
                              <Input
                                value={field.label}
                                onChange={(e) => updateCustomField(field.id, { label: e.target.value })}
                                className="bg-gray-600 border-gray-500 text-white"
                                placeholder="Field label"
                              />
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => removeCustomField(field.id)}
                                className="bg-red-600 text-white border-red-500 hover:bg-red-700"
                              >
                                Remove
                              </Button>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                              <Select 
                                value={field.type} 
                                onValueChange={(value: 'text' | 'date' | 'number' | 'select') => updateCustomField(field.id, { type: value })}
                              >
                                <SelectTrigger className="bg-gray-600 border-gray-500 text-white">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="bg-gray-600 border-gray-500">
                                  <SelectItem value="text" className="text-white">Text</SelectItem>
                                  <SelectItem value="date" className="text-white">Date</SelectItem>
                                  <SelectItem value="number" className="text-white">Number</SelectItem>
                                  <SelectItem value="select" className="text-white">Select</SelectItem>
                                </SelectContent>
                              </Select>
                              <div className="flex items-center space-x-2">
                                <Switch
                                  checked={field.required}
                                  onCheckedChange={(checked) => updateCustomField(field.id, { required: checked })}
                                />
                                <Label className="text-gray-200">Required</Label>
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="settings" className="space-y-6">
                  <Card className="bg-gray-800 border-gray-700">
                    <CardHeader>
                      <CardTitle className="text-white">Certificate Settings</CardTitle>
                      <CardDescription className="text-gray-400">
                        Configure additional certificate features
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <Label className="text-gray-200">Include QR Code</Label>
                            <p className="text-sm text-gray-400">Add QR code for verification</p>
                          </div>
                          <Switch
                            checked={config.includeQR}
                            onCheckedChange={(checked) => setConfig(prev => ({ ...prev, includeQR: checked }))}
                          />
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <Label className="text-gray-200">Include Issue Date</Label>
                            <p className="text-sm text-gray-400">Show when certificate was issued</p>
                          </div>
                          <Switch
                            checked={config.includeDate}
                            onCheckedChange={(checked) => setConfig(prev => ({ ...prev, includeDate: checked }))}
                          />
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <Label className="text-gray-200">Include Digital Signature</Label>
                            <p className="text-sm text-gray-400">Add authorized signature</p>
                          </div>
                          <Switch
                            checked={config.includeSignature}
                            onCheckedChange={(checked) => setConfig(prev => ({ ...prev, includeSignature: checked }))}
                          />
                        </div>

                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                              <Label className="text-gray-200">Certificate Expiration</Label>
                              <p className="text-sm text-gray-400">Set expiration for certificates</p>
                            </div>
                            <Switch
                              checked={config.expirationEnabled}
                              onCheckedChange={(checked) => setConfig(prev => ({ ...prev, expirationEnabled: checked }))}
                            />
                          </div>
                          {config.expirationEnabled && (
                            <div className="space-y-2">
                              <Label className="text-gray-200">Expiration Period (months)</Label>
                              <Input
                                type="number"
                                value={config.expirationMonths}
                                onChange={(e) => setConfig(prev => ({ ...prev, expirationMonths: parseInt(e.target.value) || 12 }))}
                                className="bg-gray-700 border-gray-600 text-white w-32"
                                min="1"
                                max="120"
                              />
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>

            {/* Preview Panel */}
            <div className="lg:col-span-1">
              <Card className="bg-gray-800 border-gray-700 sticky top-8">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Eye className="h-5 w-5" />
                    Live Preview
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div 
                    className="aspect-[4/3] rounded-lg p-6 text-center flex flex-col justify-center items-center space-y-4 border-2 border-dashed border-gray-600"
                    style={{ 
                      backgroundColor: config.backgroundColor,
                      color: config.textColor 
                    }}
                  >
                    {config.logoUrl && (
                      <div className="w-16 h-16 bg-gray-600 rounded flex items-center justify-center">
                        <Building className="h-8 w-8" />
                      </div>
                    )}
                    
                    <div className="space-y-2">
                      <h3 className="font-bold text-lg">
                        {config.name || 'Certificate Title'}
                      </h3>
                      <p className="text-sm opacity-80">
                        {config.description || 'Certificate description will appear here'}
                      </p>
                    </div>

                    <div className="space-y-1 text-xs opacity-70">
                      <div className="flex items-center gap-1 justify-center">
                        <User className="h-3 w-3" />
                        Recipient Name
                      </div>
                      {config.includeDate && (
                        <div className="flex items-center gap-1 justify-center">
                          <Calendar className="h-3 w-3" />
                          Issue Date
                        </div>
                      )}
                    </div>

                    {config.includeQR && (
                      <div className="w-12 h-12 bg-white bg-opacity-20 rounded flex items-center justify-center">
                        <div className="w-8 h-8 bg-current opacity-50"></div>
                      </div>
                    )}
                  </div>
                  
                  <div className="mt-4 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Category:</span>
                      <Badge variant="outline" className="text-gray-300 border-gray-600">
                        {config.category || 'None'}
                      </Badge>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Custom Fields:</span>
                      <span className="text-gray-300">{config.customFields.length}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Expires:</span>
                      <span className="text-gray-300">
                        {config.expirationEnabled ? `${config.expirationMonths}mo` : 'Never'}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default TemplateBuilder;