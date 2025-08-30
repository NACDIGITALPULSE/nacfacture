
import React from "react";
import { Input } from "@/components/ui/input";

interface ColorPickerProps {
  color: string;
  onChange: (color: string) => void;
  label?: string;
}

export const ColorPicker: React.FC<ColorPickerProps> = ({
  color,
  onChange,
  label
}) => {
  return (
    <div className="flex items-center gap-2">
      {label && <span className="text-sm font-medium">{label}</span>}
      <div 
        className="w-8 h-8 rounded border-2 border-white shadow-md cursor-pointer"
        style={{ backgroundColor: color }}
        onClick={() => {
          const input = document.createElement('input');
          input.type = 'color';
          input.value = color;
          input.onchange = (e) => onChange((e.target as HTMLInputElement).value);
          input.click();
        }}
      />
      <Input
        type="color"
        value={color}
        onChange={(e) => onChange(e.target.value)}
        className="w-16 h-8 p-0 border-0"
      />
      <Input
        value={color}
        onChange={(e) => onChange(e.target.value)}
        placeholder="#000000"
        className="flex-1 font-mono text-sm"
      />
    </div>
  );
};
