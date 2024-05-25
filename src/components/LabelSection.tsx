import React from 'react';

type Props = {
  className: string;
  label: string;
  children: React.ReactNode;
};

function LabelSection({ className, label, children }: Props) {
  return (
    <div className={`${className} flex flex-col`}>
      <h4>{label}</h4>
      {children}
    </div>
  );
}

export default LabelSection;
