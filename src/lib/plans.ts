/**
 * Single source of truth for subscription plans.
 *
 * Three places used to disagree on what a "Pro" plan costs and what it
 * included:
 *   1. This file (PLANS)
 *   2. The public pricing table on the landing page
 *      (src/components/pricing-table.tsx — 299k / 599k, plan keys "basic" /
 *      "premium" which doesn't even exist in the data model)
 *   3. The in-app upgrade dialog
 *      (src/app/(app)/settings/subscription/upgrade-button.tsx —
 *      199k / 499k / 999k)
 *   4. The super-admin revenue calculation (src/app/admin/page.tsx — used
 *      a hardcoded `if (plan === 'pro') return 100000` ladder that
 *      drifted from this file silently)
 *
 * Every consumer now reads from PLANS so a price change here propagates
 * everywhere. Display-only fields (`tagline`, `popular`, `public`,
 * `displayName`, `iconKey`) live on the same definition so the public
 * pricing UI and the in-app upgrade UI can render directly. Icons are
 * referenced by string keys (mapped to lucide components in the
 * consuming component) so this file stays import-free of React.
 *
 * NOTE on real prices: the historical values in this file (50k / 100k /
 * 150k) almost certainly do not match what the business actually wants
 * to charge — the landing page advertised 299k / 599k and the upgrade
 * dialog charged 199k / 499k / 999k. Please pick the canonical numbers
 * here before going live.
 */

export type PlanKey = "trial" | "basic" | "pro" | "professional";

export type PlanIconKey =
  | "zap"
  | "star"
  | "rocket"
  | "shield"
  | "crown";

export type PlanDefinition = {
  /** The DB value (Tenant.subscriptionPlan) for this plan. */
  key: PlanKey;
  /** Short name shown in admin tables, badges, etc. */
  name: string;
  /** Longer marketing name shown on the public pricing table. */
  displayName: string;
  /** VND per month. 0 for trial. */
  price: number;
  maxProducts: number;
  maxUsers: number;
  maxCustomers: number;
  maxBranches: number;
  maxDevices: number;
  canCustomPrint: boolean;
  /** Bullet list of features for the in-app upgrade dialog. */
  features: string[];
  /** Whether this plan is shown on the public landing pricing table. */
  public: boolean;
  /** Mark this plan with the "Recommended" ribbon on the pricing table. */
  popular?: boolean;
  /** Short tagline shown under the plan name on the pricing table. */
  tagline?: string;
  /** Icon identifier; the consumer maps this to a React icon component. */
  iconKey: PlanIconKey;
};

export const PLANS: Record<PlanKey, PlanDefinition> = {
  trial: {
    key: "trial",
    name: "Dùng thử 14 ngày",
    displayName: "Dùng thử",
    price: 0,
    maxProducts: 50,
    maxUsers: 2,
    maxCustomers: 100,
    maxBranches: 1,
    maxDevices: 3,
    canCustomPrint: true,
    features: ["Đầy đủ tính năng Pro", "Hỗ trợ 14 ngày"],
    public: true,
    tagline: "Trải nghiệm đầy đủ tính năng trong 14 ngày.",
    iconKey: "zap",
  },
  basic: {
    key: "basic",
    name: "Cơ bản",
    displayName: "Cơ bản",
    price: 50000,
    maxProducts: 100,
    maxUsers: 2,
    maxCustomers: 500,
    maxBranches: 1,
    maxDevices: 3,
    canCustomPrint: false,
    features: [
      "Quản lý kho (100 SP)",
      "Bán hàng POS",
      "Quản lý khách hàng",
      "1 Cửa hàng",
      "3 Thiết bị đăng nhập",
    ],
    public: true,
    popular: true,
    tagline: "Phù hợp cho cửa hàng nhỏ và mới bắt đầu.",
    iconKey: "star",
  },
  pro: {
    key: "pro",
    name: "Pro",
    displayName: "Pro",
    price: 100000,
    maxProducts: 999999,
    maxUsers: 15,
    maxCustomers: 999999,
    maxBranches: 2,
    maxDevices: 15,
    canCustomPrint: true,
    features: [
      "Không giới hạn Sản phẩm/Khách hàng",
      "Tùy biến mẫu in (Inbill)",
      "Quản lý 2 cửa hàng chi nhánh",
      "15 Thiết bị đăng nhập",
      "Báo cáo chuyên sâu",
    ],
    public: false,
    tagline: "Cho cửa hàng vừa, cần tùy biến và 2 chi nhánh.",
    iconKey: "shield",
  },
  professional: {
    key: "professional",
    name: "Chuyên nghiệp",
    displayName: "Chuyên nghiệp",
    price: 150000,
    maxProducts: 999999,
    maxUsers: 999,
    maxCustomers: 999999,
    maxBranches: 5,
    maxDevices: 999,
    canCustomPrint: true,
    features: [
      "Tất cả tính năng gói Pro",
      "Quản lý 5 cửa hàng chi nhánh",
      "Không giới hạn thiết bị",
      "Ưu tiên cập nhật tính năng mới",
      "Hỗ trợ ưu tiên 24/7",
    ],
    public: true,
    tagline: "Giải pháp toàn diện cho chuỗi cửa hàng.",
    iconKey: "rocket",
  },
};

export function getPlan(key: string): PlanDefinition {
  return PLANS[key as PlanKey] || PLANS.trial;
}

/**
 * Plans shown on the public pricing table, in display order.
 */
export function getPublicPlans(): PlanDefinition[] {
  return Object.values(PLANS).filter((p) => p.public);
}

/**
 * Format a VND amount for display. Returns "0đ" for free / zero prices,
 * and a thousand-separated number with "đ" suffix otherwise (e.g.
 * "50,000đ"). Keep this in lib/plans.ts so price formatting stays
 * consistent across the landing page, admin pages, and the upgrade
 * dialog.
 */
export function formatPlanPrice(amountVnd: number): string {
  if (amountVnd <= 0) return "0đ";
  return `${amountVnd.toLocaleString("vi-VN")}đ`;
}
