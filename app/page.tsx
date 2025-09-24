"use client";

import { useEffect, useMemo, useState } from "react";
import { Flame, Bitcoin, CandlestickChart, Gift } from "lucide-react";

/* ============================
   MODULE-SCOPE CONSTANTS / TYPES
============================ */
const BASE_PRICE = 4.2 as const; // USD

const SHIPPING_RATES: Record<string, number> = {
  usa: 6.9,
  canada: 11.9,
  europe: 16.9,
  asia: 16.9,
  oceania: 18.9,
  other: 21.9,
} as const;

type Payment = "usd" | "crypto";
function isPayment(v: string): v is Payment {
  return v === "usd" || v === "crypto";
}

// Environment links (set in Vercel → Project Settings → Environment Variables)
const STRIPE_LINK = process.env.NEXT_PUBLIC_STRIPE_PAYMENT_LINK || "#";
const COINBASE_LINK = process.env.NEXT_PUBLIC_COINBASE_CHECKOUT_URL || "#";

export default function GodCandle() {
  /* ====== STATE ====== */
  const [quantity, setQuantity] = useState(1);
  const [shippingRegion, setShippingRegion] = useState<string>("usa");
  const [isCustom, setIsCustom] = useState(false);
  const [customTicker, setCustomTicker] = useState("");
  const [isBearish, setIsBearish] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<Payment>("usd");
  const [tithingAmount, setTithingAmount] = useState<string>("0");

  /* ====== DERIVED ====== */
  const pricePerUnit = useMemo(() => {
    if (quantity >= 12) return BASE_PRICE * 0.85; // 15% off
    if (quantity >= 4) return BASE_PRICE * 0.92;  // 8% off
    return BASE_PRICE;
  }, [quantity]);

  const shippingCost = useMemo(() => {
    const base = SHIPPING_RATES[shippingRegion] ?? SHIPPING_RATES.other;
    return base + Math.max(0, quantity - 1) * 2; // +$2 per additional item
  }, [shippingRegion, quantity]);

  const customCost = isCustom ? 5 : 0;
  const tithing = Number(tithingAmount || 0);
  const itemsCost = pricePerUnit * quantity;
  const total = (itemsCost + customCost + shippingCost + tithing).toFixed(2);

  /* ====== COUNTDOWN ====== */
  useEffect(() => {
    const el = document.getElementById("countdown");
    if (!el) return;
    const target = new Date("2025-10-01T17:00:00Z").getTime();
    const tick = () => {
      const d = Math.max(0, target - Date.now());
      const days = Math.floor(d / 86400000);
      const hrs = Math.floor((d % 86400000) / 3600000);
      const mins = Math.floor((d % 3600000) / 60000);
      const secs = Math.floor((d % 60000) / 1000);
      el.textContent = `Batch 2 opens in ${days}d ${hrs}h ${mins}m ${secs}s`;
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  /* ====== THEME HELPERS ====== */
  const moodText = isBearish ? "text-red-700" : "text-emerald-700";
  const summaryBg = isBearish ? "bg-red-100/10" : "bg-emerald-100/10";
  const btnMood = isBearish
    ? "bg-red-600 hover:bg-red-700 focus-visible:outline-red-700"
    : "bg-emerald-600 hover:bg-emerald-700 focus-visible:outline-emerald-700";

  /* ====== ACTIONS ====== */
  const handleCheckout = () => {
    const url = paymentMethod === "usd" ? STRIPE_LINK : COINBASE_LINK;
    if (!url || url === "#") {
      alert("Checkout link is not configured yet. Add env vars in Vercel.");
      return;
    }
    window.location.href = url;
  };

  return (
    <main className="min-h-screen bg-black text-white">
      {/* HEADER / HERO */}
      <section className="mx-auto max-w-3xl px-4 py-10 sm:py-14">
        <div className="text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-emerald-600/20 px-4 py-1 text-sm text-emerald-300">
            <span>🔥 BATCH 1: SOLD OUT</span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">God Candle</h1>
          <p className="mt-2 text-zinc-300">Digital-first pre-orders. Launching Oct 1, 2025.</p>
          <p id="countdown" className="mt-3 text-lg font-semibold" />
        </div>

        {/* CTA ROW (mobile-first → stacks) */}
        <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
          <button
            onClick={() => setPaymentMethod("usd")}
            className={`w-full rounded-2xl border border-white/10 bg-white px-6 py-3 font-semibold text-black ${
              paymentMethod === "usd" ? "ring-2 ring-white" : ""
            }`}
          >
            Pre-Order (Card/Apple Pay)
          </button>
          <button
            onClick={() => setPaymentMethod("crypto")}
            className={`w-full rounded-2xl border border-emerald-400/20 bg-emerald-500/20 px-6 py-3 font-semibold text-emerald-200 ${
              paymentMethod === "crypto" ? "ring-2 ring-emerald-300" : ""
            }`}
          >
            Pre-Order (USDC/ETH/BTC)
          </button>
        </div>

        {/* EMAIL CAPTURE */}
        <form
          action="https://YOUR_EMAIL_LIST_PROVIDER_ENDPOINT" // replace with Mailchimp/Beehiiv/ConvertKit
          method="post"
          className="mt-5 flex flex-col items-stretch gap-2 sm:flex-row"
        >
          <input
            type="email"
            required
            name="email"
            placeholder="Enter email for early access"
            className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-zinc-500 outline-none"
          />
          <button className="rounded-xl bg-white px-5 py-3 font-semibold text-black hover:bg-white/90">
            Reserve Batch 2
          </button>
        </form>
        <p className="mt-2 text-xs text-zinc-400">
          Delivery window for Batch 2: 4–6 weeks. Full refunds available until fulfillment starts.
        </p>
      </section>

      {/* PRODUCT CARD (mobile-first) */}
      <section className="mx-auto max-w-xl px-4 pb-16">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-4 sm:p-6">
          {/* Title */}
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold">The Almighty Candle</h2>
              <p className={`mt-1 text-sm ${moodText}`}>
                {isBearish ? "Summoning the Ultimate Rug Pull 📉" : "Manifesting the Mother of All Squeezes 📈"}
              </p>
            </div>
            <Flame className={isBearish ? "text-red-400" : "text-emerald-300"} size={24} />
          </div>

          {/* Mood toggle */}
          <div className="mb-4 flex items-center justify-between gap-3">
            <label htmlFor="bear" className="text-sm text-zinc-300">Bear Mode</label>
            <button
              id="bear"
              type="button"
              onClick={() => setIsBearish((v) => !v)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${
                isBearish ? "bg-red-600" : "bg-emerald-600"
              }`}
              aria-pressed={isBearish}
            >
              <span
                className={`inline-block h-5 w-5 transform rounded-full bg-white transition ${
                  isBearish ? "translate-x-5" : "translate-x-1"
                }`}
              />
            </button>
          </div>

          {/* Controls */}
          <div className="grid gap-4">
            {/* Bundle */}
            <div>
              <label className="block text-sm text-zinc-300">Choose Your Bundle</label>
              <select
                className="mt-1 w-full rounded-md border border-white/10 bg-black/40 px-3 py-2 text-white"
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
              >
                <option value={1}>Single Candle — No Discount</option>
                <option value={4}>Bundle of 4 — 8% Off</option>
                <option value={12}>Bundle of 12 — 15% Off</option>
              </select>
            </div>

            {/* Shipping */}
            <div>
              <label className="block text-sm text-zinc-300">Shipping Region</label>
              <select
                className="mt-1 w-full rounded-md border border-white/10 bg-black/40 px-3 py-2 text-white"
                value={shippingRegion}
                onChange={(e) => setShippingRegion(e.target.value)}
              >
                <option value="usa">United States ($6.90)</option>
                <option value="canada">Canada ($11.90)</option>
                <option value="europe">Europe ($16.90)</option>
                <option value="asia">Asia ($16.90)</option>
                <option value="oceania">Oceania ($18.90)</option>
                <option value="other">Rest of World ($21.90)</option>
              </select>
              <p className="mt-1 text-xs text-zinc-500">+$2 per additional item</p>
            </div>

            {/* Custom blessing */}
            <div className="flex items-center gap-2">
              <input
                id="custom"
                type="checkbox"
                checked={isCustom}
                onChange={(e) => setIsCustom(e.target.checked)}
                className="h-4 w-4 rounded border-white/20 bg-black/40"
              />
              <label htmlFor="custom" className="text-sm text-zinc-300">
                Add Custom Memecoin Blessing (+$5)
              </label>
            </div>
            {isCustom && (
              <div>
                <label className="block text-sm text-zinc-300">Your Memecoin Ticker</label>
                <input
                  type="text"
                  placeholder="$FART"
                  value={customTicker}
                  onChange={(e) => setCustomTicker(e.target.value)}
                  className="mt-1 w-full rounded-md border border-white/10 bg-black/40 px-3 py-2 text-white"
                />
              </div>
            )}

            {/* Payment method */}
            <div>
              <label className="block text-sm text-zinc-300">Payment Method</label>
              <select
                className="mt-1 w-full rounded-md border border-white/10 bg-black/40 px-3 py-2 text-white"
                value={paymentMethod}
                onChange={(e) => {
                  const v = e.target.value;
                  setPaymentMethod(isPayment(v) ? v : "usd");
                }}
              >
                <option value="usd">USD (Card/Apple Pay)</option>
                <option value="crypto">Crypto (USDC/ETH/BTC via Coinbase)</option>
              </select>
            </div>

            {/* Tithing */}
            <div>
              <label className="block text-sm text-zinc-300">Optional Tithing</label>
              <div className="mt-1 flex items-center gap-2">
                <input
                  type="number"
                  min="0"
                  step="1"
                  inputMode="numeric"
                  placeholder="Additional blessing amount"
                  value={tithingAmount}
                  onChange={(e) => setTithingAmount(e.target.value)}
                  className="w-full rounded-md border border-white/10 bg-black/40 px-3 py-2 text-white"
                />
                <Gift size={18} className={isBearish ? "text-red-400" : "text-emerald-300"} />
              </div>
            </div>

            {/* Summary */}
            <div className={`rounded-md p-4 ${summaryBg}`}>
              <div className="flex items-center justify-between text-sm">
                <span className="text-zinc-300">Price per candle</span>
                <span className="font-semibold">${pricePerUnit.toFixed(2)}</span>
              </div>
              {isCustom && (
                <div className="mt-2 flex items-center justify-between text-sm">
                  <span className="text-zinc-300">Custom blessing</span>
                  <span className="font-semibold">$5.00</span>
                </div>
              )}
              <div className="mt-2 flex items-center justify-between text-sm">
                <span className="text-zinc-300">Shipping</span>
                <span className="font-semibold">${shippingCost.toFixed(2)}</span>
              </div>
              {tithing > 0 && (
                <div className="mt-2 flex items-center justify-between text-sm">
                  <span className="text-zinc-300">Tithing</span>
                  <span className="font-semibold">${tithing.toFixed(2)}</span>
                </div>
              )}
              <div className="mt-3 border-t border-white/10 pt-3 text-lg font-bold">
                <div className="flex items-center justify-between">
                  <span>Total</span>
                  <span>${total}</span>
                </div>
              </div>
            </div>

            {/* Checkout */}
            <button
              onClick={handleCheckout}
              className={`mt-2 inline-flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3 font-semibold ${btnMood}`}
            >
              {paymentMethod === "usd" ? <CandlestickChart className="-ml-1" /> : <Bitcoin className="-ml-1" />}
              Place Blessed Order
            </button>

            <p className={`mt-3 text-center text-xs ${isBearish ? "text-red-400" : "text-emerald-300"}`}>
              ⚠️ Pre-orders fund production. 4–6 week delivery. Full refunds available until fulfillment begins.
            </p>
          </div>
        </div>

        {/* Footer notes */}
        <div className="mt-8 space-y-2 text-center text-xs text-zinc-500">
          <p>Past performance of prayer candles does not guarantee future results.</p>
          <p>Each candle blessed with genuine {isBearish ? "FUD" : "copium"} ✨</p>
          <p>We ship worldwide (additional fees may apply).</p>
          <p className="mt-2">
            <a href="/terms" className="underline">Terms</a> · <a href="/refunds" className="underline">Refunds</a> · <a href="/contact" className="underline">Contact</a>
          </p>
        </div>
      </section>
    </main>
  );
}