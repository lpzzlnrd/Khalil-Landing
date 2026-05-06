import { Shell } from "@/components/ui/shell";
import { Eyebrow } from "@/components/ui/eyebrow";
import { Reveal } from "@/components/ui/reveal";

export function ServiceTitle() {
  return (
    <section className="relative border-t border-line py-[clamp(40px,7vw,90px)] text-center">
      <Shell>
        <Reveal>
          <h2 className="font-serif text-[clamp(56px,11vw,168px)] font-light leading-[0.92] tracking-[-0.04em]">
            Carousels{" "}
            <em className="block mt-1.5 text-gold italic font-light">Selling</em>
          </h2>
        </Reveal>
      </Shell>
    </section>
  );
}
