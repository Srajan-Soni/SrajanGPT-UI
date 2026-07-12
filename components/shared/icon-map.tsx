import {
  Code2,
  Languages,
  Mail,
  FileText,
  Lightbulb,
  Brain,
  Zap,
  Cpu,
  Search,
  Sparkles,
  Server,
  Layers,
  Smartphone,
  type LucideIcon,
} from "lucide-react";

/**
 * iconMap
 * Central registry resolving icon name strings (stored in constants/ data
 * files) to actual Lucide icon components. Keeps constants/ as pure,
 * framework-agnostic data while giving components a single, predictable
 * place to resolve icons at render time.
 *
 * When adding a new icon name to any constants file, register it here too.
 */
export const iconMap: Record<string, LucideIcon> = {
  Code2,
  Languages,
  Mail,
  FileText,
  Lightbulb,
  Brain,
  Zap,
  Cpu,
  Search,
  Sparkles,
  Server,
  Layers,
  Smartphone,
};

/**
 * Resolves an icon name to its component, falling back to Sparkles
 * if the name isn't registered — prevents a render crash from a typo
 * in a constants file while still being visually obvious something's off.
 */
export function resolveIcon(name: string): LucideIcon {
  return iconMap[name] ?? Sparkles;
}