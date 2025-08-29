export default function Button({ 
  children, 
  variant = 'primary', 
  size = 'medium', 
  onClick, 
  className = '',
  ...props 
}) {
  const getButtonClasses = () => {
    let classes = 'btn ';
    
    // Variant styles
    switch (variant) {
      case 'primary':
        classes += size === 'small' ? 'btn-primary-small ' : 'btn-primary ';
        break;
      case 'secondary':
        classes += 'btn-secondary ';
        break;
      case 'tertiary':
        classes += 'btn-tertiary ';
        break;
      case 'white':
        classes += 'btn-white ';
        break;
      default:
        classes += size === 'small' ? 'btn-primary-small ' : 'btn-primary ';
    }
    
    return classes + className;
  };

  return (
    <button 
      className={getButtonClasses()} 
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  );
}
