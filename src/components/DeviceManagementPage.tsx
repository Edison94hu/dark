import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { 
  Smartphone,
  Wifi,
  WifiOff,
  Signal,
  SignalHigh,
  SignalLow,
  SignalMedium,
  Bluetooth,
  Scale,
  Printer,
  RefreshCw,
  Battery,
  HardDrive,
  Cpu,
  Circle
} from "lucide-react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";

interface BluetoothDevice {
  id: string;
  name: string;
  type: "scale" | "printer";
  status: "connected" | "disconnected";
  batteryLevel?: number;
  lastConnected?: string;
  signalStrength?: number;
}

interface AvailableDevice {
  id: string;
  name: string;
  type: "scale" | "printer";
  signalStrength: number;
}

export function DeviceManagementPage() {
  const location = useLocation();
  const navigate = useNavigate();
  // Mock device data
  const [bluetoothDevices, setBluetoothDevices] = useState<BluetoothDevice[]>([
    {
      id: "1",
      name: "蓝牙称重机",
      type: "scale",
      status: "connected",
      batteryLevel: 85,
      lastConnected: "2024-01-15 14:30",
      signalStrength: 4
    },
    {
      id: "2", 
      name: "标签打印机",
      type: "printer",
      status: "disconnected",
      batteryLevel: 42,
      lastConnected: "2024-01-15 12:15",
      signalStrength: 2
    }
  ]);

  const [availableDevices] = useState<AvailableDevice[]>([
    {
      id: "3",
      name: "新蓝牙称重机-A1",
      type: "scale",
      signalStrength: 3
    },
    {
      id: "4",
      name: "便携打印机-P2",
      type: "printer", 
      signalStrength: 4
    },
    {
      id: "5",
      name: "工业称重机-S3",
      type: "scale",
      signalStrength: 2
    }
  ]);

  const [isConnectDialogOpen, setIsConnectDialogOpen] = useState(false);
  const [connectingDeviceId, setConnectingDeviceId] = useState<string | null>(null);

  // iPad static info
  const iPadInfo = {
    model: "iPad Pro 11英寸 (第4代)",
    systemVersion: "iPadOS 17.2.1",
    storage: "256GB可用 / 512GB总容量",
    batteryLevel: 78,
    serialNumber: "DMQK2CH/A"
  };

  // Network info
  const networkInfo = {
    wifiStatus: "connected" as const,
    networkName: "企业内网-5G",
    ipAddress: "192.168.1.156"
  };

  // Cellular info  
  const cellularInfo = {
    carrier: "中国移动",
    networkType: "5G",
    simStatus: "enabled" as const,
    dataUsage: "2.3GB / 20GB"
  };

  const handleConnect = (deviceId: string) => {
    setConnectingDeviceId(deviceId);
    setIsConnectDialogOpen(true);
    navigate(`/profile/device-management/connect/${deviceId}${location.search || ''}`);
  };

  const handleDisconnect = (deviceId: string) => {
    setBluetoothDevices(prev => prev.map(device => 
      device.id === deviceId 
        ? { ...device, status: "disconnected" }
        : device
    ));
  };

  const handleDeviceSelect = (availableDevice: AvailableDevice) => {
    if (connectingDeviceId) {
      // Update the device status to connected
      setBluetoothDevices(prev => prev.map(device => 
        device.id === connectingDeviceId
          ? { 
              ...device, 
              status: "connected",
              lastConnected: new Date().toLocaleString('zh-CN', {
                year: 'numeric',
                month: '2-digit', 
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit'
              }).replace(/\//g, '-')
            }
          : device
      ));
    }
    setIsConnectDialogOpen(false);
    setConnectingDeviceId(null);
  };

  const handleRefresh = () => {
    // Simulate refresh - in real app this would scan for devices
    console.log("Refreshing device list...");
  };

  const getDeviceIcon = (type: string) => {
    switch (type) {
      case "scale":
        return Scale;
      case "printer":
        return Printer;
      default:
        return Bluetooth;
    }
  };

  const getSignalIcon = (strength: number) => {
    if (strength >= 4) return SignalHigh;
    if (strength >= 3) return SignalMedium;
    if (strength >= 2) return SignalLow;
    return Signal;
  };

  const getBatteryColor = (level: number) => {
    if (level > 50) return "text-[var(--color-safety-green)]";
    if (level > 20) return "text-[#FFA726]";
    return "text-[var(--color-warning-red)]";
  };

  // Reflect dialog open state in URL
  useEffect(() => {
    const parts = location.pathname.split('/').filter(Boolean);
    if (parts[0] !== 'profile' || parts[1] !== 'device-management') return;
    const sub = parts[2];
    if (sub === 'connect') {
      const id = parts[3] || null;
      if (id && id !== connectingDeviceId) setConnectingDeviceId(id);
      if (!isConnectDialogOpen) setIsConnectDialogOpen(true);
    } else if (!sub) {
      if (isConnectDialogOpen) setIsConnectDialogOpen(false);
      if (connectingDeviceId) setConnectingDeviceId(null);
    }
  }, [location.pathname]);

  return (
    <div className="bg-background p-6">
      <div className="flex flex-col gap-6 min-h-0">
        {/* 上半区：静态信息卡片 */}
        <div className="grid grid-cols-3 gap-6 h-64">
          {/* iPad 信息卡片 */}
          <div className="bg-card rounded-xl border border-border p-6" style={{ boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)" }}>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-industrial-blue/10 rounded-[var(--radius-input)] flex items-center justify-center">
                <Smartphone className="w-5 h-5 text-[var(--color-industrial-blue)]" />
              </div>
              <h3 className="text-lg font-semibold text-foreground">iPad 信息</h3>
            </div>
            
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">型号</span>
                <span className="text-sm text-foreground text-right">{iPadInfo.model}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">系统版本</span>
                <span className="text-sm text-foreground">{iPadInfo.systemVersion}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">存储空间</span>
                <span className="text-sm text-foreground text-right">{iPadInfo.storage}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">电池电量</span>
                <div className="flex items-center gap-2">
                  <Battery className={`w-4 h-4 ${getBatteryColor(iPadInfo.batteryLevel)}`} />
                  <span className="text-sm text-foreground">{iPadInfo.batteryLevel}%</span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">序列号</span>
                <span className="text-sm text-foreground">{iPadInfo.serialNumber}</span>
              </div>
            </div>
          </div>

          {/* 网络连接卡片 */}
          <div className="bg-card rounded-xl border border-border p-6" style={{ boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)" }}>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-industrial-blue/10 rounded-[var(--radius-input)] flex items-center justify-center">
                {networkInfo.wifiStatus === "connected" ? (
                  <Wifi className="w-5 h-5 text-[var(--color-industrial-blue)]" />
                ) : (
                  <WifiOff className="w-5 h-5 text-[var(--color-industrial-blue)]" />
                )}
              </div>
              <h3 className="text-lg font-semibold text-foreground">网络连接</h3>
            </div>
            
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">WiFi 状态</span>
                <div className="flex items-center gap-2">
                  <Circle className={`w-2 h-2 fill-current ${
                    networkInfo.wifiStatus === "connected" 
                      ? "text-[var(--color-safety-green)]" 
                      : "text-muted-foreground"
                  }`} />
                  <span className="text-sm text-foreground">
                    {networkInfo.wifiStatus === "connected" ? "已连接" : "未连接"}
                  </span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">网络名称</span>
                <span className="text-sm text-foreground">{networkInfo.networkName}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">IP 地址</span>
                <span className="text-sm text-foreground">{networkInfo.ipAddress}</span>
              </div>
            </div>
          </div>

          {/* 蜂窝网络卡片 */}
          <div className="bg-card rounded-xl border border-border p-6" style={{ boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)" }}>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-industrial-blue/10 rounded-[var(--radius-input)] flex items-center justify-center">
                <SignalHigh className="w-5 h-5 text-[var(--color-industrial-blue)]" />
              </div>
              <h3 className="text-lg font-semibold text-foreground">蜂窝网络</h3>
            </div>
            
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">运营商</span>
                <span className="text-sm text-foreground">{cellularInfo.carrier}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">网络类型</span>
                <span className="text-sm text-foreground">{cellularInfo.networkType}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">SIM 状态</span>
                <div className="flex items-center gap-2">
                  <Circle className={`w-2 h-2 fill-current ${
                    cellularInfo.simStatus === "enabled" 
                      ? "text-[var(--color-safety-green)]" 
                      : "text-muted-foreground"
                  }`} />
                  <span className="text-sm text-foreground">
                    {cellularInfo.simStatus === "enabled" ? "启用" : "禁用"}
                  </span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">流量使用</span>
                <span className="text-sm text-foreground">{cellularInfo.dataUsage}</span>
              </div>
            </div>
          </div>
        </div>

        {/* 下半区：蓝牙连接设备主卡片 */}
        <div className="bg-card rounded-2xl border border-[var(--color-industrial-blue)] overflow-hidden" style={{ boxShadow: "0 8px 32px rgba(0, 0, 0, 0.12)", height: "420px" }}>
          {/* 卡片标题栏 */}
          <div className="p-6 border-b border-border flex items-center justify-between">
            <h2 className="text-xl font-semibold text-foreground">蓝牙连接设备</h2>
            <Button
              onClick={handleRefresh}
              variant="ghost"
              size="sm"
              className="h-10 w-10 p-0 hover:bg-[var(--color-industrial-blue)] hover:text-white rounded-full"
            >
              <RefreshCw className="w-5 h-5" />
            </Button>
          </div>

          {/* 设备列表 */}
          <div className="p-6 space-y-4 overflow-y-auto" style={{ height: "calc(420px - 88px)" }}>
            {bluetoothDevices.map((device) => {
              const DeviceIcon = getDeviceIcon(device.type);
              const SignalIcon = getSignalIcon(device.signalStrength || 3);
              
              return (
                <div
                  key={device.id}
                  className="bg-muted border border-border rounded-xl p-4 transition-all duration-200 hover:border-[var(--color-industrial-blue)] hover:shadow-md"
                >
                  <div className="flex items-center justify-between">
                    {/* 设备信息 */}
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-card rounded-lg border border-border flex items-center justify-center">
                        <DeviceIcon className="w-6 h-6 text-[var(--color-industrial-blue)]" />
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-base font-semibold text-foreground">{device.name}</h3>
                          <Badge 
                            className={`text-xs ${
                              device.status === "connected"
                                ? "bg-[var(--color-industrial-blue)] text-white"
                                : "bg-gray-400 text-white"
                            }`}
                          >
                            {device.status === "connected" ? "已连接" : "未连接"}
                          </Badge>
                        </div>
                        
                        <div className="flex items-center gap-6 text-sm text-muted-foreground">
                          {device.batteryLevel && (
                            <div className="flex items-center gap-1">
                              <Battery className={`w-4 h-4 ${getBatteryColor(device.batteryLevel)}`} />
                              <span>{device.batteryLevel}%</span>
                            </div>
                          )}
                          {device.lastConnected && (
                            <span>最近连接: {device.lastConnected}</span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* 操作按钮 */}
                    <div className="flex items-center gap-3">
                      {device.signalStrength && (
                        <SignalIcon className="w-5 h-5 text-muted-foreground" />
                      )}
                      
                      {device.status === "connected" ? (
                        <Button
                          onClick={() => handleDisconnect(device.id)}
                          variant="outline"
                          size="sm"
                          className="h-9 px-4 border-border text-muted-foreground hover:bg-accent hover:text-foreground hover:border-border rounded-lg"
                        >
                          断开连接
                        </Button>
                      ) : (
                        <Button
                          onClick={() => handleConnect(device.id)}
                          size="sm"
                          className="h-9 px-4 bg-[var(--color-industrial-blue)] hover:bg-[var(--color-industrial-blue-dark)] text-white rounded-lg"
                        >
                          连接
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 设备选择对话框 */}
        <Dialog 
          open={isConnectDialogOpen} 
          onOpenChange={(open) => {
            setIsConnectDialogOpen(open);
            if (!open) {
              navigate(`/profile/device-management${location.search || ''}`);
            }
          }}
        >
          <DialogContent className="bg-card max-w-md">
            <DialogHeader>
              <DialogTitle>选择设备连接</DialogTitle>
              <DialogDescription>
                请从下列可用设备中选择要连接的蓝牙设备
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-3 max-h-80 overflow-y-auto">
              {availableDevices.map((device) => {
                const DeviceIcon = getDeviceIcon(device.type);
                const SignalIcon = getSignalIcon(device.signalStrength);
                
                return (
                  <button
                    key={device.id}
                    onClick={() => handleDeviceSelect(device)}
                    className="w-full flex items-center gap-3 p-3 bg-muted hover:bg-industrial-blue/10 hover:border-[var(--color-industrial-blue)] border border-border rounded-lg transition-all duration-200"
                  >
                    <div className="w-10 h-10 bg-card rounded-lg border border-border flex items-center justify-center">
                      <DeviceIcon className="w-5 h-5 text-[var(--color-industrial-blue)]" />
                    </div>
                    
                    <div className="flex-1 text-left">
                      <h4 className="text-sm font-semibold text-foreground">{device.name}</h4>
                    </div>
                    
                    <SignalIcon className="w-4 h-4 text-muted-foreground" />
                  </button>
                );
              })}
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
