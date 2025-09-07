import { X, CreditCard } from "lucide-react";
import { Button } from "./ui/button";
import { ImageWithFallback } from "./figma/ImageWithFallback";

interface ServiceExtensionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ServiceExtensionModal({ isOpen, onClose }: ServiceExtensionModalProps) {
  if (!isOpen) return null;

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-6"
      onClick={handleBackdropClick}
    >
      <div className="bg-gray-800/95 rounded-2xl shadow-2xl border border-gray-700/50 backdrop-blur-md 
                      w-full max-w-md mx-auto animate-in fade-in-0 zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-industrial-blue/20 flex items-center justify-center">
              <CreditCard className="w-5 h-5 text-industrial-blue" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-white">延长服务</h2>
              <p className="text-sm text-gray-400">请扫码完成付款</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="text-gray-400 hover:text-white hover:bg-gray-700/50 rounded-lg"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Content */}
        <div className="p-8 text-center">
          {/* QR Code */}
          <div className="mb-6">
            <div className="inline-block p-6 bg-white rounded-2xl shadow-lg">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1571867424488-4565932edb41?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxxciUyMGNvZGUlMjBwYXltZW50fGVufDF8fHx8MTc1NTU0MjY0OXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                alt="Payment QR Code"
                className="w-48 h-48 object-cover rounded-lg"
              />
            </div>
          </div>

          {/* Price */}
          <div className="mb-8">
            <div className="text-3xl font-bold text-white mb-2">¥299</div>
            <div className="text-lg text-gray-400">/ 年</div>
            <div className="text-sm text-gray-500 mt-2">支持微信、支付宝扫码付款</div>
          </div>

          {/* Service Details */}
          <div className="bg-gray-700/30 rounded-xl p-4 mb-6">
            <div className="text-sm text-gray-300 space-y-2">
              <div className="flex justify-between">
                <span>服务期限</span>
                <span className="font-medium text-white">12个月</span>
              </div>
              <div className="flex justify-between">
                <span>开始日期</span>
                <span className="font-medium text-white">付款后立即生效</span>
              </div>
              <div className="flex justify-between">
                <span>服务内容</span>
                <span className="font-medium text-white">技术支持 + 软件更新</span>
              </div>
            </div>
          </div>

          {/* Status Hint */}
          <div className="text-xs text-gray-400 mb-6">
            扫码付款后，服务将自动延长，无需手动操作
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 pb-6">
          <Button
            onClick={onClose}
            variant="outline"
            className="w-full border-gray-600 text-gray-300 hover:bg-gray-700/50 hover:text-white"
          >
            关闭
          </Button>
        </div>
      </div>
    </div>
  );
}