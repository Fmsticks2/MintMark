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
import { 
  Plus, 
  Trash2, 
  Save, 
  Eye, 
  Download,
  Upload,
  Type,
  Image as ImageIcon,
  Calendar,
  Hash,
  FileText,
  Settings,
  Palette
} from 'lucide-react';

interface TemplateField {
  id: string;
  type: 'text' | 'image' | 'signature' | 'date' | 'qr';
  label: string;
  required: boolean;
  position: { x: number; y: number };
}

const TemplateBuilder: React.FC = () => {
  const [templateName, setTemplateName] = useState('');
  const [templateDescription, setTemplateDescription] = useState('');
  const [templateCategory, setTemplateCategory] = useState('');
  const [fields, setFields] = useState<TemplateField[]>([]);
  const [selectedField, setSelectedField] = useState<string | null>(null);
  const [previewMode, setPreviewMode] = useState(false);

  const fieldTypes = [
    { type: 'text', label: 'Text Field', icon: Type },
    { type: 'image', label: 'Image', icon: Image },
    { type: 'signature', label: 'Signature', icon: FileText },
    { type: 'date', label: 'Date', icon: FileText },
    { type: 'qr', label: 'QR Code', icon: FileText },
  ];

  const addField = (type: TemplateField['type']) => {
    const newField: TemplateField = {
      id: `field-${Date.now()}`,
      type,
      label: `New ${type} field`,
      required: false,
      position: { x: 100, y: 100 + fields.length * 60 },
    };
    setFields([...fields, newField]);
  };

  const updateField = (id: string, updates: Partial<TemplateField>) => {
    setFields(fields.map(field => 
      field.id === id ? { ...field, ...updates } : field
    ));
  };

  const removeField = (id: string) => {
    setFields(fields.filter(field => field.id !== id));
    if (selectedField === id) {
      setSelectedField(null);
    }
  };

  const saveTemplate = () => {
    // Implementation for saving template
    console.log('Saving template:', {
      name: templateName,
      description: templateDescription,
      category: templateCategory,
      fields,
    });
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
            Template Builder
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="text-gray-400 text-lg"
          >
            Create and customize certificate templates for your organization
          </motion.p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Template Settings Panel */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="lg:col-span-1"
          >
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Template Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="template-name" className="text-gray-300">Template Name</Label>
                  <Input
                    id="template-name"
                    value={templateName}
                    onChange={(e) => setTemplateName(e.target.value)}
                    placeholder="Enter template name"
                    className="bg-gray-700 border-gray-600 text-white"
                  />
                </div>
                
                <div>
                  <Label htmlFor="template-description" className="text-gray-300">Description</Label>
                  <Textarea
                    id="template-description"
                    value={templateDescription}
                    onChange={(e) => setTemplateDescription(e.target.value)}
                    placeholder="Enter template description"
                    className="bg-gray-700 border-gray-600 text-white"
                    rows={3}
                  />
                </div>
                
                <div>
                  <Label htmlFor="template-category" className="text-gray-300">Category</Label>
                  <Select value={templateCategory} onValueChange={setTemplateCategory}>
                    <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-700 border-gray-600">
                      <SelectItem value="education">Education</SelectItem>
                      <SelectItem value="professional">Professional</SelectItem>
                      <SelectItem value="achievement">Achievement</SelectItem>
                      <SelectItem value="participation">Participation</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="pt-4">
                  <h3 className="text-white font-medium mb-3">Add Fields</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {fieldTypes.map(({ type, label, icon: Icon }) => (
                      <motion.div key={type} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => addField(type as TemplateField['type'])}
                          className="w-full bg-gray-700 border-gray-600 text-white hover:bg-gray-600 flex items-center gap-1 text-xs transition-all duration-200"
                        >
                          <ImageIcon className="h-3 w-3" />
                          {label}
                        </Button>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Template Canvas */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="lg:col-span-2"
          >
            <Card className="bg-gray-800 border-gray-700 h-[600px]">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-white flex items-center gap-2">
                  <Palette className="h-5 w-5" />
                  Template Canvas
                </CardTitle>
                <div className="flex gap-2">
                  <Button
                    variant={previewMode ? "default" : "outline"}
                    size="sm"
                    onClick={() => setPreviewMode(!previewMode)}
                    className="bg-gray-700 border-gray-600 text-white hover:bg-gray-600"
                  >
                    <Eye className="h-4 w-4 mr-1" />
                    {previewMode ? 'Edit' : 'Preview'}
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="h-full p-2 sm:p-6">
                <div className="relative w-full h-96 sm:h-full bg-white rounded-lg border-2 border-dashed border-gray-300 overflow-hidden">
                  {/* Template Background */}
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-indigo-100">
                    {/* Template Header */}
                    <motion.div 
                      initial={{ opacity: 0, y: -20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                      className="text-center pt-4 sm:pt-8 pb-2 sm:pb-4 px-2"
                    >
                      <h2 className="text-lg sm:text-2xl font-bold text-gray-800">
                        {templateName || 'Certificate Template'}
                      </h2>
                      <p className="text-gray-600 mt-1 sm:mt-2 text-sm sm:text-base">
                        {templateDescription || 'Template description will appear here'}
                      </p>
                    </motion.div>
                    
                    {/* Dynamic Fields */}
                    <AnimatePresence>
                      {fields.map((field, index) => (
                        <motion.div
                          key={field.id}
                          initial={{ scale: 0, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          exit={{ scale: 0, opacity: 0 }}
                          transition={{ delay: index * 0.1 }}
                          whileHover={{ scale: 1.05 }}
                          className={`absolute cursor-pointer border-2 p-1 sm:p-2 rounded transition-all duration-200 ${
                            selectedField === field.id 
                              ? 'border-blue-500 bg-blue-50 shadow-lg' 
                              : 'border-gray-300 bg-white hover:border-gray-400 hover:shadow-md'
                          }`}
                          style={{
                            left: Math.max(0, Math.min(field.position.x, window.innerWidth > 640 ? 400 : 250)),
                            top: Math.max(60, Math.min(field.position.y, 300)),
                          }}
                          onClick={() => setSelectedField(field.id)}
                        >
                          <div className="text-xs sm:text-sm text-gray-700">
                            {field.label}
                            {field.required && <span className="text-red-500 ml-1">*</span>}
                          </div>
                          {!previewMode && (
                            <motion.div
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                            >
                              <Button
                                variant="destructive"
                                size="sm"
                                className="absolute -top-1 -right-1 h-4 w-4 sm:h-6 sm:w-6 p-0 text-xs"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  removeField(field.id);
                                }}
                              >
                                <Trash2 className="h-2 w-2 sm:h-3 sm:w-3" />
                              </Button>
                            </motion.div>
                          )}
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Field Properties Panel */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="lg:col-span-1"
          >
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Field Properties</CardTitle>
              </CardHeader>
              <CardContent>
                {selectedField ? (
                  <div className="space-y-4">
                    {(() => {
                      const field = fields.find(f => f.id === selectedField);
                      if (!field) return null;
                      
                      return (
                        <>
                          <div>
                            <Label className="text-gray-300">Label</Label>
                            <Input
                              value={field.label}
                              onChange={(e) => updateField(field.id, { label: e.target.value })}
                              className="bg-gray-700 border-gray-600 text-white"
                            />
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            <input
                              type="checkbox"
                              id="required"
                              checked={field.required}
                              onChange={(e) => updateField(field.id, { required: e.target.checked })}
                              className="rounded"
                            />
                            <Label htmlFor="required" className="text-gray-300">Required field</Label>
                          </div>
                          
                          <div>
                            <Label className="text-gray-300">Position X</Label>
                            <Input
                              type="number"
                              value={field.position.x}
                              onChange={(e) => updateField(field.id, { 
                                position: { ...field.position, x: parseInt(e.target.value) || 0 }
                              })}
                              className="bg-gray-700 border-gray-600 text-white"
                            />
                          </div>
                          
                          <div>
                            <Label className="text-gray-300">Position Y</Label>
                            <Input
                              type="number"
                              value={field.position.y}
                              onChange={(e) => updateField(field.id, { 
                                position: { ...field.position, y: parseInt(e.target.value) || 0 }
                              })}
                              className="bg-gray-700 border-gray-600 text-white"
                            />
                          </div>
                        </>
                      );
                    })()} 
                  </div>
                ) : (
                  <p className="text-gray-400 text-center py-8">
                    Select a field to edit its properties
                  </p>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Action Buttons */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.6 }}
          className="flex flex-col sm:flex-row justify-end gap-4 mt-8"
        >
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button 
              variant="outline" 
              className="w-full sm:w-auto bg-gray-700 border-gray-600 text-white hover:bg-gray-600 transition-all duration-200"
            >
              Cancel
            </Button>
          </motion.div>
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button 
              onClick={saveTemplate}
              className="w-full sm:w-auto bg-green-500 hover:bg-green-600 text-white transition-all duration-200 shadow-lg hover:shadow-green-500/25"
            >
              <Save className="h-4 w-4 mr-2" />
              Save Template
            </Button>
          </motion.div>
        </motion.div>
      </motion.div>
      
      <Footer />
    </div>
  );
};

export default TemplateBuilder;