
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus } from 'lucide-react';
import { QuotationItem } from '@/types/quotation';

interface QuotationFormProps {
  onAddItem: (item: Omit<QuotationItem, 'slNo' | 'area' | 'totalCost'>) => void;
  dimensionUnit: 'feet' | 'mm';
  setDimensionUnit: (unit: 'feet' | 'mm') => void;
  pricePerSqft: number;
}

const QuotationForm: React.FC<QuotationFormProps> = ({
  onAddItem,
  dimensionUnit,
  setDimensionUnit,
  pricePerSqft
}) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    height: '',
    width: '',
    quantity: '1'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.height || !formData.width) {
      return;
    }

    onAddItem({
      name: formData.name,
      description: formData.description,
      height: Number(formData.height),
      width: Number(formData.width),
      quantity: Number(formData.quantity)
    });

    // Reset form
    setFormData({
      name: '',
      description: '',
      height: '',
      width: '',
      quantity: '1'
    });
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData({
      ...formData,
      [field]: value
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="itemName">Item Name *</Label>
          <Input
            id="itemName"
            value={formData.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
            placeholder="e.g., Sliding Window"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="dimensionUnit">Dimension Unit</Label>
          <Select value={dimensionUnit} onValueChange={(value: 'feet' | 'mm') => setDimensionUnit(value)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="feet">Feet</SelectItem>
              <SelectItem value="mm">Millimeters (mm)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="priceDisplay">Price per Sq.ft</Label>
          <div className="p-2 bg-gray-100 rounded-md text-sm font-medium">
            ₹{pricePerSqft.toLocaleString('en-IN')}
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => handleInputChange('description', e.target.value)}
          placeholder="Enter item description (optional)"
          rows={2}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="height">Height ({dimensionUnit}) *</Label>
          <Input
            id="height"
            type="number"
            value={formData.height}
            onChange={(e) => handleInputChange('height', e.target.value)}
            placeholder="Enter height"
            min="0"
            step="0.01"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="width">Width ({dimensionUnit}) *</Label>
          <Input
            id="width"
            type="number"
            value={formData.width}
            onChange={(e) => handleInputChange('width', e.target.value)}
            placeholder="Enter width"
            min="0"
            step="0.01"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="quantity">Quantity *</Label>
          <Input
            id="quantity"
            type="number"
            value={formData.quantity}
            onChange={(e) => handleInputChange('quantity', e.target.value)}
            placeholder="Enter quantity"
            min="1"
            required
          />
        </div>
      </div>

      <Button type="submit" className="w-full md:w-auto bg-blue-600 hover:bg-blue-700">
        <Plus className="w-4 h-4 mr-2" />
        Add Item to Quotation
      </Button>
    </form>
  );
};

export default QuotationForm;
