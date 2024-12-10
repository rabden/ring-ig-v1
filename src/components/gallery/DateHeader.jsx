import React from 'react';

const DateHeader = ({ children }) => (
  <div className="flex items-center gap-3 px-2 mb-6">
    <h2 className="text-sm font-medium text-muted-foreground">{children}</h2>
    <div className="h-px flex-grow bg-border/30" />
  </div>
);

export default DateHeader;