import { useState } from "react";
import { Eye, EyeOff, LogIn } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import { Checkbox } from "./ui/checkbox";

export function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    companyCode: "",
    username: "",
    password: "",
    rememberDevice: false
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // 处理登录逻辑
    console.log("Login attempt:", formData);
  };

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Card className="w-full max-w-md mx-auto shadow-xl border-0 bg-card/95 backdrop-blur-sm">
      <CardHeader className="space-y-1 pb-6">
        <CardTitle className="text-2xl text-center text-foreground">
          系统登录
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* 企业编码 */}
          <div className="space-y-2">
            <Label htmlFor="companyCode" className="text-foreground text-base">
              企业编码
            </Label>
            <Input
              id="companyCode"
              type="text"
              placeholder="请输入企业编码"
              value={formData.companyCode}
              onChange={(e) => handleInputChange("companyCode", e.target.value)}
              className="h-12 text-base bg-input border-border focus:border-[--color-industrial-blue] focus:ring-[--color-industrial-blue]/20"
              required
            />
          </div>

          {/* 用户名 */}
          <div className="space-y-2">
            <Label htmlFor="username" className="text-foreground text-base">
              用户名
            </Label>
            <Input
              id="username"
              type="text"
              placeholder="请输入用户名"
              value={formData.username}
              onChange={(e) => handleInputChange("username", e.target.value)}
              className="h-12 text-base bg-input border-border focus:border-[--color-industrial-blue] focus:ring-[--color-industrial-blue]/20"
              required
            />
          </div>

          {/* 密码 */}
          <div className="space-y-2">
            <Label htmlFor="password" className="text-foreground text-base">
              密码
            </Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="请输入密码"
                value={formData.password}
                onChange={(e) => handleInputChange("password", e.target.value)}
                className="h-12 text-base bg-input border-border focus:border-[--color-industrial-blue] focus:ring-[--color-industrial-blue]/20 pr-12"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>

          {/* 记住设备 */}
          <div className="flex items-center space-x-3">
            <Checkbox
              id="rememberDevice"
              checked={formData.rememberDevice}
              onCheckedChange={(checked) => handleInputChange("rememberDevice", checked as boolean)}
              className="data-[state=checked]:bg-[--color-industrial-blue] data-[state=checked]:border-[--color-industrial-blue]"
            />
            <Label
              htmlFor="rememberDevice"
              className="text-sm text-muted-foreground cursor-pointer"
            >
              记住本设备
            </Label>
          </div>

          {/* 登录按钮 */}
          <Button
            type="submit"
            className="w-full h-12 text-base bg-[--color-industrial-blue] hover:bg-[--color-industrial-blue-dark] focus:ring-[--color-industrial-blue]/20 transition-all duration-200"
          >
            <LogIn className="w-5 h-5 mr-2" />
            登录
          </Button>

          {/* 忘记密码 */}
          <div className="text-center">
            <button
              type="button"
              className="text-sm text-[--color-industrial-blue] hover:text-[--color-industrial-blue-dark] transition-colors underline-offset-4 hover:underline"
            >
              忘记密码？
            </button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
