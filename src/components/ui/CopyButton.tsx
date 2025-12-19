import { useState } from 'react';
import { Check, Copy } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface CopyButtonProps {
  value: string;
  label?: string;
  className?: string;
  iconClassName?: string;
  successMessage?: string;
}

export const CopyButton = ({ 
  value, 
  label, 
  className,
  iconClassName,
  successMessage = 'Copié !'
}: CopyButtonProps) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      toast.success(successMessage);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast.error('Échec de la copie');
    }
  };

  return (
    <button
      onClick={handleCopy}
      className={cn(
        "inline-flex items-center gap-1.5 px-2 py-1 rounded-md transition-all duration-200",
        "hover:bg-primary/10 active:scale-95 group cursor-pointer",
        className
      )}
      title={`Copier: ${value}`}
    >
      {label && <span className="truncate">{label}</span>}
      {copied ? (
        <Check className={cn("w-3.5 h-3.5 text-green-500 shrink-0", iconClassName)} />
      ) : (
        <Copy className={cn("w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity shrink-0", iconClassName)} />
      )}
    </button>
  );
};

// Wrapper for displaying a copiable field with label
interface CopyFieldProps {
  label: string;
  value: string;
  className?: string;
  mono?: boolean;
  successMessage?: string;
}

export const CopyField = ({ label, value, className, mono = false, successMessage }: CopyFieldProps) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      toast.success(successMessage || `${label} copié !`);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast.error('Échec de la copie');
    }
  };

  return (
    <button
      onClick={handleCopy}
      className={cn(
        "inline-flex items-center gap-2 px-2 py-1 -mx-2 rounded-lg transition-all duration-200",
        "hover:bg-primary/10 active:scale-[0.98] group cursor-pointer text-left",
        "max-w-full min-w-0 overflow-hidden",
        className
      )}
      title={`Copier ${label}`}
    >
      <span className={cn("min-w-0 break-words", mono && "font-mono")}>{value}</span>
      {copied ? (
        <Check className="w-3.5 h-3.5 text-green-500 shrink-0" />
      ) : (
        <Copy className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground shrink-0" />
      )}
    </button>
  );
};
