
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import CustomerDetailsForm from '@/components/CustomerDetailsForm';
import QuotationForm from '@/components/QuotationForm';
import QuotationTable from '@/components/QuotationTable';
import { CustomerDetails, QuotationItem } from '@/types/quotation';
import { FileText, FileSpreadsheet, Upload } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const Index = () => {
  const [customerDetails, setCustomerDetails] = useState<CustomerDetails>({
    name: '',
    gstNumber: '',
    address: '',
    phone: '',
    email: ''
  });

  const [quotationItems, setQuotationItems] = useState<QuotationItem[]>([]);
  const [pricePerSqft, setPricePerSqft] = useState<number>(500);
  const [dimensionUnit, setDimensionUnit] = useState<'feet' | 'mm'>('feet');

  const addQuotationItem = (item: Omit<QuotationItem, 'slNo' | 'area' | 'totalCost'>) => {
    let areaInSqft: number;
    
    if (dimensionUnit === 'feet') {
      areaInSqft = item.height * item.width;
    } else {
      // Convert mm to feet (1 foot = 304.8 mm)
      const heightInFeet = item.height / 304.8;
      const widthInFeet = item.width / 304.8;
      areaInSqft = heightInFeet * widthInFeet;
    }

    const totalCost = areaInSqft * pricePerSqft * item.quantity;
    
    const newItem: QuotationItem = {
      ...item,
      slNo: quotationItems.length + 1,
      area: areaInSqft,
      totalCost
    };

    setQuotationItems([...quotationItems, newItem]);
    toast({
      title: "Item Added",
      description: "Quotation item has been added successfully.",
    });
  };

  const removeQuotationItem = (slNo: number) => {
    const updatedItems = quotationItems
      .filter(item => item.slNo !== slNo)
      .map((item, index) => ({ ...item, slNo: index + 1 }));
    setQuotationItems(updatedItems);
    toast({
      title: "Item Removed",
      description: "Quotation item has been removed successfully.",
    });
  };

  const calculateSubtotal = () => {
    return quotationItems.reduce((sum, item) => sum + item.totalCost, 0);
  };

  const calculateTax = () => {
    return calculateSubtotal() * 0.18;
  };

  const calculateTotal = () => {
    return calculateSubtotal() + calculateTax();
  };

  const exportToPDF = () => {
    // This would integrate with a PDF library like jsPDF
    toast({
      title: "PDF Export",
      description: "PDF export functionality will be implemented with jsPDF library.",
    });
  };

  const exportToExcel = () => {
    // This would integrate with a library like xlsx
    toast({
      title: "Excel Export",
      description: "Excel export functionality will be implemented with xlsx library.",
    });
  };

  const importFromExcel = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // This would parse Excel file and populate the quotation
      toast({
        title: "Import Started",
        description: "Excel import functionality will be implemented with xlsx library.",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-blue-900 mb-2">V&V Alunation</h1>
          <p className="text-lg text-blue-700">Window Manufacturing & Quotation System</p>
          <p className="text-sm text-gray-600">Bangalore, India</p>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="quotation" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="quotation">Create Quotation</TabsTrigger>
            <TabsTrigger value="settings">Settings & Import</TabsTrigger>
          </TabsList>

          <TabsContent value="quotation" className="space-y-6">
            {/* Customer Details */}
            <Card>
              <CardHeader>
                <CardTitle className="text-blue-900">Customer Details</CardTitle>
              </CardHeader>
              <CardContent>
                <CustomerDetailsForm 
                  customerDetails={customerDetails}
                  setCustomerDetails={setCustomerDetails}
                />
              </CardContent>
            </Card>

            {/* Quotation Form */}
            <Card>
              <CardHeader>
                <CardTitle className="text-blue-900">Add Quotation Item</CardTitle>
              </CardHeader>
              <CardContent>
                <QuotationForm 
                  onAddItem={addQuotationItem}
                  dimensionUnit={dimensionUnit}
                  setDimensionUnit={setDimensionUnit}
                  pricePerSqft={pricePerSqft}
                />
              </CardContent>
            </Card>

            {/* Quotation Table */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-blue-900">Quotation Items</CardTitle>
                <div className="flex gap-2">
                  <Button onClick={exportToPDF} variant="outline" size="sm">
                    <FileText className="w-4 h-4 mr-2" />
                    Export PDF
                  </Button>
                  <Button onClick={exportToExcel} variant="outline" size="sm">
                    <FileSpreadsheet className="w-4 h-4 mr-2" />
                    Export Excel
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <QuotationTable 
                  items={quotationItems}
                  onRemoveItem={removeQuotationItem}
                  dimensionUnit={dimensionUnit}
                  subtotal={calculateSubtotal()}
                  tax={calculateTax()}
                  total={calculateTotal()}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-blue-900">Price Settings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Price per Sq.ft (₹)</label>
                    <input
                      type="number"
                      value={pricePerSqft}
                      onChange={(e) => setPricePerSqft(Number(e.target.value))}
                      className="w-full p-2 border rounded-md"
                      min="0"
                      step="0.01"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-blue-900">Import Existing Quotation</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-sm text-gray-600">
                    Import an existing Excel file to modify a previous quotation.
                  </p>
                  <div className="flex items-center gap-4">
                    <input
                      type="file"
                      accept=".xlsx,.xls"
                      onChange={importFromExcel}
                      className="hidden"
                      id="excel-import"
                    />
                    <label htmlFor="excel-import">
                      <Button variant="outline" className="cursor-pointer">
                        <Upload className="w-4 h-4 mr-2" />
                        Import Excel File
                      </Button>
                    </label>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;
