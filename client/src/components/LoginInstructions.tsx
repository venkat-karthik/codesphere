import { Copy, Check } from 'lucide-react';
import { useState } from 'react';

interface DemoAccountProps {
  label: string;
  email: string;
  password: string;
  onFill: (email: string, password: string) => void;
}

function DemoAccountRow({ label, email, password, onFill }: DemoAccountProps) {
  const [copied, setCopied] = useState(false);

  const handleClick = () => {
    onFill(email, password);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg bg-cs-bg/60 hover:bg-cs-primary/10 border border-transparent hover:border-cs-primary/30 transition-all duration-200 group"
    >
      <div className="flex items-center gap-2.5 text-left">
        <span className="text-[10px] font-bold uppercase tracking-wider text-cs-primary/80 bg-cs-primary/10 px-1.5 py-0.5 rounded">
          {label}
        </span>
        <span className="text-xs text-cs-body truncate">{email}</span>
      </div>
      <div className="flex items-center gap-1 text-cs-body/60 group-hover:text-cs-primary transition-colors">
        {copied ? (
          <Check className="h-3.5 w-3.5 text-green-400" />
        ) : (
          <Copy className="h-3.5 w-3.5" />
        )}
        <span className="text-[10px]">{copied ? 'Filled!' : 'Use'}</span>
      </div>
    </button>
  );
}

interface LoginInstructionsProps {
  onFill?: (email: string, password: string) => void;
}

export function LoginInstructions({ onFill }: LoginInstructionsProps) {
  const handleFill = onFill || (() => {});

  return (
    <div className="space-y-1.5">
      <DemoAccountRow label="Admin" email="admin@codesphere.com" password="admin123" onFill={handleFill} />
      <DemoAccountRow label="Student" email="student@codesphere.com" password="student123" onFill={handleFill} />
    </div>
  );
}