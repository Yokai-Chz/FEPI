import React from 'react';

interface TableContainerProps {
  title?: string;
  action?: React.ReactNode;
  children: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
}

export default function TableContainer({ title, action, children, footer, className = '' }: TableContainerProps) {
  return (
    <div className={`bg-white rounded-[32px] shadow-sm overflow-hidden border border-gray-100 ${className}`}>
      {/* Header (Optional) - Only render if title or action is present */}
      {(title || action) && (
        <div className="p-8 border-b border-gray-50 flex justify-between items-center gap-4 flex-wrap">
          {title && <h3 className="text-xl font-black text-gray-800 tracking-tight">{title}</h3>}
          {action && <div className="flex-1 flex justify-end">{action}</div>}
        </div>
      )}
      
      {/* Table Content */}
      <div className="w-full overflow-x-auto">
        {children}
      </div>

      {/* Footer (Optional) */}
      {footer && (
        <div className="p-4 bg-red-50/50 border-t border-red-50">
          {footer}
        </div>
      )}
    </div>
  );
}
