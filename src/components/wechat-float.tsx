"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { MessageCircle, X } from "lucide-react";

export default function WechatFloat() {
  const [open, setOpen] = useState(false);
  const [qrUrl, setQrUrl] = useState("/imgs/wechat-qr-code.png");
  const [hidden, setHidden] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const isAdmin = pathname?.includes("/admin") ||
      pathname?.includes("/affiliate-settings") ||
      pathname?.includes("/site-settings") ||
      pathname?.includes("/discounts");
    setHidden(!!isAdmin);
  }, [pathname]);

  useEffect(() => {
    fetch("/api/admin/site-settings?key=wechat_qr_url")
      .then((res) => res.json())
      .then((result) => {
        if (result.code === 0 && result.data?.value) {
          setQrUrl(result.data.value);
        }
      })
      .catch(() => {});
  }, []);

  if (hidden) return null;

  return (
    <div className={`fixed bottom-6 left-6 z-50 ${open ? "" : "pointer-events-none"}`}>
      <div
        className={`
          mb-3 w-64 rounded-2xl bg-white shadow-2xl border border-gray-200 overflow-hidden
          transition-all duration-300 origin-bottom-left
          ${open
            ? "opacity-100 scale-100 translate-y-0 pointer-events-auto"
            : "opacity-0 scale-95 translate-y-2 pointer-events-none"
          }
        `}
      >
        <div className="relative bg-gradient-to-r from-green-500 to-green-600 px-4 py-3 text-white">
          <button
            onClick={() => setOpen(false)}
            className="absolute top-2 right-2 p-1 rounded-full hover:bg-white/20 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
          <p className="text-sm font-semibold">联系小助手</p>
          <p className="text-xs text-green-100 mt-0.5">扫码添加微信</p>
        </div>
        <div className="p-4 flex flex-col items-center gap-3">
          <div className="w-40 h-40 relative">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={qrUrl}
              alt="微信二维码"
              className="w-full h-full object-contain"
            />
          </div>
          <p className="text-xs text-gray-500 text-center leading-relaxed">
            购买后如遇系统生成异常，可联系小助手，我们会及时协助处理并补发相应次数，请放心使用。
          </p>
        </div>
      </div>

      <button
        onClick={() => setOpen(!open)}
        className="w-14 h-14 rounded-full bg-green-500 hover:bg-green-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center pointer-events-auto"
      >
        <div className={`transition-transform duration-300 ${open ? "rotate-90" : "rotate-0"}`}>
          {open ? (
            <X className="w-6 h-6" />
          ) : (
            <MessageCircle className="w-6 h-6" />
          )}
        </div>
      </button>
    </div>
  );
}
