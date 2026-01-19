import { Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface AIFieldBadgeProps {
  className?: string;
}

export function AIFieldBadge({ className }: AIFieldBadgeProps) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Badge
          variant="outline"
          className={`ml-2 bg-purple-500/10 text-purple-400 border-purple-500/30 gap-1 cursor-help ${className}`}
        >
          <Sparkles className="h-3 w-3" />
          IA
        </Badge>
      </TooltipTrigger>
      <TooltipContent>
        Contenu récupéré ou enrichi par l'IA
      </TooltipContent>
    </Tooltip>
  );
}
