import { Upload, Search, ShieldCheck, Store } from "lucide-react";

const steps = [
  {
    icon: Upload,
    title: "Upload Your Bill",
    description:
      "Take a photo or upload a PDF of your hospital bill. Our system reads it automatically.",
  },
  {
    icon: Search,
    title: "Price Analysis",
    description:
      "Each medicine is compared against the official government price database in real-time.",
  },
  {
    icon: ShieldCheck,
    title: "Get Flagged Items",
    description:
      "Overpriced items exceeding the threshold are flagged with a clear price breakdown.",
  },
  {
    icon: Store,
    title: "Find Alternatives",
    description:
      "Browse recommended pharmacies nearby where you can purchase at fair prices.",
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="px-4 py-16 md:px-6 md:py-24">
      <div className="mx-auto max-w-6xl">
        <div className="mb-12 text-center md:mb-16">
          <h2 className="mb-4 text-balance text-3xl font-bold text-foreground md:text-4xl">
            How It Works
          </h2>
          <p className="mx-auto max-w-2xl text-pretty text-lg text-muted-foreground">
            Four simple steps to ensure you are paying a fair price for your
            medicine.
          </p>
        </div>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, index) => (
            <div key={step.title} className="relative text-center">
              {index < steps.length - 1 && (
                <div className="absolute left-1/2 top-10 hidden h-px w-full bg-border lg:block" />
              )}
              <div className="relative mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-2xl bg-primary/10">
                <step.icon className="h-9 w-9 text-primary" />
                <div className="absolute -right-1 -top-1 flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                  {index + 1}
                </div>
              </div>
              <h3 className="mb-2 text-lg font-semibold text-foreground">
                {step.title}
              </h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
