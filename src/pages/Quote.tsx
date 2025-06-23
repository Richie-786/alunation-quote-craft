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
import { exportToExcel, exportToPDF, importFromExcel } from '@/utils/exportUtils';

const Quote = () => {
  const [customerDetails, setCustomerDetails] = useState<CustomerDetails>({
    name: '',
    gstNumber: '',
    address: '',
    phone: '',
    email: '',
    projectName: ''
  });

  const [quotationItems, setQuotationItems] = useState<QuotationItem[]>([]);
  const [dimensionUnit, setDimensionUnit] = useState<'feet' | 'mm'>('feet');
  const [transportationCost, setTransportationCost] = useState<number>(0);

  const addQuotationItem = (item: Omit<QuotationItem, 'slNo' | 'area' | 'totalCost' | 'note'> & { note?: string }) => {
    let areaInSqft: number;
    
    if (dimensionUnit === 'feet') {
      areaInSqft = item.height * item.width;
    } else {
      // Convert mm to feet (1 foot = 304.8 mm)
      const heightInFeet = item.height / 304.8;
      const widthInFeet = item.width / 304.8;
      areaInSqft = heightInFeet * widthInFeet;
    }

    const totalCost = areaInSqft * item.pricePerSqft * item.quantity;
    
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
    return calculateSubtotal() + calculateTax() + transportationCost;
  };

  const handleExportToPDF = () => {
    try {
      exportToPDF(customerDetails, quotationItems, calculateSubtotal(), calculateTax(), calculateTotal(), transportationCost);
      toast({
        title: "PDF Exported",
        description: "Quotation has been exported to PDF successfully.",
      });
    } catch (error) {
      toast({
        title: "Export Failed",
        description: "Failed to export PDF. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleExportToExcel = () => {
    try {
      exportToExcel(customerDetails, quotationItems, calculateSubtotal(), calculateTax(), calculateTotal(), transportationCost);
      toast({
        title: "Excel Exported",
        description: "Quotation has been exported to Excel successfully.",
      });
    } catch (error) {
      toast({
        title: "Export Failed",
        description: "Failed to export Excel. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleImportFromExcel = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      try {
        const { customerDetails: importedCustomer, items: importedItems } = await importFromExcel(file);
        setCustomerDetails(importedCustomer);
        setQuotationItems(importedItems);
        toast({
          title: "Import Successful",
          description: "Excel file has been imported successfully.",
        });
      } catch (error) {
        toast({
          title: "Import Failed",
          description: "Failed to import Excel file. Please check the file format.",
          variant: "destructive"
        });
      }
      // Reset file input
      event.target.value = '';
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
            <TabsTrigger value="import">Import & Modify</TabsTrigger>
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
                />
              </CardContent>
            </Card>

            {/* Transportation Cost */}
            <Card>
              <CardHeader>
                <CardTitle className="text-blue-900">Additional Costs</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <label htmlFor="transportationCost" className="block text-sm font-medium text-gray-700">
                    Transportation Cost (Optional)
                  </label>
                  <input
                    type="number"
                    id="transportationCost"
                    value={transportationCost || ''}
                    onChange={(e) => setTransportationCost(Number(e.target.value) || 0)}
                    placeholder="Enter transportation cost"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Quotation Table */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-blue-900">Quotation Items</CardTitle>
                <div className="flex gap-2">
                  <Button onClick={handleExportToPDF} variant="outline" size="sm">
                    <FileText className="w-4 h-4 mr-2" />
                    Export PDF
                  </Button>
                  <Button onClick={handleExportToExcel} variant="outline" size="sm">
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
                  transportationCost={transportationCost}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="import" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-blue-900">Import Existing Quotation</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-sm text-gray-600">
                    Import an existing Excel file to modify a previous quotation. The Excel file should have 'Customer Details' and 'Quotation' sheets.
                  </p>
                  <div className="flex items-center gap-4">
                    <input
                      type="file"
                      accept=".xlsx,.xls"
                      onChange={handleImportFromExcel}
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

export default Quote;
