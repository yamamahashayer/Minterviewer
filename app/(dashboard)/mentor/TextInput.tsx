import { Search } from 'lucide-react';
import { useState } from 'react';

interface TextInputProps {
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
}

export default function TextInput({ value = '', onChange, placeholder = 'Search...' }: TextInputProps) {
  const [internalValue, setInternalValue] = useState(value);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInternalValue(newValue);
    onChange?.(newValue);
  };

  return (
    <div className="relative w-full max-w-md" data-name="Text Input">
      <div className="relative">
        <Search 
          className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4" 
          style={{ color: 'var(--foreground-muted)' }}
        />
        <input
          type="text"
          value={internalValue}
          onChange={handleChange}
          placeholder={placeholder}
          className="w-full pl-10 pr-4 py-2 rounded-lg text-sm transition-all outline-none"
          style={{
            background: 'var(--input-background)',
            borderColor: 'var(--border)',
            color: 'var(--foreground)',
            border: '1px solid var(--border)',
          }}
          onFocus={(e) => {
            e.currentTarget.style.borderColor = 'var(--accent-cyan)';
            e.currentTarget.style.boxShadow = '0 0 0 3px rgba(124, 58, 237, 0.1)';
          }}
          onBlur={(e) => {
            e.currentTarget.style.borderColor = 'var(--border)';
            e.currentTarget.style.boxShadow = 'none';
          }}
        />
      </div>
    </div>
  );
}