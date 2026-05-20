import { FadeIn } from "@/components/motion/fade-in";

export function PageIntro({
  title,
  body,
}: {
  title: string;
  body?: string;
}) {
  return (
    <section className="bg-white">
      <div className="site-nav-frame py-28 md:py-32 lg:py-40">
        <FadeIn y={12} amount={0.12}>
          <h1 className="type-section-title max-w-[820px] text-[#101010]">
            {title}
          </h1>
        </FadeIn>
        {body ? (
          <FadeIn delay={0.05} y={8} amount={0.12}>
            <p className="mt-6 max-w-[520px] text-[10.5px] leading-[1.8] text-neutral-500">{body}</p>
          </FadeIn>
        ) : null}
      </div>
    </section>
  );
}
