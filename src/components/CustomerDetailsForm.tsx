
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { CustomerDetails } from '@/types/quotation';

interface CustomerDetailsFormProps {
  customerDetails: CustomerDetails;
  setCustomerDetails: (details: CustomerDetails) => void;
}

const CustomerDetailsForm: React.FC<CustomerDetailsFormProps> = ({
  customerDetails,
  setCustomerDetails
}) => {
  const handleInputChange = (field: keyof CustomerDetails, value: string) => {
    setCustomerDetails({
      ...customerDetails,
      [field]: value
    });
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label htmlFor="projectName">Project Name *</Label>
        <Input
          id="projectName"
          value={customerDetails.projectName}
          onChange={(e) => handleInputChange('projectName', e.target.value)}
          placeholder="Enter project name"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="customerName">Customer Name *</Label>
        <Input
          id="customerName"
          value={customerDetails.name}
          onChange={(e) => handleInputChange('name', e.target.value)}
          placeholder="Enter customer name"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="gstNumber">GST Number *</Label>
        <Input
          id="gstNumber"
          value={customerDetails.gstNumber}
          onChange={(e) => handleInputChange('gstNumber', e.target.value.toUpperCase())}
          placeholder="22AAAAA0000A1Z5"
          maxLength={15}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="phone">Phone Number</Label>
        <Input
          id="phone"
          value={customerDetails.phone}
          onChange={(e) => handleInputChange('phone', e.target.value)}
          placeholder="+91 9876543210"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          value={customerDetails.email}
          onChange={(e) => handleInputChange('email', e.target.value)}
          placeholder="customer@email.com"
        />
      </div>

      <div className="space-y-2 md:col-span-2">
        <Label htmlFor="address">Address</Label>
        <Textarea
          id="address"
          value={customerDetails.address}
          onChange={(e) => handleInputChange('address', e.target.value)}
          placeholder="Enter complete address"
          rows={3}
        />
      </div>
    </div>
  );
};

export default CustomerDetailsForm;
