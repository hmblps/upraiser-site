import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { SiteGrain } from "../components/SiteGrain";

const INTENT_URI =
  "intent:#Intent;action=android.intent.action.INSERT;type=vnd.android.cursor.dir/contact;S.name=Alex%20Upraiser;S.phone=%2B40724787390;S.email=alex%40upraiser.co.uk;S.company=Supply%20%26%20Demand;S.job_title=Oleksii%20Ostroukhov;S.notes=https%3A%2F%2Fupraiser.co.uk%2Fconnect;end";

const MIME_INTENT_URI =
  "intent:https://upraiser.co.uk/Alex_Upraiser.vcf?v=8#Intent;action=android.intent.action.VIEW;type=text/vcard;end";

const VCARD_URL = "/Alex_Upraiser.vcf?v=8";

export default function ConnectIntentTestPage() {
  const [logs, setLogs] = useState<string[]>([]);
  const [userAgent, setUserAgent] = useState("");
  const [browserInfo, setBrowserInfo] = useState({ isSamsung: false, isChrome: false, isAndroid: false, isIOS: false });

  const addLog = (msg: string) => {
    const time = new Date().toLocaleTimeString();
    setLogs((prev) => [`[${time}] ${msg}`, ...prev.slice(0, 19)]);
  };

  useEffect(() => {
    if (typeof window !== "undefined" && typeof navigator !== "undefined") {
      const ua = navigator.userAgent;
      setUserAgent(ua);
      const isSamsung = /SamsungBrowser/i.test(ua);
      const isChrome = /Chrome/i.test(ua) && !isSamsung;
      const isAndroid = /Android/i.test(ua);
      const isIOS = /iPhone|iPad|iPod/i.test(ua);
      setBrowserInfo({ isSamsung, isChrome, isAndroid, isIOS });
      addLog(`Page loaded · Android: ${isAndroid} · Samsung: ${isSamsung} · Chrome: ${isChrome}`);

      const handleVisibilityChange = () => {
        addLog(`visibilitychange: state=${document.visibilityState}`);
      };
      const handleBlur = () => {
        addLog("window blur: browser lost focus (app switched)");
      };
      const handleFocus = () => {
        addLog("window focus: returned to browser");
      };

      document.addEventListener("visibilitychange", handleVisibilityChange);
      window.addEventListener("blur", handleBlur);
      window.addEventListener("focus", handleFocus);

      return () => {
        document.removeEventListener("visibilitychange", handleVisibilityChange);
        window.removeEventListener("blur", handleBlur);
        window.removeEventListener("focus", handleFocus);
      };
    }
  }, []);

  const handleSmartFallback = () => {
    addLog("Method 2 triggered: Intent with 1.5s fallback to .vcf");
    let hasSwitched = false;

    const onSwitch = () => {
      hasSwitched = true;
    };
    window.addEventListener("blur", onSwitch, { once: true });

    try {
      window.location.href = INTENT_URI;
    } catch (e) {
      addLog(`Intent throw: ${(e as Error).message}`);
    }

    setTimeout(() => {
      window.removeEventListener("blur", onSwitch);
      if (!hasSwitched && document.visibilityState === "visible") {
        addLog("Fallback triggered: remaining on page, navigating to .vcf");
        window.location.href = VCARD_URL;
      } else {
        addLog("Intent succeeded or window blurred; fallback skipped.");
      }
    }, 1500);
  };

  return (
    <div className="min-h-[100dvh] bg-[#030712] text-white p-4 sm:p-6 font-sans relative selection:bg-[#ff003b] selection:text-white">
      <SiteGrain />

      <main className="max-w-md mx-auto pt-4 pb-12 space-y-6 relative z-10">
        <header className="space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono tracking-wider text-[#FECF09] uppercase">
              Android Intent Test Lab
            </span>
            <Link
              to="/connect"
              className="text-xs text-neutral-400 hover:text-white underline min-h-[44px] flex items-center"
            >
              ← Back to Hub
            </Link>
          </div>
          <h1 className="text-xl font-bold tracking-tight text-white">
            Samsung & Android Contact Intent Diagnostics
          </h1>
          <p className="text-xs text-neutral-400 leading-relaxed">
            Testing native <code className="text-neutral-200">intent:#Intent;action=INSERT</code> vs static{" "}
            <code className="text-neutral-200">.vcf</code> to bypass the &ldquo;Download file?&rdquo; prompt on Samsung Internet.
          </p>
        </header>

        {/* Device Information Card */}
        <section className="bg-neutral-900/80 border border-white/10 rounded-xl p-3.5 space-y-2 text-xs font-mono">
          <div className="text-neutral-400 text-[10px] uppercase tracking-wider">Device Profile</div>
          <div className="grid grid-cols-2 gap-2 text-neutral-300">
            <div>
              OS: <span className="text-white font-semibold">{browserInfo.isAndroid ? "Android" : browserInfo.isIOS ? "iOS" : "Desktop/Other"}</span>
            </div>
            <div>
              Browser:{" "}
              <span className="text-white font-semibold">
                {browserInfo.isSamsung ? "Samsung Internet" : browserInfo.isChrome ? "Chrome" : "Other"}
              </span>
            </div>
          </div>
          <div className="text-[10px] text-neutral-500 break-all leading-tight pt-1 border-t border-white/5">
            UA: {userAgent || "Detecting..."}
          </div>
        </section>

        {/* Test Methods */}
        <section className="space-y-3">
          <div className="text-neutral-400 text-[10px] uppercase font-mono tracking-wider">Test Methods</div>

          {/* Method 1: Direct Anchor Intent */}
          <div className="space-y-1.5">
            <a
              href={INTENT_URI}
              onClick={() => addLog("Clicked Method 1: Direct Anchor Intent (Argon spec)")}
              className="w-full min-h-[48px] px-4 py-3 bg-[#e63558] hover:bg-[#ff003b] active:scale-[0.98] rounded-xl text-sm font-semibold text-white flex items-center justify-between shadow-lg shadow-[#e63558]/20 transition-all select-none"
            >
              <span>1. Direct Intent Anchor (Argon Spec)</span>
              <span className="text-xs opacity-70">intent: →</span>
            </a>
            <p className="text-[11px] text-neutral-400 px-1">
              Pure <code className="text-neutral-300">&lt;a href=&quot;intent:...&quot;&gt;</code>. Tests if Samsung Internet/Chrome launches the Contacts app directly.
            </p>
          </div>

          {/* Method 2: Smart Fallback */}
          <div className="space-y-1.5">
            <button
              type="button"
              onClick={handleSmartFallback}
              className="w-full min-h-[48px] px-4 py-3 bg-[#1e293b] hover:bg-[#334155] border border-white/10 active:scale-[0.98] rounded-xl text-sm font-semibold text-white flex items-center justify-between transition-all select-none cursor-pointer"
            >
              <span>2. Smart Intent with 1.5s Fallback</span>
              <span className="text-xs text-[#FECF09]">Hybrid →</span>
            </button>
            <p className="text-[11px] text-neutral-400 px-1">
              Attempts intent via JS. If browser stays visible for 1.5s (meaning intent was blocked), automatically falls back to .vcf.
            </p>
          </div>

          {/* Method 3: MIME VIEW Intent */}
          <div className="space-y-1.5">
            <a
              href={MIME_INTENT_URI}
              onClick={() => addLog("Clicked Method 3: MIME VIEW Intent")}
              className="w-full min-h-[48px] px-4 py-3 bg-neutral-800 hover:bg-neutral-700 border border-white/10 active:scale-[0.98] rounded-xl text-sm font-semibold text-white flex items-center justify-between transition-all select-none"
            >
              <span>3. MIME VIEW Intent (text/vcard)</span>
              <span className="text-xs opacity-70">VIEW →</span>
            </a>
            <p className="text-[11px] text-neutral-400 px-1">
              Tells Android to VIEW <code className="text-neutral-300">text/vcard</code> URL via system intent handler.
            </p>
          </div>

          {/* Method 4: Production Static .vcf */}
          <div className="space-y-1.5">
            <a
              href={VCARD_URL}
              onClick={() => addLog("Clicked Method 4: Production Static .vcf (/Alex_Upraiser.vcf?v=8)")}
              className="w-full min-h-[48px] px-4 py-3 bg-white/5 hover:bg-white/10 border border-white/15 active:scale-[0.98] rounded-xl text-sm font-medium text-neutral-200 flex items-center justify-between transition-all select-none"
            >
              <span>4. Production Baseline (.vcf inline)</span>
              <span className="text-xs opacity-70">HTTP →</span>
            </a>
            <p className="text-[11px] text-neutral-400 px-1">
              Current production baseline. Opens QuickLook on iOS; prompts &ldquo;Download file?&rdquo; on Samsung Internet.
            </p>
          </div>
        </section>

        {/* Live Diagnostics Console */}
        <section className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-neutral-400 text-[10px] uppercase font-mono tracking-wider">Event Console</span>
            <button
              type="button"
              onClick={() => setLogs([])}
              className="text-[10px] text-neutral-500 hover:text-white font-mono uppercase underline min-h-[44px] flex items-center"
            >
              Clear Logs
            </button>
          </div>
          <div className="bg-black/60 border border-white/10 rounded-xl p-3 min-h-[140px] max-h-[220px] overflow-y-auto font-mono text-[11px] space-y-1">
            {logs.length === 0 ? (
              <div className="text-neutral-600 italic">No events recorded. Tap a method above.</div>
            ) : (
              logs.map((log, idx) => (
                <div
                  key={idx}
                  className={
                    log.includes("blur") || log.includes("Method")
                      ? "text-[#FECF09]"
                      : log.includes("visibilitychange")
                      ? "text-emerald-400"
                      : "text-neutral-400"
                  }
                >
                  {log}
                </div>
              ))
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
