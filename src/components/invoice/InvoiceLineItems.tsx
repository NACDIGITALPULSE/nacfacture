
import React from "react";
import { UseFormReturn, useFieldArray } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { useProducts } from "@/hooks/useProducts";
import { Plus, X } from "lucide-react";

interface Product {
  id: string;
  name: string;
  price: number;
  tva: number | null;
}

interface InvoiceLineItemsProps {
  form: UseFormReturn<any>;
}

const InvoiceLineItems: React.FC<InvoiceLineItemsProps> = ({ form }) => {
  const { data: products = [], isLoading: productsLoading } = useProducts();
  
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "lignes"
  });

  const handleProductChange = (index: number, product_id: string) => {
    const prod = products.find((p: Product) => p.id === product_id);
    if (prod) {
      form.setValue(`lignes.${index}.unit_price`, prod.price);
      form.setValue(`lignes.${index}.tva`, prod.tva || 0);
      form.setValue(`lignes.${index}.description`, prod.name);
    }
  };

  return (
    <div>
      <label className="block text-sm mb-1 font-medium">Lignes</label>
      <div className="flex flex-col gap-3">
        {fields.map((field, idx) => (
          <div key={field.id} className="flex gap-2 items-end shadow-sm border rounded-lg p-2 bg-gray-50">
            <div className="flex-1 min-w-[150px]">
              <label className="text-xs text-gray-500">Produit</label>
              <select 
                className="w-full border rounded px-2 py-1"
                {...form.register(`lignes.${idx}.product_id` as const, {
                  onChange: (e) => handleProductChange(idx, e.target.value),
                  required: true,
                })}
                disabled={productsLoading}
              >
                <option value="">Sélectionner</option>
                {products.map((prod: Product) => (
                  <option key={prod.id} value={prod.id}>{prod.name}</option>
                ))}
              </select>
            </div>
            
            <div className="flex-1 min-w-[80px]">
              <label className="text-xs text-gray-500">Qté</label>
              <Input 
                type="number" 
                min={1} 
                {...form.register(`lignes.${idx}.quantity` as const, { 
                  valueAsNumber: true, 
                  required: true 
                })} 
              />
            </div>
            
            <div className="flex-1 min-w-[80px]">
              <label className="text-xs text-gray-500">Prix U</label>
              <Input 
                type="number" 
                step={0.01} 
                {...form.register(`lignes.${idx}.unit_price` as const, { 
                  valueAsNumber: true, 
                  required: true 
                })} 
              />
            </div>
            
            <div className="flex-1 min-w-[80px]">
              <label className="text-xs text-gray-500">TVA (%)</label>
              <Input 
                type="number" 
                step={0.01} 
                {...form.register(`lignes.${idx}.tva` as const, { 
                  valueAsNumber: true, 
                  required: true 
                })} 
              />
            </div>
            
            <button 
              type="button" 
              onClick={() => remove(idx)} 
              className="p-1 text-destructive hover:bg-red-100 rounded"
            >
              <X size={20} />
            </button>
          </div>
        ))}
        
        <button 
          type="button"
          className="w-fit flex gap-1 items-center text-blue-700 font-medium mt-1"
          onClick={() => append({ 
            product_id: "", 
            description: "", 
            quantity: 1, 
            unit_price: 0, 
            tva: 0 
          })}
        >
          <Plus size={16} /> Ajouter ligne
        </button>
      </div>
    </div>
  );
};

export default InvoiceLineItems;
