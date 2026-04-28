import { PromptUseLayout } from '@/components/prompts/use/PromptUseLayout';

export default function UseTemplateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <PromptUseLayout>{children}</PromptUseLayout>;
}
