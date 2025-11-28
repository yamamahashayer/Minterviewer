import { useTheme } from './ThemeProvider';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { Palette } from 'lucide-react';

export const ColorSystemDemo = () => {
  const { theme } = useTheme();

  return (
    <div className="rounded-xl bg-[var(--card)] border border-[var(--border)] p-6 mb-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: 'var(--accent-cyan-subtle)' }}>
          <Palette className="w-5 h-5" style={{ color: 'var(--accent-cyan)' }} />
        </div>
        <div>
          <h3 className="text-[var(--foreground)]">Color System</h3>
          <p className="text-[var(--foreground-muted)] text-sm">
            {theme === 'dark' ? 'Rich & Immersive' : 'Soft & Balanced'}
          </p>
        </div>
      </div>

      {/* Color Swatches */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {/* Primary */}
        <div className="space-y-2">
          <div 
            className="h-20 rounded-lg border border-[var(--border)]" 
            style={{ backgroundColor: 'var(--accent-cyan)' }}
          />
          <div>
            <p className="text-[var(--foreground)] text-sm">Primary</p>
            <p className="text-[var(--foreground-muted)] text-xs">#00A8B8</p>
          </div>
        </div>

        {/* Success */}
        <div className="space-y-2">
          <div 
            className="h-20 rounded-lg border border-[var(--border)]" 
            style={{ backgroundColor: 'var(--success)' }}
          />
          <div>
            <p className="text-[var(--foreground)] text-sm">Success</p>
            <p className="text-[var(--foreground-muted)] text-xs">#19C997</p>
          </div>
        </div>

        {/* Warning */}
        <div className="space-y-2">
          <div 
            className="h-20 rounded-lg border border-[var(--border)]" 
            style={{ backgroundColor: 'var(--warning)' }}
          />
          <div>
            <p className="text-[var(--foreground)] text-sm">Warning</p>
            <p className="text-[var(--foreground-muted)] text-xs">#F9B84F</p>
          </div>
        </div>

        {/* Purple */}
        <div className="space-y-2">
          <div 
            className="h-20 rounded-lg border border-[var(--border)]" 
            style={{ backgroundColor: 'var(--accent-purple)' }}
          />
          <div>
            <p className="text-[var(--foreground)] text-sm">Purple</p>
            <p className="text-[var(--foreground-muted)] text-xs">#7B61E8</p>
          </div>
        </div>

        {/* Error */}
        <div className="space-y-2">
          <div 
            className="h-20 rounded-lg border border-[var(--border)]" 
            style={{ backgroundColor: 'var(--error)' }}
          />
          <div>
            <p className="text-[var(--foreground)] text-sm">Error</p>
            <p className="text-[var(--foreground-muted)] text-xs">#E05757</p>
          </div>
        </div>
      </div>

      {/* Sample Components */}
      <div className="mt-6 pt-6 border-t border-[var(--border)]">
        <p className="text-[var(--foreground-muted)] text-sm mb-4">Component Examples:</p>
        <div className="flex flex-wrap gap-3">
          <Button 
            className="text-white"
            style={{ 
              background: 'linear-gradient(to right, var(--accent-cyan), var(--accent-teal))',
              boxShadow: '0 0 20px var(--glow-cyan)'
            }}
          >
            Primary Button
          </Button>
          <Button 
            variant="outline"
            style={{
              borderColor: 'var(--accent-cyan)',
              color: 'var(--accent-cyan)',
              background: 'var(--accent-cyan-subtle)'
            }}
          >
            Outline Button
          </Button>
          <Badge style={{ 
            background: 'var(--success-subtle)',
            color: 'var(--success)',
            border: '1px solid var(--success)'
          }}>
            Success Badge
          </Badge>
          <Badge style={{ 
            background: 'var(--warning-subtle)',
            color: 'var(--warning)',
            border: '1px solid var(--warning)'
          }}>
            Warning Badge
          </Badge>
          <Badge style={{ 
            background: 'var(--accent-purple-subtle)',
            color: 'var(--accent-purple)',
            border: '1px solid var(--accent-purple)'
          }}>
            Purple Badge
          </Badge>
        </div>
      </div>
    </div>
  );
};
