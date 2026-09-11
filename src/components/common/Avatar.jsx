/**
 * Avatar — displays a user avatar with initials or image.
 *
 * Props:
 *   name    {string}  Full name — used to generate initials
 *   src     {string}  Optional image URL
 *   size    {'xs'|'sm'|'md'|'lg'|'xl'}  Default 'md'
 *   color   {'blue'|'green'|'orange'|'purple'|'red'}  Background color
 *   className {string}
 */
function Avatar({ name = '', src, size = 'md', color = 'blue', className = '' }) {
  const initials = name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join('');

  return (
    <div
      className={`avatar avatar--${size} avatar--${color} ${className}`}
      title={name}
      aria-label={name}
    >
      {src ? (
        <img src={src} alt={name} draggable={false} />
      ) : (
        <span>{initials || '?'}</span>
      )}
    </div>
  );
}

export default Avatar;
