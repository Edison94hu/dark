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
  Circle,
  CheckCircle,
  XCircle,
  Pencil,
  Save as SaveIcon
} from "lucide-react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Switch } from "./ui/switch";

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

  // ---------------- 称重设置（Modbus/HEX） ----------------
  type ByteOrder = "ABCD" | "CDAB" | "BADC" | "DCBA";

  const [scaleSettings, setScaleSettings] = useState({
    presets: {
      readWeightHex: "01 04 00 06 00 02", // 不含CRC
      tareHex: "01 05 00 04 FF 00",      // 不含CRC
    },
    crc: {
      autoCRC: true,
    },
    modbus: {
      slave: 1,
      readMethod: "04" as "03" | "04",
      address: 0x0006,
      length: 2,
    },
    parse: {
      byteOrder: "DCBA" as ByteOrder,
    },
    timing: {
      timeout: 1.8, // seconds
      maxRetries: 2,
    },
    poll: {
      enable: false,
      intervalMs: 800,
    },
    ble: {
      service: "FFF0",
      write: "FFF2",
      notify: "FFF1",
      swapChannels: false,
      manualChannel: false,
      mode: "auto" as "auto" | "manual",
    },
  });

  // Basic 模式运行时状态
  const [polling, setPolling] = useState(false);
  const [reading, setReading] = useState(false);
  const [sendingTare, setSendingTare] = useState(false);
  const [isEditingBasic, setIsEditingBasic] = useState(false);
  const [basicBackup, setBasicBackup] = useState<typeof scaleSettings | null>(null);
  const [lastRxHex, setLastRxHex] = useState("");
  const [lastSendPreview, setLastSendPreview] = useState("");
  const [weightKg, setWeightKg] = useState<number | null>(null);
  const [stripNotice, setStripNotice] = useState<string | null>(null);
  const [validateStatus, setValidateStatus] = useState<"idle" | "ok" | "fail" | "tryingSwap">("idle");
  const [consecutiveFail, setConsecutiveFail] = useState(0);
  const [suggestRead03, setSuggestRead03] = useState(false);
  const [readHexError, setReadHexError] = useState<string | null>(null);
  const [tareHexError, setTareHexError] = useState<string | null>(null);

  // 手动通道下拉选择（常用预设 + 自定义）
  const [bleSelect, setBleSelect] = useState({
    service: "FFF0" as "FFF0" | "custom",
    write: "FFF2" as "FFF2" | "FFF1" | "custom",
    notify: "FFF1" as "FFF1" | "FFF2" | "custom",
  });

  const fieldsDisabled = !isEditingBasic;

  

  const parseHexToBytes = (hex: string): number[] => {
    const clean = hex.replace(/[^0-9a-fA-F]/g, "").toUpperCase();
    if (clean.length % 2 !== 0) return [];
    const bytes: number[] = [];
    for (let i = 0; i < clean.length; i += 2) {
      bytes.push(parseInt(clean.slice(i, i + 2), 16));
    }
    return bytes;
  };

  const formatBytes = (bytes: number[]): string => bytes.map(b => b.toString(16).toUpperCase().padStart(2, "0")).join(" ");

  const canonicalizeHexSpacing = (hex: string) => {
    const bytes = parseHexToBytes(hex);
    return formatBytes(bytes);
  };

  const crc16Modbus = (bytes: number[]): [number, number] => {
    let crc = 0xFFFF;
    for (const b of bytes) {
      crc ^= b;
      for (let i = 0; i < 8; i++) {
        if (crc & 0x0001) {
          crc = (crc >> 1) ^ 0xA001;
        } else {
          crc = crc >> 1;
        }
      }
    }
    const lo = crc & 0xFF;
    const hi = (crc >> 8) & 0xFF;
    return [lo, hi];
  };

  const buildReadRawFromParams = () => {
    const frame = [
      scaleSettings.modbus.slave & 0xFF,
      parseInt(scaleSettings.modbus.readMethod, 16) & 0xFF,
      (scaleSettings.modbus.address >> 8) & 0xFF,
      scaleSettings.modbus.address & 0xFF,
      (scaleSettings.modbus.length >> 8) & 0xFF,
      scaleSettings.modbus.length & 0xFF,
    ];
    return formatBytes(frame);
  };

  const buildTareRawDefault = () => {
    // 默认使用 0x05 写单线圈，地址0x0004，写入0xFF00
    const addr = 0x0004;
    const frame = [
      scaleSettings.modbus.slave & 0xFF,
      0x05,
      (addr >> 8) & 0xFF,
      addr & 0xFF,
      0xFF,
      0x00,
    ];
    return formatBytes(frame);
  };

  const isValidHexPayload = (hex: string) => {
    const clean = hex.replace(/[^0-9a-fA-F]/g, "").toUpperCase();
    return clean.length % 2 === 0;
  };

  const buildPreview = (rawHex: string) => {
    const cleanBytes = parseHexToBytes(rawHex);
    if (cleanBytes.length === 0) return "";
    if (scaleSettings.crc.autoCRC) {
      const [lo, hi] = crc16Modbus(cleanBytes);
      return formatBytes([...cleanBytes, lo, hi]);
    }
    return formatBytes(cleanBytes);
  };

  const handleGenerateReadHex = () => {
    const raw = buildReadRawFromParams();
    setScaleSettings(prev => ({ ...prev, presets: { ...prev.presets, readWeightHex: raw } }));
  };

  const sanitizeHexInput = (hex: string) => {
    const bytes = parseHexToBytes(hex);
    let stripped = false;
    if (bytes.length >= 4) {
      const payload = bytes.slice(0, bytes.length - 2);
      const [lo, hi] = crc16Modbus(payload);
      const tailLo = bytes[bytes.length - 2];
      const tailHi = bytes[bytes.length - 1];
      if (tailLo === lo && tailHi === hi) {
        stripped = true;
        return { clean: formatBytes(payload), stripped };
      }
    }
    return { clean: formatBytes(bytes), stripped };
  };

  const applyTareTemplate = (tpl: "A" | "B") => {
    if (tpl === "A") {
      setScaleSettings(prev => ({ ...prev, presets: { ...prev.presets, tareHex: "01 05 00 04 FF 00" } }));
    } else {
      setScaleSettings(prev => ({ ...prev, presets: { ...prev.presets, tareHex: "01 06 00 2A 00 01" } }));
    }
  };

  const getFunctionCodeFromHex = (hex: string) => {
    const bytes = parseHexToBytes(hex);
    if (bytes.length >= 2) return bytes[1];
    return null;
  };

  const replaceReadMethodTo03 = (hex: string) => {
    const bytes = parseHexToBytes(hex);
    if (bytes.length >= 2) {
      bytes[1] = 0x03;
      return formatBytes(bytes);
    }
    return hex;
  };

  const bytesFromFloat32BE = (value: number) => {
    const buf = new ArrayBuffer(4);
    const view = new DataView(buf);
    view.setFloat32(0, value, false);
    return Array.from(new Uint8Array(buf));
  };

  const float32FromBytesBE = (bytes: number[]) => {
    const buf = new ArrayBuffer(4);
    const arr = new Uint8Array(buf);
    for (let i = 0; i < 4; i++) arr[i] = bytes[i] ?? 0;
    const view = new DataView(buf);
    return view.getFloat32(0, false);
  };

  const reorderByByteOrder = (bytes: number[], order: ByteOrder) => {
    const [A, B, C, D] = bytes;
    switch (order) {
      case "ABCD": return [A, B, C, D];
      case "BADC": return [B, A, D, C];
      case "CDAB": return [C, D, A, B];
      case "DCBA": return [D, C, B, A];
      default: return [A, B, C, D];
    }
  };

  const emulateReadOnce = async () => {
    // 模拟发送/接收流程
    const payloadBytes = parseHexToBytes(scaleSettings.presets.readWeightHex);
    if (payloadBytes.length < 6) throw new Error("读重量命令无效");
    const preview = buildPreview(scaleSettings.presets.readWeightHex);
    setLastSendPreview(preview);
    await new Promise(r => setTimeout(r, 320));

    // 20% 概率模拟失败
    const fail = Math.random() < 0.2;
    if (fail) throw new Error("读取超时/校验失败");

    // 生成模拟重量 & 响应帧
    const slave = payloadBytes[0];
    const fc = payloadBytes[1];
    const val = Math.max(0, (Math.random() * 20 + 0.1));
    const base = bytesFromFloat32BE(val);
    const ordered = reorderByByteOrder(base, scaleSettings.parse.byteOrder);
    const resp = [slave, fc, 0x04, ...ordered];
    const [crcLo, crcHi] = crc16Modbus(resp);
    const rxBytes = [...resp, crcLo, crcHi];
    const rxHex = formatBytes(rxBytes);
    setLastRxHex(rxHex);

    // 解析回字节序 -> 数值
    // 这四种映射均为自反映射，再应用一次即可还原为 ABCD
    const parsedBytesABCD = reorderByByteOrder(ordered, scaleSettings.parse.byteOrder);
    const parsedKg = float32FromBytesBE(parsedBytesABCD);
    setWeightKg(parsedKg);
    return { rxHex, kg: parsedKg };
  };

  const doSingleRead = async () => {
    setReading(true);
    try {
      const { kg } = await emulateReadOnce();
      setConsecutiveFail(0);
      setSuggestRead03(false);
      return kg;
    } catch (e) {
      const fc = getFunctionCodeFromHex(scaleSettings.presets.readWeightHex);
      const nextFails = consecutiveFail + 1;
      setConsecutiveFail(nextFails);
      if (fc === 0x04 && nextFails >= 2) {
        setSuggestRead03(true);
      }
      throw e;
    } finally {
      setReading(false);
    }
  };

  const pollLoop = async () => {
    if (!polling) return;
    try {
      await doSingleRead();
    } catch (e) {
      // ignore
    } finally {
      if (polling) {
        setTimeout(pollLoop, Math.max(300, scaleSettings.poll.intervalMs));
      }
    }
  };

  const startPolling = () => {
    if (polling) return;
    setPolling(true);
    setTimeout(pollLoop, 0);
  };

  const stopPolling = () => {
    setPolling(false);
  };

  const validateChannel = async () => {
    setValidateStatus("idle");
    try {
      await doSingleRead();
      setValidateStatus("ok");
    } catch {
      if (!scaleSettings.ble.swapChannels) {
        setValidateStatus("tryingSwap");
        setScaleSettings(prev => ({ ...prev, ble: { ...prev.ble, swapChannels: true } }));
        try {
          await doSingleRead();
          setValidateStatus("ok");
          return;
        } catch {
          // revert swap change back for UX?
        }
      }
      setValidateStatus("fail");
    }
  };

  // ---- 校验逻辑 ----
  const validateReadHex = (hex: string): string | null => {
    const bytes = parseHexToBytes(hex);
    if (bytes.length < 6) return "长度不足，至少需要6字节";
    const fc = bytes[1];
    if (fc !== 0x03 && fc !== 0x04) return "功能码应为 0x03 或 0x04";
    return null;
  };

  const validateTareHex = (hex: string): string | null => {
    const bytes = parseHexToBytes(hex);
    if (bytes.length < 6) return "长度不足，至少需要6字节";
    const fc = bytes[1];
    if (fc !== 0x05 && fc !== 0x06) return "功能码应为 0x05 或 0x06";
    return null;
  };

  const handleSaveBasic = () => {
    // 规范化并二次校验
    const sanRead = sanitizeHexInput(scaleSettings.presets.readWeightHex).clean;
    const sanTare = sanitizeHexInput(scaleSettings.presets.tareHex).clean;
    const rErr = validateReadHex(sanRead);
    const tErr = validateTareHex(sanTare);
    setReadHexError(rErr);
    setTareHexError(tErr);
    if (rErr || tErr) return;
    const next = {
      ...scaleSettings,
      presets: { readWeightHex: sanRead, tareHex: sanTare },
    };
    setScaleSettings(next);
    try {
      localStorage.setItem("scale.basic", JSON.stringify(next));
      alert("设置已保存");
    } catch {}
  };

  // ---- 初始化：从本地存储恢复 ----
  useEffect(() => {
    try {
      const raw = localStorage.getItem("scale.basic");
      if (!raw) return;
      const data = JSON.parse(raw);
      setScaleSettings(prev => ({
        ...prev,
        ...data,
        presets: { ...prev.presets, ...(data.presets || {}) },
        parse: { ...prev.parse, ...(data.parse || {}) },
        poll: { ...prev.poll, ...(data.poll || {}) },
        ble: { ...prev.ble, ...(data.ble || {}) },
      }));
      // 设置下拉选择状态
      const svc = (data.ble?.service || "FFF0").toUpperCase();
      const wrt = (data.ble?.write || "FFF2").toUpperCase();
      const ntf = (data.ble?.notify || "FFF1").toUpperCase();
      setBleSelect({
        service: svc === "FFF0" ? "FFF0" : "custom",
        write: wrt === "FFF2" ? "FFF2" : wrt === "FFF1" ? "FFF1" : "custom",
        notify: ntf === "FFF1" ? "FFF1" : ntf === "FFF2" ? "FFF2" : "custom",
      });
    } catch {}
  }, []);

  

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
        
        {/* 称重设置卡片（Basic） - 移至页面底部 */}
        <div className="bg-card rounded-2xl border border-border p-6" style={{ boxShadow: "0 8px 32px rgba(0,0,0,0.12)" }}>
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 bg-industrial-blue/10 rounded-[var(--radius-input)] flex items-center justify-center">
              <Scale className="w-5 h-5 text-[var(--color-industrial-blue)]" />
            </div>
            <div className="flex-1 ml-3">
              <h3 className="text-lg font-semibold text-foreground">称重设置（Basic）</h3>
              <p className="text-sm text-muted-foreground">仅保留必要 6 项，自动 CRC 与超时/重试已内置</p>
            </div>
            {!isEditingBasic ? (
              <Button
                variant="outline"
                className="h-9 px-3"
                onClick={() => {
                  setBasicBackup(JSON.parse(JSON.stringify(scaleSettings)));
                  setIsEditingBasic(true);
                }}
              >
                <Pencil className="w-4 h-4 mr-2" /> 编辑
              </Button>
            ) : (
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  className="h-9 px-3"
                  onClick={() => {
                    if (basicBackup) setScaleSettings(basicBackup);
                    setReadHexError(null);
                    setTareHexError(null);
                    setIsEditingBasic(false);
                  }}
                >
                  取消
                </Button>
                <Button
                  className="h-9 px-3 bg-industrial-blue text-white"
                  onClick={() => {
                    handleSaveBasic();
                    if (!readHexError && !tareHexError) setIsEditingBasic(false);
                  }}
                >
                  <SaveIcon className="w-4 h-4 mr-2" /> 保存
                </Button>
              </div>
            )}
          </div>

          {/* 1. 读重量 HEX（不含 CRC） */}
          <div className="space-y-2 mb-4">
            <Label className="text-sm text-muted-foreground">读重量 HEX（不含 CRC）</Label>
            <Input
              disabled={fieldsDisabled}
              value={scaleSettings.presets.readWeightHex}
              onChange={(e) => {
                const v = e.target.value.toUpperCase().replace(/[^0-9A-F ]/g, "");
                setScaleSettings(prev => ({ ...prev, presets: { ...prev.presets, readWeightHex: v } }));
                if (readHexError) setReadHexError(null);
              }}
              onBlur={() => {
                const { clean, stripped } = sanitizeHexInput(scaleSettings.presets.readWeightHex);
                const err = validateReadHex(clean);
                setReadHexError(err);
                setScaleSettings(prev => ({ ...prev, presets: { ...prev.presets, readWeightHex: clean } }));
                if (stripped) {
                  setStripNotice("已移除 CRC");
                  setTimeout(() => setStripNotice(null), 1500);
                }
              }}
              placeholder="01 04 00 06 00 02"
              className={`bg-input border-border focus:border-industrial-blue font-mono ${(!isValidHexPayload(scaleSettings.presets.readWeightHex) || readHexError) ? 'border-[var(--color-warning-red)]' : ''}`}
            />
            <div className="text-xs text-muted-foreground">不含 CRC。读输入寄存器 0x0006 长度 2（float32）。若仅支持 0x03，可改为 01 03 00 06 00 02。</div>
            {stripNotice && <div className="text-xs text-[var(--color-safety-green)]">{stripNotice}</div>}
            {readHexError && <div className="text-xs text-[var(--color-warning-red)]">{readHexError}</div>}
            <div className="text-xs text-muted-foreground">自动CRC：<span className="font-mono">{(() => { const b = parseHexToBytes(scaleSettings.presets.readWeightHex); if (b.length>0){ const [lo,hi]=crc16Modbus(b); return formatBytes([lo,hi]); } return '--'; })()}</span></div>
            <div className="text-xs text-muted-foreground">将发送：<span className="font-mono">{buildPreview(scaleSettings.presets.readWeightHex) || '--'}</span></div>
            {suggestRead03 && (
              <div className="text-xs text-[var(--color-warning-red)] flex items-center gap-2">
                建议切换 0x03 模板
                <Button size="sm" variant="outline" className="h-6 px-2" onClick={() => {
                  setScaleSettings(prev => ({ ...prev, presets: { ...prev.presets, readWeightHex: replaceReadMethodTo03(prev.presets.readWeightHex) } }));
                  setSuggestRead03(false);
                }}>一键替换</Button>
              </div>
            )}
          </div>

          {/* 2. 去皮 HEX（模板 + 可编辑） */}
          <div className="space-y-2 mb-4">
            <div className="flex items-center gap-3">
              <Label className="text-sm text-muted-foreground">去皮 HEX（不含 CRC）</Label>
            <Select defaultValue="A" onValueChange={(v) => applyTareTemplate(v as "A" | "B") }>
                <SelectTrigger disabled={fieldsDisabled} className="h-8 w-44 bg-input border-border">
                  <SelectValue placeholder="选择模板" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="A">A：0x05 写单线圈</SelectItem>
                  <SelectItem value="B">B：0x06 写单寄存器</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Input
              disabled={fieldsDisabled}
              value={scaleSettings.presets.tareHex}
              onChange={(e) => {
                const v = e.target.value.toUpperCase().replace(/[^0-9A-F ]/g, "");
                setScaleSettings(prev => ({ ...prev, presets: { ...prev.presets, tareHex: v } }));
                if (tareHexError) setTareHexError(null);
              }}
              onBlur={() => {
                const { clean, stripped } = sanitizeHexInput(scaleSettings.presets.tareHex);
                const err = validateTareHex(clean);
                setTareHexError(err);
                setScaleSettings(prev => ({ ...prev, presets: { ...prev.presets, tareHex: clean } }));
                if (stripped) {
                  setStripNotice("已移除 CRC");
                  setTimeout(() => setStripNotice(null), 1500);
                }
              }}
              placeholder="01 05 00 04 FF 00"
              className={`bg-input border-border focus:border-industrial-blue font-mono ${(!isValidHexPayload(scaleSettings.presets.tareHex) || tareHexError) ? 'border-[var(--color-warning-red)]' : ''}`}
            />
            <div className="text-xs text-muted-foreground">不含 CRC。模板 A：01 05 00 04 FF 00；模板 B 示例：01 06 00 2A 00 01。</div>
            {tareHexError && <div className="text-xs text-[var(--color-warning-red)]">{tareHexError}</div>}
            <div className="text-xs text-muted-foreground">自动CRC：<span className="font-mono">{(() => { const b = parseHexToBytes(scaleSettings.presets.tareHex); if (b.length>0){ const [lo,hi]=crc16Modbus(b); return formatBytes([lo,hi]); } return '--'; })()}</span></div>
            <div className="text-xs text-muted-foreground">将发送：<span className="font-mono">{buildPreview(scaleSettings.presets.tareHex) || '--'}</span></div>
          </div>

          {/* 3. 轮询间隔（ms） & 4. 解析顺序 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-4">
            <div className="space-y-2">
              <Label className="text-sm text-muted-foreground">轮询间隔（ms）</Label>
              <Input
                disabled={fieldsDisabled}
                type="number"
                min={300}
                max={5000}
                step={100}
                value={scaleSettings.poll.intervalMs}
                onChange={(e) => setScaleSettings(prev => ({ ...prev, poll: { ...prev.poll, intervalMs: Math.min(5000, Math.max(300, Number(e.target.value || 300))) } }))}
                className="bg-input border-border focus:border-industrial-blue w-40"
              />
              <div className="text-xs text-muted-foreground">建议 ≥500–1000ms（事件驱动调度，避免堆积）</div>
            </div>
            <div className="space-y-2">
              <Label className="text-sm text-muted-foreground">解析顺序（字节序）</Label>
              <Select value={scaleSettings.parse.byteOrder} onValueChange={(v: ByteOrder) => setScaleSettings(prev => ({ ...prev, parse: { ...prev.parse, byteOrder: v } }))}>
                <SelectTrigger disabled={fieldsDisabled} className="bg-input border-border focus:border-industrial-blue">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ABCD">ABCD</SelectItem>
                  <SelectItem value="BADC">BADC</SelectItem>
                  <SelectItem value="CDAB">CDAB</SelectItem>
                  <SelectItem value="DCBA">DCBA</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* 5. 重量回显 */}
          <div className="bg-muted border border-border rounded-[var(--radius-card)] p-4 mb-4">
            <div className="flex items-end gap-4">
              <div className="text-4xl font-bold text-foreground min-w-[200px]">{weightKg?.toFixed(2) ?? '--'}<span className="text-xl ml-2 text-muted-foreground">kg</span></div>
              <div className="flex items-center gap-3">
                <Button onClick={() => doSingleRead().catch(()=>{})} disabled={polling || reading} className="h-9 px-4 bg-industrial-blue text-white rounded-lg">读取重量</Button>
                <Button
                  variant="outline"
                  disabled={sendingTare || reading}
                  className="h-9 px-4"
                  onClick={async () => {
                    const ok = confirm("确认执行去皮？将发送当前去皮HEX（自动CRC）到仪表。");
                    if (!ok) return;
                    const err = validateTareHex(scaleSettings.presets.tareHex);
                    if (err) { alert(`去皮HEX无效：${err}`); return; }
                    try {
                      setSendingTare(true);
                      const preview = buildPreview(scaleSettings.presets.tareHex);
                      setLastSendPreview(preview);
                      await new Promise(r => setTimeout(r, 200));
                      const bytes = parseHexToBytes(scaleSettings.presets.tareHex);
                      const [lo, hi] = crc16Modbus(bytes);
                      const rx = formatBytes([...bytes, lo, hi]);
                      setLastRxHex(rx);
                      await doSingleRead().catch(()=>{});
                    } finally { setSendingTare(false); }
                  }}
                >去皮</Button>
              </div>
            </div>
            <div className="text-xs text-muted-foreground mt-3">最近 RX：<span className="font-mono break-all">{lastRxHex || '--'}</span></div>
            <div className="text-xs text-muted-foreground">解析：{weightKg != null ? `${weightKg.toFixed(2)} kg` : '--'}</div>
            <div className="mt-3 flex items-center gap-3">
              <span className="text-sm text-muted-foreground">轮询</span>
              <Switch checked={polling} onCheckedChange={(v) => v ? startPolling() : stopPolling()} />
              <span className="text-xs text-muted-foreground">间隔 {Math.max(300, scaleSettings.poll.intervalMs)} ms</span>
            </div>
          </div>

          {/* 6. 蓝牙通道 */}
          <div className="space-y-3">
            <h4 className="font-medium text-foreground">蓝牙通道</h4>
            <div className="flex items-center gap-6">
              <label className="flex items-center gap-2 text-sm text-foreground">
                <input type="radio" name="blemode" value="auto" checked={scaleSettings.ble.mode === 'auto'} onChange={() => setScaleSettings(prev => ({ ...prev, ble: { ...prev.ble, mode: 'auto' } }))} disabled={fieldsDisabled} /> 自动（默认）
              </label>
              <label className="flex items-center gap-2 text-sm text-foreground">
                <input type="radio" name="blemode" value="manual" checked={scaleSettings.ble.mode === 'manual'} onChange={() => setScaleSettings(prev => ({ ...prev, ble: { ...prev.ble, mode: 'manual' } }))} disabled={fieldsDisabled} /> 手动
              </label>
            </div>
            {scaleSettings.ble.mode === 'manual' ? (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm text-muted-foreground">Service</Label>
                  <Select value={bleSelect.service} onValueChange={(val) => { setBleSelect(prev => ({ ...prev, service: val as any })); if (val !== 'custom') setScaleSettings(prev => ({ ...prev, ble: { ...prev.ble, service: val.toUpperCase() } })); }}>
                    <SelectTrigger disabled={fieldsDisabled} className="bg-input border-border focus:border-industrial-blue">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="FFF0">FFF0</SelectItem>
                      <SelectItem value="custom">自定义</SelectItem>
                    </SelectContent>
                  </Select>
                  {bleSelect.service === 'custom' && (
                    <Input disabled={fieldsDisabled} value={scaleSettings.ble.service} onChange={(e) => setScaleSettings(prev => ({ ...prev, ble: { ...prev.ble, service: e.target.value } }))} className="bg-input border-border focus:border-industrial-blue font-mono" />
                  )}
                </div>
                <div className="space-y-2">
                  <Label className="text-sm text-muted-foreground">Write</Label>
                  <Select value={bleSelect.write} onValueChange={(val) => { setBleSelect(prev => ({ ...prev, write: val as any })); if (val !== 'custom') setScaleSettings(prev => ({ ...prev, ble: { ...prev.ble, write: val.toUpperCase() } })); }}>
                    <SelectTrigger disabled={fieldsDisabled} className="bg-input border-border focus:border-industrial-blue">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="FFF2">FFF2</SelectItem>
                      <SelectItem value="FFF1">FFF1</SelectItem>
                      <SelectItem value="custom">自定义</SelectItem>
                    </SelectContent>
                  </Select>
                  {bleSelect.write === 'custom' && (
                    <Input disabled={fieldsDisabled} value={scaleSettings.ble.write} onChange={(e) => setScaleSettings(prev => ({ ...prev, ble: { ...prev.ble, write: e.target.value } }))} className="bg-input border-border focus:border-industrial-blue font-mono" />
                  )}
                </div>
                <div className="space-y-2">
                  <Label className="text-sm text-muted-foreground">Notify</Label>
                  <Select value={bleSelect.notify} onValueChange={(val) => { setBleSelect(prev => ({ ...prev, notify: val as any })); if (val !== 'custom') setScaleSettings(prev => ({ ...prev, ble: { ...prev.ble, notify: val.toUpperCase() } })); }}>
                    <SelectTrigger disabled={fieldsDisabled} className="bg-input border-border focus:border-industrial-blue">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="FFF1">FFF1</SelectItem>
                      <SelectItem value="FFF2">FFF2</SelectItem>
                      <SelectItem value="custom">自定义</SelectItem>
                    </SelectContent>
                  </Select>
                  {bleSelect.notify === 'custom' && (
                    <Input disabled={fieldsDisabled} value={scaleSettings.ble.notify} onChange={(e) => setScaleSettings(prev => ({ ...prev, ble: { ...prev.ble, notify: e.target.value } }))} className="bg-input border-border focus:border-industrial-blue font-mono" />
                  )}
                </div>
                <div className="space-y-2 col-span-3">
                  <Label className="text-sm text-muted-foreground">通道对调</Label>
                  <div className="h-10 px-3 flex items-center bg-input border border-border rounded-[var(--radius-input)]">
                    <Switch disabled={fieldsDisabled} checked={scaleSettings.ble.swapChannels} onCheckedChange={(v) => setScaleSettings(prev => ({ ...prev, ble: { ...prev.ble, swapChannels: !!v } }))} />
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-xs text-muted-foreground">自动：首选 FFF2 写、FFF1 通知；失败自动尝试“通道对调”，再回退按特征能力枚举。</div>
            )}
            <div className="flex items-center gap-3">
              <Button onClick={validateChannel} variant="outline" className="h-9 px-4">验证通道（用读重量）</Button>
              {validateStatus === 'ok' && <span className="text-xs text-[var(--color-safety-green)]">可用</span>}
              {validateStatus === 'tryingSwap' && <span className="text-xs text-muted-foreground">尝试通道对调...</span>}
              {validateStatus === 'fail' && <span className="text-xs text-[var(--color-warning-red)]">验证失败，建议改用手动通道</span>}
            </div>
            {isEditingBasic && (
            <div className="flex justify-end gap-4 mt-4">
              <Button variant="outline" className="h-9 px-4" onClick={() => {
                setScaleSettings({
                  presets: { readWeightHex: "01 04 00 06 00 02", tareHex: "01 05 00 04 FF 00" },
                  crc: { autoCRC: true },
                  modbus: { slave: 1, readMethod: "04", address: 0x0006, length: 2 },
                  parse: { byteOrder: "DCBA" },
                  timing: { timeout: 1.8, maxRetries: 2 },
                  poll: { enable: false, intervalMs: 800 },
                  ble: { service: "FFF0", write: "FFF2", notify: "FFF1", swapChannels: false, manualChannel: false, mode: scaleSettings.ble.mode },
                });
                setBleSelect({ service: "FFF0", write: "FFF2", notify: "FFF1" });
                setReadHexError(null); setTareHexError(null);
              }}>恢复默认</Button>
              <Button className="h-9 px-4 bg-industrial-blue text-white" onClick={handleSaveBasic}>保存设置</Button>
            </div>
            )}
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
