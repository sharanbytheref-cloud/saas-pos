import { Check, Zap, Star, Rocket, ShieldCheck, Crown } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";
import { cn } from "@/lib/utils";
import {
  formatPlanPrice,
  getPublicPlans,
  type PlanIconKey,
} from "@/lib/plans";

const ICON_BY_KEY: Record<PlanIconKey, LucideIcon> = {
  zap: Zap,
  star: Star,
  rocket: Rocket,
  shield: ShieldCheck,
  crown: Crown,
};

export function PricingTable() {
  const plans = getPublicPlans();

  return (
    <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto px-4">
      {plans.map((plan) => {
        const Icon = ICON_BY_KEY[plan.iconKey];
        const isPaid = plan.price > 0;
        const href = isPaid
          ? `/signup?plan=${plan.key}`
          : "/signup";
        const buttonText = isPaid
          ? `Chọn gói ${plan.displayName}`
          : "Bắt đầu dùng thử";
        const variant = plan.popular ? "default" : "outline";

        return (
          <div
            key={plan.key}
            className={cn(
              "relative flex flex-col p-8 bg-white rounded-[2.5rem] border transition-all duration-500 hover:shadow-2xl hover:shadow-slate-200/50 group",
              plan.popular ? "border-blue-500 shadow-xl ring-1 ring-blue-500/10 scale-105 z-10" : "border-slate-100"
            )}
          >
            {plan.popular && (
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-6 py-1.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-[10px] font-black rounded-full uppercase tracking-widest shadow-lg shadow-blue-500/20">
                Được khuyên dùng
              </div>
            )}

            <div className="mb-8">
              <div className={cn(
                 "size-12 rounded-2xl flex items-center justify-center mb-6 transition-transform group-hover:scale-110",
                 plan.popular ? "bg-blue-500 text-white shadow-lg shadow-blue-500/20" : "bg-slate-50 text-slate-400 border border-slate-100"
              )}>
                 <Icon className="size-5" />
              </div>
              <h3 className="text-xl font-black text-slate-900 mb-2 uppercase tracking-tight">{plan.displayName}</h3>
              <div className="flex items-baseline gap-1">
                <span className="text-5xl font-black tracking-tighter text-slate-900">{formatPlanPrice(plan.price)}</span>
                {isPaid && <span className="text-slate-400 font-bold text-lg">/tháng</span>}
              </div>
              {plan.tagline && (
                <p className="mt-4 text-slate-500 font-medium text-sm leading-relaxed">{plan.tagline}</p>
              )}
            </div>

            <div className="h-px w-full bg-slate-50 mb-8" />

            <ul className="flex-1 space-y-4 mb-10">
              {plan.features.map((feature) => (
                <li key={feature} className="flex items-start gap-3 text-[13px] font-bold text-slate-600">
                  <div className={cn(
                     "mt-0.5 size-5 rounded-full flex items-center justify-center flex-shrink-0 transition-colors",
                     plan.popular ? "bg-blue-50 text-blue-500" : "bg-slate-50 text-slate-300"
                  )}>
                    <Check className="size-3" strokeWidth={4} />
                  </div>
                  {feature}
                </li>
              ))}
            </ul>

            <Link
              href={href}
              className={cn(
                 buttonVariants({ variant, size: "lg" }),
                 "w-full h-14 rounded-2xl font-black text-base transition-all duration-300 flex items-center justify-center",
                 plan.popular
                   ? "bg-blue-600 hover:bg-blue-700 shadow-xl shadow-blue-500/20"
                   : "border-2 border-slate-200 hover:bg-slate-50 hover:border-slate-300"
              )}
            >
              {buttonText}
            </Link>
          </div>
        );
      })}
    </div>
  );
}
