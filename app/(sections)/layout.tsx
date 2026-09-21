import { PortraitPlate } from "@/components/portrait-plate";

// One section per route: the section takes two columns, the portrait plate the third.
// The plate lives in the layout so it keeps animating across section-to-section navigation.
export default function SectionLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="grid lg:grid-cols-3 *:border-b *:border-foreground/25 lg:*:border-r">
      <div className="lg:col-span-2">{children}</div>
      <PortraitPlate />
    </div>
  );
}
