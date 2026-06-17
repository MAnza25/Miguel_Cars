/**
 * Logo oficial Miguel Cars — variantes de tamaño para distintos contextos.
 * size: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
 */
const SIZES = {
  xs: 36,
  sm: 52,
  md: 80,
  lg: 120,
  xl: 180,
};

export default function Logo({ size = 'md', className = '', style = {} }) {
  const height = SIZES[size] ?? SIZES.md;

  return (
    <img
      src="/logo.png"
      alt="Miguel Cars — service innovation"
      className={className}
      style={{
        height,
        width: 'auto',
        objectFit: 'contain',
        display: 'block',
        filter: 'drop-shadow(0 4px 20px rgba(227, 6, 19, 0.35))',
        ...style,
      }}
      draggable={false}
    />
  );
}
