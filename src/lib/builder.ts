import { BuilderComponent } from '@builder.io/sdk-react';

export const BUILDER_PUBLIC_KEY = 'YOUR_PUBLIC_KEY';

export function BuilderPage({ 
  model = 'page', 
  content,
  children,
  fallback 
}: { 
  model?: string;
  content?: any;
  children?: React.ReactNode;
  fallback?: React.ReactNode;
}) {
  return (
    <BuilderComponent
      model={model}
      content={content}
    >
      {children || fallback}
    </BuilderComponent>
  );
}