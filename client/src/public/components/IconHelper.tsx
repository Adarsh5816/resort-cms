import React from 'react';
import * as Icons from 'lucide-react';

interface IconHelperProps {
  name: string;
  className?: string;
}

export const IconHelper: React.FC<IconHelperProps> = ({ name, className = 'w-5 h-5' }) => {
  // Convert kebab-case to PascalCase for Lucide icons (e.g. 'user-check' -> 'UserCheck')
  const pascalName = name
    .split('-')
    .map(part => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join('');

  const IconComponent = (Icons as any)[pascalName] || (Icons as any)[name] || Icons.Check;

  return <IconComponent className={className} />;
};
