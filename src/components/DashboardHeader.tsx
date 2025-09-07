import { useState } from "react";
import { Building, ChevronDown, Settings, LogOut, User } from "lucide-react";
import { StatusBadge, BluetoothStatus } from "./StatusBadge";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Avatar, AvatarFallback } from "./ui/avatar";

interface DashboardHeaderProps {
  bluetoothStatus: BluetoothStatus;
  companyName: string;
  companyCode: string;
  userName: string;
  onLogout: () => void;
  onSettings: () => void;
}

export function DashboardHeader({ 
  bluetoothStatus, 
  companyName, 
  companyCode, 
  userName,
  onLogout,
  onSettings 
}: DashboardHeaderProps) {
  return (
    <header className="w-full flex items-center justify-between p-4 bg-background/95 backdrop-blur-sm border-b border-border shadow-sm">
      {/* Logo区域 */}
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[--color-industrial-blue] to-[--color-industrial-blue-dark] flex items-center justify-center shadow-md">
          <Building className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="text-lg font-semibold text-foreground">
            危废标签打印
          </h1>
          <p className="text-xs text-muted-foreground">
            Hazardous Waste Label Printing
          </p>
        </div>
      </div>
      
      {/* 右侧状态和用户区域 */}
      <div className="flex items-center gap-4">
        {/* 企业信息 */}
        <div className="text-right text-sm">
          <div className="font-medium text-foreground">{companyName}</div>
          <div className="text-xs text-muted-foreground">编码: {companyCode}</div>
        </div>
        
        {/* 蓝牙状态 */}
        <StatusBadge status={bluetoothStatus} />
        
        {/* 用户下拉菜单 */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex items-center gap-2 h-12 px-3">
              <Avatar className="w-8 h-8">
                <AvatarFallback className="bg-muted text-muted-foreground text-sm">
                  {userName.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <span className="text-sm font-medium text-foreground">{userName}</span>
              <ChevronDown className="w-4 h-4 text-muted-foreground" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem onClick={onSettings} className="cursor-pointer">
              <Settings className="w-4 h-4 mr-2" />
              设置
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={onLogout} className="cursor-pointer text-red-600">
              <LogOut className="w-4 h-4 mr-2" />
              退出登录
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
