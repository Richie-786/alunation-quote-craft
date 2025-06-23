
import React from 'react';
import { Button } from '@/components/ui/button';
import { Trash } from 'lucide-react';
import { QuotationItem } from '@/types/quotation';

interface QuotationTableProps {
  items: QuotationItem[];
  onRemoveItem: (slNo: number) => void;
  dimensionUnit: 'feet' | 'mm';
  subtotal: number;
  tax: number;
  total: number;
  transportationCost?: number;
}

const QuotationTable: React.FC<QuotationTableProps> = ({
  items,
  onRemoveItem,
  dimensionUnit,
  subtotal,
  tax,
  total,
  transportationCost = 0
}) => {
  if (items.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p>No items added to quotation yet.</p>
        <p className="text-sm">Add items using the form above.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-300">
          <thead className="bg-blue-50">
            <tr>
              <th className="border border-gray-300 p-3 text-left">SL No.</th>
              <th className="border border-gray-300 p-3 text-left">Name</th>
              <th className="border border-gray-300 p-3 text-left">Description</th>
              <th className="border border-gray-300 p-3 text-left">Height ({dimensionUnit})</th>
              <th className="border border-gray-300 p-3 text-left">Width ({dimensionUnit})</th>
              <th className="border border-gray-300 p-3 text-left">Area (Sq.ft)</th>
              <th className="border border-gray-300 p-3 text-left">Quantity</th>
              <th className="border border-gray-300 p-3 text-left">Price/Sq.ft (₹)</th>
              <th className="border border-gray-300 p-3 text-left">Total Cost (₹)</th>
              <th className="border border-gray-300 p-3 text-left">Note</th>
              <th className="border border-gray-300 p-3 text-left">Action</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.slNo} className="hover:bg-gray-50">
                <td className="border border-gray-300 p-3">{item.slNo}</td>
                <td className="border border-gray-300 p-3 font-medium">{item.name}</td>
                <td className="border border-gray-300 p-3">{item.description || '-'}</td>
                <td className="border border-gray-300 p-3">{item.height.toFixed(2)}</td>
                <td className="border border-gray-300 p-3">{item.width.toFixed(2)}</td>
                <td className="border border-gray-300 p-3">{item.area.toFixed(2)}</td>
                <td className="border border-gray-300 p-3">{item.quantity}</td>
                <td className="border border-gray-300 p-3">
                  ₹{item.pricePerSqft.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
                </td>
                <td className="border border-gray-300 p-3 font-medium">
                  ₹{item.totalCost.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
                </td>
                <td className="border border-gray-300 p-3">{item.note || '-'}</td>
                <td className="border border-gray-300 p-3">
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => onRemoveItem(item.slNo)}
                  >
                    <Trash className="w-4 h-4" />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Summary */}
      <div className="bg-blue-50 p-4 rounded-lg border">
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-lg font-medium">Subtotal:</span>
            <span className="text-lg font-medium">
              ₹{subtotal.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-lg font-medium">GST (18%):</span>
            <span className="text-lg font-medium">
              ₹{tax.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
            </span>
          </div>
          {transportationCost > 0 && (
            <div className="flex justify-between items-center">
              <span className="text-lg font-medium">Transportation Cost:</span>
              <span className="text-lg font-medium">
                ₹{transportationCost.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
              </span>
            </div>
          )}
          <hr className="border-blue-200" />
          <div className="flex justify-between items-center">
            <span className="text-xl font-bold text-blue-900">Total Amount:</span>
            <span className="text-xl font-bold text-blue-900">
              ₹{total.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuotationTable;
