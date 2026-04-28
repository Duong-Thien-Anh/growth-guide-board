import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export const LANGUAGES = [
  { code: "en", label: "English", flag: "🇺🇸" },
  { code: "vi", label: "Tiếng Việt", flag: "🇻🇳" },
] as const;
export type LangCode = (typeof LANGUAGES)[number]["code"];

const STORAGE_KEY = "atelier_lang";

type Dict = Record<string, string>;

const en: Dict = {
  "auth.welcome": "Welcome back",
  "auth.subtitle": "Sign in to Atelier CMS",
  "auth.email": "Email",
  "auth.password": "Password",
  "auth.signIn": "Sign in",
  "auth.signingIn": "Signing in…",
  "auth.mockHint": "Mock mode — any credentials will sign you in.",
  "auth.back": "← Back to dashboard",
  "auth.language": "Language",
  "nav.profile": "Profile",
  "nav.settings": "Settings",
  "nav.accounts": "Accounts",
  "nav.signOut": "Sign out",
  "profile.title": "My profile",
  "profile.subtitle": "Your personal information and billing details.",
  "profile.account": "Account",
  "profile.billing": "Billing & contact",
  "profile.name": "Display name",
  "profile.email": "Email",
  "profile.login": "Login",
  "profile.role": "Role",
  "profile.registered": "Registered",
  "profile.firstName": "First name",
  "profile.lastName": "Last name",
  "profile.phone": "Phone",
  "profile.address": "Address",
  "profile.city": "City",
  "profile.country": "Country",
  "profile.save": "Save changes",
  "profile.saved": "Profile updated",
  "accounts.title": "Admin accounts",
  "accounts.subtitle": "Manage administrator access for the workspace.",
  "accounts.invite": "Invite admin",
  "settings.title": "Settings",
  "settings.subtitle": "Manage your workspace and connection to the API.",
  "settings.health": "API health",
  "settings.healthHint": "Check connection to your Laravel backend.",
  "settings.checkNow": "Check now",
  "settings.healthOk": "Connected",
  "settings.healthDown": "Unreachable",
  "settings.healthChecking": "Checking…",
  "common.never": "Never",
};

const vi: Dict = {
  "auth.welcome": "Chào mừng trở lại",
  "auth.subtitle": "Đăng nhập vào Atelier CMS",
  "auth.email": "Email",
  "auth.password": "Mật khẩu",
  "auth.signIn": "Đăng nhập",
  "auth.signingIn": "Đang đăng nhập…",
  "auth.mockHint": "Chế độ mô phỏng — mọi thông tin đều đăng nhập được.",
  "auth.back": "← Về trang quản trị",
  "auth.language": "Ngôn ngữ",
  "nav.profile": "Hồ sơ",
  "nav.settings": "Cài đặt",
  "nav.accounts": "Tài khoản",
  "nav.signOut": "Đăng xuất",
  "profile.title": "Hồ sơ của tôi",
  "profile.subtitle": "Thông tin cá nhân và thanh toán.",
  "profile.account": "Tài khoản",
  "profile.billing": "Thanh toán & liên hệ",
  "profile.name": "Tên hiển thị",
  "profile.email": "Email",
  "profile.login": "Tên đăng nhập",
  "profile.role": "Vai trò",
  "profile.registered": "Ngày đăng ký",
  "profile.firstName": "Tên",
  "profile.lastName": "Họ",
  "profile.phone": "Số điện thoại",
  "profile.address": "Địa chỉ",
  "profile.city": "Thành phố",
  "profile.country": "Quốc gia",
  "profile.save": "Lưu thay đổi",
  "profile.saved": "Đã cập nhật hồ sơ",
  "accounts.title": "Tài khoản quản trị",
  "accounts.subtitle": "Quản lý quyền truy cập của quản trị viên.",
  "accounts.invite": "Mời quản trị viên",
  "settings.title": "Cài đặt",
  "settings.subtitle": "Quản lý không gian và kết nối API.",
  "settings.health": "Tình trạng API",
  "settings.healthHint": "Kiểm tra kết nối tới backend Laravel.",
  "settings.checkNow": "Kiểm tra",
  "settings.healthOk": "Đã kết nối",
  "settings.healthDown": "Không kết nối được",
  "settings.healthChecking": "Đang kiểm tra…",
  "common.never": "Chưa bao giờ",
};

const dicts: Record<LangCode, Dict> = { en, vi };

interface I18nCtx {
  lang: LangCode;
  setLang: (l: LangCode) => void;
  t: (key: string) => string;
}

const Ctx = createContext<I18nCtx>({ lang: "en", setLang: () => {}, t: (k) => k });

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<LangCode>("en");

  useEffect(() => {
    const saved = (typeof window !== "undefined" && localStorage.getItem(STORAGE_KEY)) as LangCode | null;
    if (saved && dicts[saved]) setLangState(saved);
  }, []);

  const setLang = (l: LangCode) => {
    setLangState(l);
    if (typeof window !== "undefined") localStorage.setItem(STORAGE_KEY, l);
  };

  const t = (key: string) => dicts[lang][key] ?? en[key] ?? key;

  return <Ctx.Provider value={{ lang, setLang, t }}>{children}</Ctx.Provider>;
}

export const useI18n = () => useContext(Ctx);
