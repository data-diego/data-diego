import { Panel } from "@/components/panel";
import { DitheredField } from "@/components/paper-shaders";

// The 4×4 Bayer matrix every pixel on this page is thresholded against.
const BAYER_4X4 = [
  [0, 8, 2, 10],
  [12, 4, 14, 6],
  [3, 11, 1, 9],
  [15, 7, 13, 5],
];

export function DitherNotes({ className }: { className?: string }) {
  return (
    <Panel
      label="Datadiego on dithering"
      className={className}
      bodyClassName="grid gap-5 lg:grid-cols-2 lg:items-center"
    >
      <p className="leading-snug">
        *Every image on this sheet is one ink on one paper. Ordered dithering
        fakes the greys: a pixel is inked only when it is darker than its slot
        in a tiny repeating matrix.
      </p>
      <div className="flex items-center gap-5">
        <table className="shrink-0 border-collapse text-center text-sm tabular-nums">
          <caption className="paper-label caption-bottom pt-1.5">
            M, Bayer 4×4
          </caption>
          <tbody>
            {BAYER_4X4.map((row, y) => (
              <tr key={y}>
                {row.map((n) => (
                  <td key={n} className="size-8 border border-foreground/40">
                    {n}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
        <div className="space-y-2 leading-snug">
          <p>
            <var>T</var>(<var>x</var>, <var>y</var>) = (<var>M</var>
            <sub>
              <var>x</var> mod 4, <var>y</var> mod 4
            </sub>{" "}
            + ½) / 16
          </p>
          <p>
            ink(<var>x</var>, <var>y</var>) ⇔ <var>L</var>(<var>x</var>,{" "}
            <var>y</var>) &lt; <var>T</var>(<var>x</var>, <var>y</var>)
          </p>
        </div>
      </div>
      <DitheredField
        className="h-28 w-full border border-foreground/40 lg:col-span-2"
        shape="dots"
      />
    </Panel>
  );
}
