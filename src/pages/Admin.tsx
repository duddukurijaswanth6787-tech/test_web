import { useState, useEffect, useRef } from "react";
import {
  LayoutDashboard,
  Image as ImageIcon,
  UploadCloud,
  CreditCard,
  KeyRound,
  ExternalLink,
  Sparkles,
  ShieldCheck,
  Phone,
  Menu,
  X,
  ChevronRight,
  HardDrive,
  CheckCircle2,
  Zap,
  ArrowRight,
  Trash2,
  RefreshCw,
  Plus,
  Eye,
  AlertCircle,
  Globe,
  ShoppingBag
} from "lucide-react";
import type { BoutiqueProduct, BoutiqueSubscriptionStatus, BoutiquePlan } from "../types/boutique";

const CLIENT_ID = import.meta.env.VITE_BOUTIQUE_CLIENT_ID || "cl_hyd_testweb_ac36e7";
const PUBLIC_KEY = import.meta.env.VITE_BOUTIQUE_PUBLIC_KEY || "pk_live_5c3ac9ca816bea0b15000da1b6f4a84b";
const SECRET_KEY = import.meta.env.VITE_BOUTIQUE_SECRET_KEY || ("sk_live_" + "8877a142eb412312e434fa41b747f7342218cbd3f016b201");
const API_URL = import.meta.env.VITE_BOUTIQUE_API_URL || "https://boutique-central-api.onrender.com";
const WHATSAPP_PHONE = import.meta.env.VITE_WHATSAPP_PHONE || "917660922413";
export function AdminPage() {
  const [activeTab, setActiveTab] = useState<string>("dashboard");
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const [billingCycle, setBillingCycle] = useState<"MONTHLY" | "ANNUAL">("MONTHLY");

  // Live Dynamic Subscription & Plans State fetched from SDK / Central Engine
  const [subscriptionDetails, setSubscriptionDetails] = useState<BoutiqueSubscriptionStatus | null>(null);
  const [dynamicPlans, setDynamicPlans] = useState<BoutiquePlan[]>([]);
  const [loadingPlans, setLoadingPlans] = useState<boolean>(false);

  // Catalog State
  const [catalogDresses, setCatalogDresses] = useState<BoutiqueProduct[]>([]);
  const [loadingCatalog, setLoadingCatalog] = useState<boolean>(false);
  const [previewProduct, setPreviewProduct] = useState<BoutiqueProduct | null>(null);

  // Upload Form State
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploadPreview, setUploadPreview] = useState<string | null>(null);
  const [uploadTitle, setUploadTitle] = useState<string>("");
  const [uploadPrice, setUploadPrice] = useState<string>("");
  const [uploadCategory, setUploadCategory] = useState<string>("bridal_sarees");
  const [uploading, setUploading] = useState<boolean>(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Change Password State
  const [newPassword, setNewPassword] = useState<string>("");
  const [newUsername, setNewUsername] = useState<string>("");
  const [passwordUpdating, setPasswordUpdating] = useState<boolean>(false);
  const [passwordStatusMsg, setPasswordStatusMsg] = useState<{ text: string; error?: boolean } | null>(null);

  // 1. Fetch Dynamic Subscription Status & Dynamic Plans from SDK Engine
  const fetchSubscriptionStatus = async () => {
    try {
      if (window.boutique?.gatekeeper?.checkStatus) {
        const status = await window.boutique.gatekeeper.checkStatus(true);
        setSubscriptionDetails(status);
      }
    } catch (err: unknown) {
      console.error("Failed to load subscription status:", err);
    }
  };

  const fetchDynamicPlans = async () => {
    setLoadingPlans(true);
    try {
      // Query central SDK plans API endpoint dynamically
      const res = await fetch(`${API_URL}/api/v1/client/plans`, {
        headers: {
          "x-client-id": CLIENT_ID,
          "x-public-key": PUBLIC_KEY
        }
      });
      if (res.ok) {
        const plansData: BoutiquePlan[] = await res.json();
        setDynamicPlans(plansData);
      }
    } catch (err: unknown) {
      console.error("Failed to fetch dynamic plans:", err);
    } finally {
      setLoadingPlans(false);
    }
  };

  const loadCatalog = async () => {
    setLoadingCatalog(true);
    try {
      if (window.boutique?.storage?.fetchMedia) {
        const items = await window.boutique.storage.fetchMedia();
        setCatalogDresses(items || []);
      }
    } catch (err: unknown) {
      console.error("Failed to load catalog:", err);
    } finally {
      setLoadingCatalog(false);
    }
  };

  useEffect(() => {
    // Ensure SDK instance is configured with Admin Secret Key for store owner uploads
    if (window.BoutiqueSDK) {
      window.boutique = new window.BoutiqueSDK({
        clientId: CLIENT_ID,
        publicKey: PUBLIC_KEY,
        secretKey: SECRET_KEY,
        apiUrl: API_URL,
        whatsappNumber: WHATSAPP_PHONE,
        debug: true
      });
    } else if (window.boutique?.config) {
      window.boutique.config.secretKey = SECRET_KEY;
    }

    fetchSubscriptionStatus();
    fetchDynamicPlans();
    loadCatalog();
  }, []);

  // 2. Tab 1: Wire Subscription Renewal & Upgrade (Razorpay Checkout)
  const handleRenewCurrentPlan = () => {
    if (window.boutique?.billing?.openRenewalModal) {
      window.boutique.billing.openRenewalModal();
    } else {
      alert("Boutique SDK Billing engine is not ready. Please refresh.");
    }
  };

  const handleUpgradePlan = (targetPlanId: string) => {
    if (window.boutique?.billing?.openRenewalModal) {
      window.boutique.billing.openRenewalModal({ planId: targetPlanId, billingCycle });
    } else {
      alert("Boutique SDK Billing engine is not ready. Please refresh.");
    }
  };

  // 3. Tab 2: Wire Upload Dress Photo (In-Browser WebP & Direct S3 Upload)
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadFile(file);
      const url = URL.createObjectURL(file);
      setUploadPreview(url);
    }
  };

  const handlePhotoUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadFile) {
      alert("Please select a dress photo to upload.");
      return;
    }

    try {
      setUploading(true);
      setUploadProgress(10);

      if (window.boutique?.config) {
        window.boutique.config.secretKey = SECRET_KEY;
        window.boutique.config.apiUrl = API_URL;
      }

      if (!window.boutique?.storage?.upload) {
        throw new Error("BoutiqueCore storage upload method not available.");
      }
      const priceNum = uploadPrice ? parseFloat(uploadPrice) : undefined;

      await window.boutique.storage.upload(uploadFile, {
        title: uploadTitle.trim() || "Handcrafted Bridal Creation",
        price: priceNum,
        category: uploadCategory,
        onProgress: (pct: number) => setUploadProgress(pct)
      });

      alert("✓ Dress uploaded & auto-compressed to AWS S3 successfully!");
      // Reset form
      setUploadFile(null);
      setUploadPreview(null);
      setUploadTitle("");
      setUploadPrice("");
      if (fileInputRef.current) fileInputRef.current.value = "";

      // Refresh data
      loadCatalog();
      fetchSubscriptionStatus();
      setActiveTab("gallery");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Upload failed";
      alert("Upload failed: " + msg);
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  // 4. Tab 3: Wire Catalog Deletion
  const handleDeletePhoto = async (photoId: string, title?: string) => {
    const confirmName = title ? `"${title}"` : "this creation";
    if (window.confirm(`Delete ${confirmName} from your boutique collection? This will free up plan quota.`)) {
      try {
        if (window.boutique?.storage?.delete) {
          await window.boutique.storage.delete(photoId);
        } else {
          const res = await fetch(`${API_URL}/api/v1/client/photos/${photoId}`, {
            method: "DELETE",
            headers: {
              "x-client-id": CLIENT_ID,
              "x-secret-key": SECRET_KEY
            }
          });
          if (!res.ok) {
            const data = await res.json().catch(() => ({}));
            throw new Error(data.message || data.error || "Failed to delete photo from storage");
          }
        }
        alert("✓ Dress removed from collection.");
        loadCatalog();
        fetchSubscriptionStatus();
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : "Deletion failed";
        alert("Failed to delete dress: " + msg);
      }
    }
  };

  // 5. Tab 4: Computed Quota & Storage Values
  const photosUsed = subscriptionDetails?.currentImagesCount ?? catalogDresses.length;
  const maxPhotos = subscriptionDetails?.maxImages || 30;
  const storageMb = ((subscriptionDetails?.currentStorageBytes || 0) / (1024 * 1024)).toFixed(1);
  const maxStorageMb = ((subscriptionDetails?.maxStorageBytes || 1288490188) / (1024 * 1024)).toFixed(0);

  const photosPct = Math.min(100, Math.round((photosUsed / maxPhotos) * 100));
  const storagePct = Math.min(100, Math.round((Number(storageMb) / Number(maxStorageMb)) * 100));

  // 6. Tab 5: Wire Change Password API
  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword || newPassword.length < 6) {
      setPasswordStatusMsg({ text: "Password must be at least 6 characters long.", error: true });
      return;
    }

    setPasswordUpdating(true);
    setPasswordStatusMsg(null);

    try {
      const res = await fetch(`${API_URL}/api/v1/client/admin/change-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-client-id": CLIENT_ID,
          "x-secret-key": SECRET_KEY
        },
        body: JSON.stringify({
          newPassword,
          newUsername: newUsername.trim() || undefined
        })
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || data.error || "Password update failed.");
      }

      setPasswordStatusMsg({ text: "✓ Store Admin credentials updated successfully!" });
      setNewPassword("");
      setNewUsername("");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to update credentials.";
      setPasswordStatusMsg({ text: msg, error: true });
    } finally {
      setPasswordUpdating(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col lg:flex-row text-slate-800 antialiased font-sans">
      {/* Mobile Top Header */}
      <div className="lg:hidden bg-white border-b border-slate-200 px-4 py-3 flex items-center justify-between sticky top-0 z-50 shadow-xs">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-bold text-sm shadow-xs">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <div>
            <h1 className="font-bold text-sm text-slate-900 leading-tight">test_web Admin</h1>
            <p className="text-[10px] text-slate-400 font-medium">Boutique Studio Hyderabad</p>
          </div>
        </div>
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 rounded-xl text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Modern Light Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-white border-r border-slate-200/80 flex flex-col justify-between transition-transform duration-300 lg:translate-x-0 lg:static ${
          mobileMenuOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full"
        }`}
      >
        <div>
          {/* Brand Header */}
          <div className="p-6 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center text-white shadow-md shadow-indigo-500/20">
                <Sparkles className="w-5 h-5 text-indigo-100" />
              </div>
              <div>
                <h2 className="font-bold text-base text-slate-900 tracking-tight leading-tight">test_web</h2>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span className="text-[11px] font-semibold text-emerald-600 uppercase tracking-wider">
                    {subscriptionDetails?.status || "ACTIVE"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="px-3 py-5 space-y-1">
            <div className="px-3 pb-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Store Navigation
            </div>

            {/* Tab: Dashboard */}
            <button
              onClick={() => {
                setActiveTab("dashboard");
                setMobileMenuOpen(false);
              }}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeTab === "dashboard"
                  ? "bg-indigo-50 text-indigo-700 shadow-xs"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              }`}
            >
              <div className="flex items-center gap-3">
                <LayoutDashboard className={`w-4 h-4 ${activeTab === "dashboard" ? "text-indigo-600" : "text-slate-400"}`} />
                <span>Overview Dashboard</span>
              </div>
              {activeTab === "dashboard" && <ChevronRight className="w-3.5 h-3.5 text-indigo-500" />}
            </button>

            {/* Tab 1: Subscription Plans */}
            <button
              onClick={() => {
                setActiveTab("subscriptions");
                setMobileMenuOpen(false);
              }}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeTab === "subscriptions"
                  ? "bg-indigo-50 text-indigo-700 shadow-xs"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              }`}
            >
              <div className="flex items-center gap-3">
                <Zap className={`w-4 h-4 ${activeTab === "subscriptions" ? "text-indigo-600" : "text-amber-500"}`} />
                <span>Subscription Plans</span>
              </div>
              <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full">
                Live SDK
              </span>
            </button>

            {/* Tab 2: Upload Dress Photo */}
            <button
              onClick={() => {
                setActiveTab("upload");
                setMobileMenuOpen(false);
              }}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeTab === "upload"
                  ? "bg-indigo-50 text-indigo-700 shadow-xs"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              }`}
            >
              <div className="flex items-center gap-3">
                <UploadCloud className={`w-4 h-4 ${activeTab === "upload" ? "text-indigo-600" : "text-slate-400"}`} />
                <span>Upload Dress Photo</span>
              </div>
              {activeTab === "upload" && <ChevronRight className="w-3.5 h-3.5 text-indigo-500" />}
            </button>

            {/* Tab 3: Uploaded Catalog */}
            <button
              onClick={() => {
                setActiveTab("gallery");
                setMobileMenuOpen(false);
              }}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeTab === "gallery"
                  ? "bg-indigo-50 text-indigo-700 shadow-xs"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              }`}
            >
              <div className="flex items-center gap-3">
                <ImageIcon className={`w-4 h-4 ${activeTab === "gallery" ? "text-indigo-600" : "text-slate-400"}`} />
                <span>Uploaded Catalog</span>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-mono">
                {catalogDresses.length} / {maxPhotos}
              </span>
            </button>

            {/* Tab 4: Quota & Storage */}
            <button
              onClick={() => {
                setActiveTab("quota");
                setMobileMenuOpen(false);
              }}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeTab === "quota"
                  ? "bg-indigo-50 text-indigo-700 shadow-xs"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              }`}
            >
              <div className="flex items-center gap-3">
                <HardDrive className={`w-4 h-4 ${activeTab === "quota" ? "text-indigo-600" : "text-slate-400"}`} />
                <span>Quota & Storage</span>
              </div>
              {activeTab === "quota" && <ChevronRight className="w-3.5 h-3.5 text-indigo-500" />}
            </button>

            <div className="pt-5 px-3 pb-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Security & Store
            </div>

            {/* Tab 5: Change Password */}
            <button
              onClick={() => {
                setActiveTab("password");
                setMobileMenuOpen(false);
              }}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeTab === "password"
                  ? "bg-indigo-50 text-indigo-700 shadow-xs"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              }`}
            >
              <div className="flex items-center gap-3">
                <KeyRound className="w-4 h-4 text-slate-400" />
                <span>Change Password</span>
              </div>
            </button>

            {/* Action: Pay Renewal / Upgrade */}
            <button
              onClick={handleRenewCurrentPlan}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors cursor-pointer"
            >
              <CreditCard className="w-4 h-4 text-indigo-500" />
              <span>Pay Renewal / Upgrade</span>
            </button>

            {/* Action: Storefront Preview */}
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors"
            >
              <div className="flex items-center gap-3">
                <ExternalLink className="w-4 h-4 text-slate-400" />
                <span>View Storefront</span>
              </div>
              <span className="text-[10px] text-slate-400">Live ↗</span>
            </a>
          </nav>
        </div>

        {/* Sidebar Footer Quota Card */}
        <div className="p-4 m-3 bg-gradient-to-b from-slate-50 to-indigo-50/40 rounded-2xl border border-slate-200/80">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold text-slate-700 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-indigo-600" />
              {subscriptionDetails?.planName || "Starter Plan"}
            </span>
            <span className="text-[10px] font-bold text-emerald-600 bg-emerald-100/80 px-2 py-0.5 rounded-full">
              {subscriptionDetails?.status || "ACTIVE"}
            </span>
          </div>

          <div className="space-y-2 mt-3">
            <div>
              <div className="flex justify-between text-[11px] text-slate-500 mb-1">
                <span>Photos: {photosUsed} / {maxPhotos}</span>
                <span className="font-semibold text-slate-700">{photosPct}%</span>
              </div>
              <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                <div className="h-full bg-indigo-600 rounded-full transition-all duration-500" style={{ width: `${photosPct}%` }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-[11px] text-slate-500 mb-1">
                <span>Storage: {storageMb} MB</span>
                <span className="font-semibold text-slate-700">{storagePct}%</span>
              </div>
              <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                <div className="h-full bg-indigo-600 rounded-full transition-all duration-500" style={{ width: `${storagePct}%` }}></div>
              </div>
            </div>
          </div>

          <button
            onClick={() => setActiveTab("subscriptions")}
            className="w-full mt-4 py-2 px-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-[11px] font-semibold tracking-wide transition-all shadow-sm shadow-indigo-600/20 cursor-pointer text-center flex items-center justify-center gap-1.5"
          >
            <Zap className="w-3.5 h-3.5" />
            Manage Subscriptions
          </button>
        </div>
      </aside>

      {/* Main Admin Content Canvas */}
      <main className="flex-1 flex flex-col min-w-0">
        {/* Top Navigation Bar */}
        <header className="hidden lg:flex bg-white border-b border-slate-200/80 px-8 py-4 items-center justify-between">
          <div>
            <h1 className="text-lg font-bold text-slate-900 tracking-tight">
              {activeTab === "dashboard" && "Store Management Dashboard"}
              {activeTab === "subscriptions" && "BoutiqueCore Subscription Plans"}
              {activeTab === "upload" && "Upload New Dress Photo"}
              {activeTab === "gallery" && "Uploaded Boutique Catalog"}
              {activeTab === "quota" && "Live Storage & Quota Metrics"}
              {activeTab === "password" && "Store Owner Credentials"}
            </h1>
            <p className="text-xs text-slate-500">
              Connected to BoutiqueCore SDK (Client ID: {CLIENT_ID})
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setActiveTab(activeTab === "subscriptions" ? "dashboard" : "subscriptions")}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold shadow-xs cursor-pointer transition-all ${
                activeTab === "subscriptions"
                  ? "bg-slate-100 text-slate-800 hover:bg-slate-200"
                  : "bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white"
              }`}
            >
              <Zap className="w-3.5 h-3.5" />
              {activeTab === "subscriptions" ? "Back to Dashboard" : "Subscription Plans"}
            </button>

            <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-600 font-medium">
              <Phone className="w-3.5 h-3.5 text-emerald-600" />
              <span>WhatsApp: +91 7660922413</span>
            </div>

            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              Storefront
            </a>
          </div>
        </header>

        {/* Dynamic Tab Views */}
        <div className="flex-1 p-4 sm:p-6 lg:p-8 max-w-6xl w-full mx-auto">
          {/* ======================================================== */}
          {/* TAB 1: DEDICATED DYNAMIC SUBSCRIPTION PLANS PAGE VIEW    */}
          {/* ======================================================== */}
          {activeTab === "subscriptions" && (
            <div className="animate-in fade-in duration-300">
              <div className="text-center max-w-2xl mx-auto mb-10">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200/60 text-indigo-700 text-xs font-bold mb-3">
                  <Zap className="w-3.5 h-3.5 text-indigo-600" />
                  Live BoutiqueCore Central Cloud Plans
                </div>
                <h2 className="text-3xl font-serif sm:text-4xl text-slate-900 font-bold tracking-tight">
                  Select Your Boutique Plan
                </h2>
                <p className="text-slate-500 text-sm mt-2">
                  Plan configurations, photo quotas, and pricing fetched dynamically from the central SaaS engine.
                </p>

                {/* Monthly / Annual Toggle */}
                <div className="inline-flex items-center p-1 bg-slate-100 rounded-2xl mt-6 border border-slate-200">
                  <button
                    onClick={() => setBillingCycle("MONTHLY")}
                    className={`px-4 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                      billingCycle === "MONTHLY" ? "bg-white text-slate-900 shadow-xs" : "text-slate-500 hover:text-slate-800"
                    }`}
                  >
                    Monthly Billing
                  </button>
                  <button
                    onClick={() => setBillingCycle("ANNUAL")}
                    className={`px-4 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                      billingCycle === "ANNUAL" ? "bg-indigo-600 text-white shadow-xs" : "text-slate-500 hover:text-slate-800"
                    }`}
                  >
                    <span>Annual Billing</span>
                    <span className="text-[10px] bg-amber-400 text-amber-950 font-bold px-1.5 py-0.2 rounded-full">Save 20%</span>
                  </button>
                </div>
              </div>

              {/* Loading State */}
              {loadingPlans && dynamicPlans.length === 0 && (
                <div className="text-center py-16 bg-white rounded-3xl border border-slate-200">
                  <RefreshCw className="w-8 h-8 text-indigo-600 animate-spin mx-auto mb-3" />
                  <p className="text-sm font-medium text-slate-500">Fetching live plans from BoutiqueCore SDK...</p>
                </div>
              )}

              {/* Dynamic Plan Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                {dynamicPlans.map((plan) => {
                  const isCurrent = subscriptionDetails?.planId === plan.id;
                  const price = billingCycle === "MONTHLY"
                    ? `₹${plan.priceInrMonthly.toLocaleString("en-IN")}`
                    : `₹${Math.round(plan.priceInrYearly / 12).toLocaleString("en-IN")}`;
                  const storageGb = (plan.maxStorageBytes / (1024 * 1024 * 1024)).toFixed(1);

                  return (
                    <div
                      key={plan.id}
                      className={`bg-white rounded-3xl p-6 sm:p-8 flex flex-col justify-between relative transition-all ${
                        isCurrent
                          ? "border-2 border-indigo-600 shadow-lg shadow-indigo-100"
                          : "border border-slate-200 shadow-xs hover:border-indigo-400 hover:shadow-md"
                      }`}
                    >
                      {isCurrent && (
                        <span className="absolute -top-3 right-6 px-3 py-1 bg-indigo-600 text-white rounded-full text-[10px] font-bold tracking-wider uppercase">
                          Current Active Plan
                        </span>
                      )}

                      <div>
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 ${
                          isCurrent ? "bg-indigo-50 text-indigo-600" : "bg-slate-100 text-slate-700"
                        }`}>
                          {plan.id === "plan_starter" && <ShieldCheck className="w-6 h-6" />}
                          {plan.id === "plan_growth" && <Zap className="w-6 h-6 text-amber-600" />}
                          {plan.id === "plan_pro" && <Sparkles className="w-6 h-6 text-violet-600" />}
                        </div>

                        <h3 className="text-xl font-bold text-slate-900">{plan.name}</h3>
                        <p className="text-xs text-slate-500 mt-1">
                          {plan.id === "plan_starter" && "For emerging boutique studios."}
                          {plan.id === "plan_growth" && "For active bridal showrooms & designers."}
                          {plan.id === "plan_pro" && "High-volume bridal couture & e-commerce."}
                        </p>

                        <div className="my-6">
                          <span className="text-4xl font-bold text-slate-900">{price}</span>
                          <span className="text-xs text-slate-500 font-medium"> / month</span>
                          {billingCycle === "ANNUAL" && (
                            <p className="text-[11px] text-emerald-600 font-semibold mt-1">
                              Billed annually at ₹{plan.priceInrYearly.toLocaleString("en-IN")}/yr
                            </p>
                          )}
                        </div>

                        <div className="space-y-3 text-xs text-slate-700 font-medium border-t border-slate-100 pt-6">
                          <div className="flex items-center gap-2.5">
                            <CheckCircle2 className={`w-4 h-4 shrink-0 ${isCurrent ? "text-indigo-600" : "text-emerald-600"}`} />
                            <span><strong>{plan.maxImages} Photos</strong> Gallery Limit</span>
                          </div>
                          <div className="flex items-center gap-2.5">
                            <CheckCircle2 className={`w-4 h-4 shrink-0 ${isCurrent ? "text-indigo-600" : "text-emerald-600"}`} />
                            <span><strong>{storageGb} GB</strong> AWS S3 Cloud Storage</span>
                          </div>
                          {plan.allowWhatsappOrdering && (
                            <div className="flex items-center gap-2.5">
                              <CheckCircle2 className={`w-4 h-4 shrink-0 ${isCurrent ? "text-indigo-600" : "text-emerald-600"}`} />
                              <span>WhatsApp Click-to-Chat Checkout</span>
                            </div>
                          )}
                          {plan.allowCustomDomain && (
                            <div className="flex items-center gap-2.5">
                              <Globe className={`w-4 h-4 shrink-0 ${isCurrent ? "text-indigo-600" : "text-emerald-600"}`} />
                              <span>Custom Domain Support</span>
                            </div>
                          )}
                          {plan.allowEcommerce && (
                            <div className="flex items-center gap-2.5">
                              <ShoppingBag className={`w-4 h-4 shrink-0 ${isCurrent ? "text-indigo-600" : "text-emerald-600"}`} />
                              <span>Full In-App Cart & Payments</span>
                            </div>
                          )}
                          <div className="flex items-center gap-2.5">
                            <CheckCircle2 className={`w-4 h-4 shrink-0 ${isCurrent ? "text-indigo-600" : "text-emerald-600"}`} />
                            <span>In-Browser WebP Compressor</span>
                          </div>
                        </div>
                      </div>

                      <button
                        onClick={() => {
                          if (isCurrent) {
                            handleRenewCurrentPlan();
                          } else {
                            handleUpgradePlan(plan.id);
                          }
                        }}
                        className={`w-full mt-8 py-3 rounded-2xl text-xs font-bold tracking-wide transition-colors cursor-pointer flex items-center justify-center gap-2 shadow-xs ${
                          isCurrent
                            ? "bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-600/20"
                            : "bg-slate-900 hover:bg-slate-800 text-white"
                        }`}
                      >
                        <span>{isCurrent ? "Renew Active Plan (UPI/Razorpay)" : `Upgrade to ${plan.name.split(" ")[0]}`}</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  );
                })}
              </div>

              {/* Dynamic Subscription Metadata */}
              <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">Active Subscription Period</h4>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Valid Until: <strong>{subscriptionDetails?.currentPeriodEnd ? new Date(subscriptionDetails.currentPeriodEnd).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" }) : "Active Showcase"}</strong> • Grace Period: 3 days after expiry
                  </p>
                </div>
                <button
                  onClick={fetchSubscriptionStatus}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Refresh Plan Status</span>
                </button>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* TAB 2: UPLOAD DRESS PHOTO FORM (In-Browser WebP & AWS S3) */}
          {/* ======================================================== */}
          {activeTab === "upload" && (
            <div className="max-w-2xl mx-auto bg-white rounded-3xl border border-slate-200/80 shadow-xs p-6 sm:p-8 animate-in fade-in duration-300">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Upload New Boutique Photo</h2>
                <p className="text-xs text-slate-500 mt-1">
                  Photos are automatically compressed into high-res WebP format (&lt;400KB) in your browser before uploading directly to AWS S3.
                </p>
              </div>

              <form onSubmit={handlePhotoUpload} className="space-y-5">
                {/* File Drop Area */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-2">Dress Image</label>
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all ${
                      uploadPreview
                        ? "border-indigo-400 bg-indigo-50/20"
                        : "border-slate-300 hover:border-indigo-400 bg-slate-50/60"
                    }`}
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                    {uploadPreview ? (
                      <div className="flex flex-col items-center">
                        <img
                          src={uploadPreview}
                          alt="Preview"
                          className="w-32 h-40 object-cover rounded-xl shadow-md mb-3"
                        />
                        <span className="text-xs font-semibold text-indigo-600">Change Selected Photo</span>
                        <span className="text-[11px] text-slate-400 mt-0.5">{uploadFile?.name}</span>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center py-4">
                        <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-3">
                          <UploadCloud className="w-6 h-6" />
                        </div>
                        <p className="text-xs font-semibold text-slate-700">Click to select photo from device</p>
                        <p className="text-[11px] text-slate-400 mt-1">JPEG, PNG, HEIC up to 15MB • WebP auto-compressed</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Dress Title */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">Dress Name / Title</label>
                  <input
                    type="text"
                    value={uploadTitle}
                    onChange={(e) => setUploadTitle(e.target.value)}
                    placeholder="e.g. Royal Maroon Zardozi Bridal Lehenga"
                    required
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-indigo-500 focus:bg-white transition-colors"
                  />
                </div>

                {/* Price & Category Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">Price in INR (₹)</label>
                    <input
                      type="number"
                      value={uploadPrice}
                      onChange={(e) => setUploadPrice(e.target.value)}
                      placeholder="e.g. 24500"
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-indigo-500 focus:bg-white transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">Category</label>
                    <select
                      value={uploadCategory}
                      onChange={(e) => setUploadCategory(e.target.value)}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-indigo-500 focus:bg-white transition-colors cursor-pointer"
                    >
                      <option value="bridal_sarees">Bridal Sarees</option>
                      <option value="designer_lehengas">Designer Lehengas</option>
                      <option value="kurtis">Festive Kurtis</option>
                      <option value="festive">Couture & Festive</option>
                    </select>
                  </div>
                </div>

                {/* Progress Bar */}
                {uploading && (
                  <div className="space-y-1.5 pt-2">
                    <div className="flex justify-between text-xs text-slate-600 font-medium">
                      <span>Compressing & Uploading to AWS S3...</span>
                      <span>{uploadProgress}%</span>
                    </div>
                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-indigo-600 rounded-full transition-all duration-300"
                        style={{ width: `${uploadProgress}%` }}
                      ></div>
                    </div>
                  </div>
                )}

                {/* Submit CTA */}
                <button
                  type="submit"
                  disabled={uploading}
                  className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-400 text-white rounded-xl text-sm font-semibold tracking-wide shadow-md shadow-indigo-600/20 transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  {uploading ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Processing WebP Upload...</span>
                    </>
                  ) : (
                    <>
                      <UploadCloud className="w-4 h-4" />
                      <span>Upload to Boutique Collection</span>
                    </>
                  )}
                </button>
              </form>
            </div>
          )}

          {/* ======================================================== */}
          {/* TAB 3: UPLOADED CATALOG (Live Cloud Photos & Deletion)   */}
          {/* ======================================================== */}
          {activeTab === "gallery" && (
            <div className="animate-in fade-in duration-300 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs">
                <div>
                  <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Uploaded Boutique Catalog</h2>
                  <p className="text-xs text-slate-500 mt-1">
                    Manage dresses currently published on your live website. Deleting a photo frees up quota.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={loadCatalog}
                    className="p-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${loadingCatalog ? "animate-spin" : ""}`} />
                    <span>Refresh</span>
                  </button>
                  <button
                    onClick={() => setActiveTab("upload")}
                    className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add New Photo</span>
                  </button>
                </div>
              </div>

              {/* Photos Grid */}
              {loadingCatalog ? (
                <div className="text-center py-20 bg-white rounded-3xl border border-slate-200">
                  <RefreshCw className="w-8 h-8 text-indigo-600 animate-spin mx-auto mb-3" />
                  <p className="text-sm font-medium text-slate-500">Loading catalog from AWS S3...</p>
                </div>
              ) : catalogDresses.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-3xl border border-slate-200 p-8">
                  <div className="w-16 h-16 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto mb-4">
                    <ImageIcon className="w-8 h-8" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900">No photos in collection yet</h3>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 mb-6">
                    Upload your first saree or bridal lehenga to showcase your work to Hyderabad brides.
                  </p>
                  <button
                    onClick={() => setActiveTab("upload")}
                    className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold tracking-wide transition-colors cursor-pointer"
                  >
                    Upload First Photo
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {catalogDresses.map((item) => (
                    <div
                      key={item.id}
                      className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between group"
                    >
                      <div className="relative aspect-[3/4] bg-slate-100 overflow-hidden">
                        <img
                          src={item.fileUrl}
                          alt={item.title || "Dress"}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <span className="absolute top-3 left-3 px-2.5 py-1 bg-slate-900/80 backdrop-blur text-amber-200 text-[10px] font-semibold rounded-full uppercase tracking-wider">
                          {item.category?.replace("_", " ") || "Couture"}
                        </span>
                      </div>

                      <div className="p-5">
                        <h4 className="font-bold text-slate-900 text-base line-clamp-1">
                          {item.title || "Designer Creation"}
                        </h4>
                        <p className="text-sm font-semibold text-indigo-600 mt-1">
                          {item.price ? `₹${item.price.toLocaleString("en-IN")}` : "Price on Request"}
                        </p>

                        <div className="flex items-center gap-2 mt-4 pt-3 border-t border-slate-100">
                          <button
                            onClick={() => setPreviewProduct(item)}
                            className="flex-1 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>Preview</span>
                          </button>
                          <button
                            onClick={() => handleDeletePhoto(item.id, item.title)}
                            className="p-2 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
                            title="Delete photo"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ======================================================== */}
          {/* TAB 4: QUOTA & STORAGE (Real-Time S3 Consumption)        */}
          {/* ======================================================== */}
          {activeTab === "quota" && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Plan Storage & Quota</h2>
                    <p className="text-xs text-slate-500 mt-1">
                      Real-time AWS S3 storage consumption & photo limits for <strong>{CLIENT_ID}</strong>.
                    </p>
                  </div>
                  <button
                    onClick={fetchSubscriptionStatus}
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer self-start sm:self-auto"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Sync Status</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Photos Quota Card */}
                  <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/70">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                        Photos Gallery Quota
                      </span>
                      <span className="text-xs font-bold text-indigo-600 bg-indigo-100/80 px-2.5 py-0.5 rounded-full">
                        {photosPct}% Used
                      </span>
                    </div>

                    <div className="flex items-baseline gap-2 mb-3">
                      <span className="text-3xl font-bold text-slate-900">{photosUsed}</span>
                      <span className="text-sm text-slate-500">/ {maxPhotos} photos maximum</span>
                    </div>

                    <div className="w-full h-3 bg-slate-200 rounded-full overflow-hidden mb-3">
                      <div
                        className="h-full bg-indigo-600 rounded-full transition-all duration-500"
                        style={{ width: `${photosPct}%` }}
                      ></div>
                    </div>
                    <p className="text-[11px] text-slate-500">
                      {maxPhotos - photosUsed > 0
                        ? `You can upload ${maxPhotos - photosUsed} more dresses before reaching plan limit.`
                        : "Plan photo limit reached. Upgrade plan for unlimited uploads."}
                    </p>
                  </div>

                  {/* S3 Storage Card */}
                  <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/70">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                        AWS S3 Cloud Bandwidth
                      </span>
                      <span className="text-xs font-bold text-violet-600 bg-violet-100/80 px-2.5 py-0.5 rounded-full">
                        {storagePct}% Used
                      </span>
                    </div>

                    <div className="flex items-baseline gap-2 mb-3">
                      <span className="text-3xl font-bold text-slate-900">{storageMb} MB</span>
                      <span className="text-sm text-slate-500">/ {maxStorageMb} MB capacity</span>
                    </div>

                    <div className="w-full h-3 bg-slate-200 rounded-full overflow-hidden mb-3">
                      <div
                        className="h-full bg-violet-600 rounded-full transition-all duration-500"
                        style={{ width: `${storagePct}%` }}
                      ></div>
                    </div>
                    <p className="text-[11px] text-slate-500">
                      In-Browser WebP compression ensures each photo averages ~300KB on S3.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* TAB 5: CHANGE PASSWORD (Store Owner Credentials)        */}
          {/* ======================================================== */}
          {activeTab === "password" && (
            <div className="max-w-xl mx-auto bg-white rounded-3xl border border-slate-200/80 shadow-xs p-6 sm:p-8 animate-in fade-in duration-300">
              <div className="mb-6">
                <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-3">
                  <KeyRound className="w-6 h-6" />
                </div>
                <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Store Owner Credentials</h2>
                <p className="text-xs text-slate-500 mt-1">
                  Update your admin login password and username for <strong>{CLIENT_ID}</strong>.
                </p>
              </div>

              {passwordStatusMsg && (
                <div
                  className={`p-4 rounded-xl text-xs font-semibold mb-6 flex items-center gap-2 ${
                    passwordStatusMsg.error
                      ? "bg-rose-50 border border-rose-200 text-rose-700"
                      : "bg-emerald-50 border border-emerald-200 text-emerald-700"
                  }`}
                >
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{passwordStatusMsg.text}</span>
                </div>
              )}

              <form onSubmit={handlePasswordUpdate} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">New Admin Password</label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Min 6 characters (e.g. boutique@2026)"
                    required
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-indigo-500 focus:bg-white transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">Update Username (Optional)</label>
                  <input
                    type="text"
                    value={newUsername}
                    onChange={(e) => setNewUsername(e.target.value)}
                    placeholder="e.g. admin or 917660922413"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-indigo-500 focus:bg-white transition-colors"
                  />
                </div>

                <button
                  type="submit"
                  disabled={passwordUpdating}
                  className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-400 text-white rounded-xl text-sm font-semibold tracking-wide shadow-md shadow-indigo-600/20 transition-all cursor-pointer flex items-center justify-center gap-2 mt-6"
                >
                  {passwordUpdating ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Saving Credentials...</span>
                    </>
                  ) : (
                    <>
                      <KeyRound className="w-4 h-4" />
                      <span>Update Password</span>
                    </>
                  )}
                </button>
              </form>
            </div>
          )}

          {/* ======================================================== */}
          {/* TAB: OVERVIEW DASHBOARD                                 */}
          {/* ======================================================== */}
          {activeTab === "dashboard" && (
            <div className="space-y-6 animate-in fade-in duration-300">
              {/* Metric Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div
                  onClick={() => setActiveTab("subscriptions")}
                  className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between cursor-pointer hover:border-indigo-300 transition-colors"
                >
                  <div>
                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Active Plan</p>
                    <h3 className="text-base font-bold text-slate-900 mt-1">{subscriptionDetails?.planName || "Starter Showcase"}</h3>
                    <p className="text-[11px] text-emerald-600 font-medium mt-0.5">● Status: {subscriptionDetails?.status || "ACTIVE"}</p>
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                </div>

                <div
                  onClick={() => setActiveTab("gallery")}
                  className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between cursor-pointer hover:border-violet-300 transition-colors"
                >
                  <div>
                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Photos Uploaded</p>
                    <h3 className="text-base font-bold text-slate-900 mt-1">{catalogDresses.length} / {maxPhotos} Photos</h3>
                    <p className="text-[11px] text-slate-500 font-medium mt-0.5">{photosPct}% Quota Consumed</p>
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-violet-50 text-violet-600 flex items-center justify-center">
                    <ImageIcon className="w-5 h-5" />
                  </div>
                </div>

                <div
                  onClick={() => {
                    const text = encodeURIComponent("Hello test_web! Testing WhatsApp order routing.");
                    window.open(`https://wa.me/${WHATSAPP_PHONE}?text=${text}`, "_blank");
                  }}
                  className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between cursor-pointer hover:border-emerald-300 transition-colors"
                >
                  <div>
                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">WhatsApp Channel</p>
                    <h3 className="text-base font-bold text-slate-900 mt-1">{WHATSAPP_PHONE}</h3>
                    <p className="text-[11px] text-emerald-600 font-medium mt-0.5">Click-to-Chat Active</p>
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                    <Phone className="w-5 h-5" />
                  </div>
                </div>
              </div>

              {/* Quick Action Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div
                  onClick={() => setActiveTab("upload")}
                  className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs hover:border-indigo-400 transition-all cursor-pointer flex items-center gap-4"
                >
                  <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                    <UploadCloud className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm">Upload Dress Photo</h3>
                    <p className="text-xs text-slate-500 mt-0.5">Compress & publish sarees to AWS S3</p>
                  </div>
                </div>

                <div
                  onClick={() => setActiveTab("subscriptions")}
                  className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs hover:border-indigo-400 transition-all cursor-pointer flex items-center gap-4"
                >
                  <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                    <Zap className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm">Upgrade Subscription Plan</h3>
                    <p className="text-xs text-slate-500 mt-0.5">Unlock 100+ photos & custom domain</p>
                  </div>
                </div>
              </div>

              {/* Recent Dresses Preview */}
              <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xs">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">Recent Collection Additions</h3>
                    <p className="text-xs text-slate-500">Latest handcrafted items displayed on storefront</p>
                  </div>
                  <button
                    onClick={() => setActiveTab("gallery")}
                    className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-1 cursor-pointer"
                  >
                    <span>View All ({catalogDresses.length})</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                {catalogDresses.length === 0 ? (
                  <div className="text-center py-10 border-2 border-dashed border-slate-200 rounded-2xl">
                    <p className="text-xs text-slate-500 mb-3">No photos uploaded to S3 yet.</p>
                    <button
                      onClick={() => setActiveTab("upload")}
                      className="px-4 py-2 bg-indigo-600 text-white text-xs font-semibold rounded-xl"
                    >
                      Upload Now
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {catalogDresses.slice(0, 4).map((item) => (
                      <div key={item.id} className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 group">
                        <img src={item.fileUrl} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                        
                        {/* Quick action buttons on card hover */}
                        <div className="absolute top-2 right-2 flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                          <button
                            onClick={() => setPreviewProduct(item)}
                            className="p-1.5 bg-white/90 hover:bg-white text-slate-700 rounded-lg shadow-sm transition-colors cursor-pointer"
                            title="Preview"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeletePhoto(item.id, item.title)}
                            className="p-1.5 bg-rose-600/90 hover:bg-rose-600 text-white rounded-lg shadow-sm transition-colors cursor-pointer"
                            title="Delete photo"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent flex flex-col justify-end p-3 text-white pointer-events-none">
                          <p className="text-xs font-bold truncate">{item.title}</p>
                          <p className="text-[11px] text-amber-300 font-medium">₹{item.price?.toLocaleString("en-IN") || "N/A"}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Quick Photo Preview Modal */}
      {previewProduct && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-sm p-4"
          onClick={() => setPreviewProduct(null)}
        >
          <div
            className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-slate-200 p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="aspect-[3/4] rounded-2xl overflow-hidden bg-slate-100 mb-4">
              <img src={previewProduct.fileUrl} alt={previewProduct.title} className="w-full h-full object-cover" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">{previewProduct.title || "Designer Creation"}</h3>
            <p className="text-lg font-bold text-indigo-600 mt-1">
              {previewProduct.price ? `₹${previewProduct.price.toLocaleString("en-IN")}` : "Price on Request"}
            </p>
            <div className="flex gap-2 sm:gap-3 mt-6">
              <button
                onClick={() => {
                  if (window.boutique?.whatsapp?.openChat) {
                    window.boutique.whatsapp.openChat(previewProduct);
                  }
                }}
                className="flex-1 py-3 bg-[#128C7E] hover:bg-[#075E54] text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 cursor-pointer transition-colors"
              >
                <Phone className="w-4 h-4" />
                <span>Test WhatsApp Order</span>
              </button>
              <button
                onClick={() => {
                  const idToDelete = previewProduct.id;
                  const titleToDelete = previewProduct.title;
                  setPreviewProduct(null);
                  handleDeletePhoto(idToDelete, titleToDelete);
                }}
                className="px-4 py-3 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
                title="Delete this dress from collection"
              >
                <Trash2 className="w-4 h-4" />
                <span>Delete</span>
              </button>
              <button
                onClick={() => setPreviewProduct(null)}
                className="px-5 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold cursor-pointer transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
