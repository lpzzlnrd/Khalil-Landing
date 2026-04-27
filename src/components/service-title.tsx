import { Shell } from "@/components/ui/shell";
import { Eyebrow } from "@/components/ui/eyebrow";
import { Reveal } from "@/components/ui/reveal";

export function ServiceTitle() {
  return (
    <section className="relative border-t border-line py-[clamp(80px,14vw,180px)] pb-[clamp(60px,10vw,140px)] text-center">
      <Shell>
        <Reveal>
          <Eyebrow className="mb-7">El Servicio</Eyebrow>
          <h2 className="mt-7 font-serif text-[clamp(56px,11vw,168px)] font-light leading-[0.92] tracking-[-0.04em]">
            Carousels{" "}
            <em className="block mt-1.5 text-gold italic font-light">Selling</em>
          </h2>
          <div className="mt-10 flex flex-wrap justify-center gap-8">
            {["Adquisición paralela", "Done-for-you", "Escalable"].map((tag) => (
              <span
                key={tag}
                className="flex items-center gap-2.5 font-mono text-[11px] uppercase tracking-[0.22em] text-muted before:h-[5px] before:w-[5px] before:rounded-full before:bg-gold"
              >
                {tag}
              </span>
            ))}
          </div>
        </Reveal>
      </Shell>
    </section>
  );
}
