import { useState, useEffect } from "react";
import { 
  X, 
  Search, 
  RefreshCw, 
  Bluetooth, 
  Signal, 
  CheckCircle, 
  AlertCircle,
  Scale,
  Printer,
  Battery,
  Clock
} from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Switch } from "./ui/switch";

type DeviceType = 'scale' | 'printer';
type PanelState = 'scanning' | 'pairing' | 'connected' | 'error';

interface DiscoveredDevice {
  id: string;
  name: string;
  address: string;
  rssi: number;
  lastSeen: string;
  deviceType: DeviceType;
}

interface BluetoothConnectionPanelProps {
  deviceType: DeviceType;
  onClose: () => void;
  onConnectionSuccess: () => void;
}

export function BluetoothConnectionPanel({ 
  deviceType, 
  onClose, 
  onConnectionSuccess 
}: BluetoothConnectionPanelProps) {
  const [panelState, setPanelState] = useState<PanelState>('scanning');
  const [searchQuery, setSearchQuery] = useState('');
  const [discoveredDevices, setDiscoveredDevices] = useState<DiscoveredDevice[]>([]);
  const [selectedDevice, setSelectedDevice] = useState<DiscoveredDevice | null>(null);
  const [isScanning, setIsScanning] = useState(true);
  const [autoConnect, setAutoConnect] = useState(true);
  const [pairingPin, setPairingPin] = useState('');
  const [connectionProgress, setConnectionProgress] = useState(0);
  const [connectionMessage, setConnectionMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Mock devices for demonstration
  const mockDevices: DiscoveredDevice[] = [
    {
      id: '1',
      name: 'Sartorius BSA124S',
      address: '00:1B:DC:07:31:AE',
      rssi: -45,
      lastSeen: '刚刚',
      deviceType: 'scale'
    },
    {
      id: '2',
      name: 'Sartorius Cubis II',
      address: '00:1B:DC:07:32:BF',
      rssi: -62,
      lastSeen: '2分钟前',
      deviceType: 'scale'
    },
    {
      id: '3',
      name: 'Brother QL-820NWB',
      address: '00:80:77:31:A6:C8',
      rssi: -38,
      lastSeen: '刚刚',
      deviceType: 'printer'
    },
    {
      id: '4',
      name: 'Brother QL-1110NWB',
      address: '00:80:77:31:A7:D9',
      rssi: -55,
      lastSeen: '1分钟前',
      deviceType: 'printer'
    }
  ];

  // Simulate device discovery
  useEffect(() => {
    if (isScanning) {
      const timer = setTimeout(() => {
        const filteredDevices = mockDevices.filter(device => 
          device.deviceType === deviceType &&
          (searchQuery === '' || 
           device.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
           device.address.toLowerCase().includes(searchQuery.toLowerCase()))
        );
        setDiscoveredDevices(filteredDevices);
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [isScanning, searchQuery, deviceType]);

  const getDeviceTypeInfo = () => {
    switch (deviceType) {
      case 'scale':
        return {
          icon: Scale,
          title: '蓝牙称重机',
          description: '搜索并连接蓝牙称重设备'
        };
      case 'printer':
        return {
          icon: Printer,
          title: '蓝牙标签打印机',
          description: '搜索并连接蓝牙打印设备'
        };
    }
  };

  const getSignalStrength = (rssi: number) => {
    if (rssi > -50) return 4;
    if (rssi > -60) return 3;
    if (rssi > -70) return 2;
    return 1;
  };

  const renderSignalBars = (rssi: number) => {
    const strength = getSignalStrength(rssi);
    return (
      <div className="flex items-end gap-0.5">
        {Array.from({ length: 4 }, (_, i) => (
          <div
            key={i}
            className={`w-1.5 rounded-sm transition-colors ${
              i < strength 
                ? 'bg-safety-green' 
                : 'bg-border'
            }`}
            style={{ height: `${8 + i * 3}px` }}
          />
        ))}
      </div>
    );
  };

  const handleDeviceConnect = async (device: DiscoveredDevice) => {
    setSelectedDevice(device);
    setPanelState('pairing');
    setConnectionProgress(0);
    setConnectionMessage('正在配对...');

    // Simulate connection process
    const steps = [
      { progress: 20, message: '正在配对...' },
      { progress: 40, message: '请求权限...' },
      { progress: 60, message: '建立连接...' },
      { progress: 80, message: '验证设备...' },
      { progress: 100, message: '连接成功!' }
    ];

    for (const step of steps) {
      await new Promise(resolve => setTimeout(resolve, 800));
      setConnectionProgress(step.progress);
      setConnectionMessage(step.message);
    }

    // Check if we need PIN for this device (simulate)
    if (Math.random() > 0.7) {
      // Some devices require PIN
      setConnectionMessage('请输入配对码');
      return;
    }

    setTimeout(() => {
      setPanelState('connected');
    }, 500);
  };

  const handlePinSubmit = () => {
    if (pairingPin.length === 6) {
      setConnectionMessage('验证配对码...');
      setConnectionProgress(100);
      setTimeout(() => {
        setPanelState('connected');
      }, 1000);
    }
  };

  const handleRetry = () => {
    setPanelState('scanning');
    setSelectedDevice(null);
    setConnectionProgress(0);
    setConnectionMessage('');
    setErrorMessage('');
    setPairingPin('');
    setIsScanning(true);
  };

  const handleComplete = () => {
    onConnectionSuccess();
    onClose();
  };

  const handleRefresh = () => {
    setIsScanning(true);
    setDiscoveredDevices([]);
    setTimeout(() => setIsScanning(false), 2000);
  };

  const deviceTypeInfo = getDeviceTypeInfo();
  const DeviceIcon = deviceTypeInfo.icon;

  return (
    <div className="w-full h-full bg-background flex flex-col">
      {/* Header */}
      <div className="flex-shrink-0 bg-muted/20 border-b border-border/30 px-8 py-6">
        <div className="max-w-[1600px] mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-industrial-blue/10 flex items-center justify-center">
              <DeviceIcon className="w-6 h-6 text-industrial-blue" />
            </div>
            <div>
              <h2 className="text-2xl font-medium text-foreground">{deviceTypeInfo.title}</h2>
              <p className="text-muted-foreground text-sm">{deviceTypeInfo.description}</p>
            </div>
          </div>
          <Button
            onClick={onClose}
            className="bg-industrial-blue hover:bg-industrial-blue-dark text-white shadow-md 
                       hover:shadow-industrial-blue/20 transition-all duration-200"
          >
            <X className="w-4 h-4 mr-2" />
            关闭
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        <div className="max-w-[1600px] mx-auto h-full p-8">
          {panelState === 'scanning' && (
            <div className="h-full flex flex-col">
              {/* Search Section */}
              <div className="flex-shrink-0 bg-muted/20 rounded-xl p-6 border border-border/30 shadow-sm mb-6">
                <div className="flex gap-4 items-end">
                  <div className="flex-1">
                    <label className="text-sm font-medium text-foreground mb-2 block">搜索设备</label>
                    <Input
                      placeholder="输入设备名称或MAC地址进行搜索..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="bg-input-background border-border text-foreground"
                    />
                  </div>
                  <Button
                    onClick={handleRefresh}
                    disabled={isScanning}
                    className="bg-industrial-blue hover:bg-industrial-blue-dark text-white shadow-md 
                               hover:shadow-industrial-blue/20 transition-all duration-200"
                  >
                    <RefreshCw className={`w-4 h-4 mr-2 ${isScanning ? 'animate-spin' : ''}`} />
                    {isScanning ? '搜索中...' : '刷新搜索'}
                  </Button>
                </div>
              </div>

              {/* Device List */}
              <div className="flex-1 bg-muted/20 rounded-xl border border-border/30 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-border/30">
                  <h3 className="font-medium text-foreground mb-1">发现的设备</h3>
                  <p className="text-sm text-muted-foreground">点击设备进行连接</p>
                </div>
                
                <div className="flex-1 overflow-y-auto p-6">
                  {isScanning ? (
                    <div className="flex items-center justify-center py-20">
                      <div className="text-center">
                        <div className="w-16 h-16 rounded-xl bg-industrial-blue/10 flex items-center justify-center mx-auto mb-4">
                          <Search className="w-8 h-8 text-industrial-blue animate-pulse" />
                        </div>
                        <h4 className="font-medium text-foreground mb-2">正在搜索设备...</h4>
                        <p className="text-sm text-muted-foreground">请确保目标设备已开启并处于可发现模式</p>
                      </div>
                    </div>
                  ) : discoveredDevices.length > 0 ? (
                    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
                      {discoveredDevices.map((device) => (
                        <div
                          key={device.id}
                          className="bg-card/60 border border-border/20 rounded-xl p-6 hover:bg-card/80 
                                   hover:shadow-md transition-all duration-200 cursor-pointer group"
                          onClick={() => handleDeviceConnect(device)}
                        >
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center gap-3">
                              <div className="w-12 h-12 rounded-xl bg-industrial-blue/10 flex items-center justify-center">
                                <Bluetooth className="w-6 h-6 text-industrial-blue" />
                              </div>
                              <div>
                                <h4 className="font-medium text-foreground group-hover:text-industrial-blue transition-colors">
                                  {device.name}
                                </h4>
                                <p className="text-sm text-muted-foreground">{device.address}</p>
                              </div>
                            </div>
                          </div>
                          
                          <div className="space-y-3">
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-muted-foreground">信号强度</span>
                              <div className="flex items-center gap-2">
                                {renderSignalBars(device.rssi)}
                                <span className="text-sm font-medium text-foreground">{device.rssi}dBm</span>
                              </div>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-muted-foreground">最后发现</span>
                              <div className="flex items-center gap-1">
                                <Clock className="w-3 h-3 text-muted-foreground" />
                                <span className="text-sm font-medium text-foreground">{device.lastSeen}</span>
                              </div>
                            </div>
                          </div>
                          
                          <div className="mt-4 pt-4 border-t border-border/20">
                            <Button
                              size="sm"
                              className="w-full bg-industrial-blue hover:bg-industrial-blue-dark text-white 
                                       shadow-md hover:shadow-industrial-blue/20 transition-all duration-200"
                            >
                              <Bluetooth className="w-4 h-4 mr-2" />
                              连接设备
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex items-center justify-center py-20">
                      <div className="text-center">
                        <div className="w-16 h-16 rounded-xl bg-warning-red/10 flex items-center justify-center mx-auto mb-4">
                          <AlertCircle className="w-8 h-8 text-warning-red" />
                        </div>
                        <h4 className="font-medium text-foreground mb-2">未发现设备</h4>
                        <p className="text-sm text-muted-foreground mb-4">请确保设备已开启并处于可发现模式</p>
                        <Button
                          onClick={handleRefresh}
                          variant="outline"
                          className="border-border text-foreground hover:bg-accent"
                        >
                          <RefreshCw className="w-4 h-4 mr-2" />
                          重新搜索
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {panelState === 'pairing' && selectedDevice && (
            <div className="h-full flex items-center justify-center">
              <div className="bg-muted/20 rounded-xl border border-border/30 shadow-sm p-12 max-w-2xl w-full mx-8">
                <div className="text-center">
                  <div className="w-24 h-24 rounded-xl bg-industrial-blue/10 flex items-center justify-center mx-auto mb-6">
                    <Bluetooth className="w-12 h-12 text-industrial-blue animate-pulse" />
                  </div>
                  
                  <h3 className="text-2xl font-medium text-foreground mb-2">正在连接设备</h3>
                  <p className="text-muted-foreground mb-8">正在连接到 {selectedDevice.name}</p>
                  
                  {/* Progress Bar */}
                  <div className="w-full bg-border rounded-full h-3 mb-6">
                    <div 
                      className="bg-gradient-to-r from-industrial-blue to-safety-green h-3 rounded-full transition-all duration-500"
                      style={{ width: `${connectionProgress}%` }}
                    />
                  </div>
                  
                  <div className="bg-card/60 border border-border/20 rounded-xl p-6 mb-6">
                    <p className="text-foreground font-medium">{connectionMessage}</p>
                  </div>
                  
                  {connectionMessage.includes('配对码') && (
                    <div className="space-y-6">
                      <div>
                        <label className="text-sm font-medium text-foreground mb-2 block">输入配对码</label>
                        <Input
                          placeholder="请输入6位数字配对码"
                          value={pairingPin}
                          onChange={(e) => setPairingPin(e.target.value.slice(0, 6))}
                          className="text-center text-xl tracking-[0.5em] font-mono bg-input-background border-border text-foreground"
                          maxLength={6}
                        />
                      </div>
                      <Button
                        onClick={handlePinSubmit}
                        disabled={pairingPin.length !== 6}
                        className="w-full bg-industrial-blue hover:bg-industrial-blue-dark text-white 
                                 shadow-md hover:shadow-industrial-blue/20 transition-all duration-200 h-12"
                      >
                        <CheckCircle className="w-5 h-5 mr-2" />
                        确认配对
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {panelState === 'connected' && selectedDevice && (
            <div className="h-full flex items-center justify-center">
              <div className="bg-muted/20 rounded-xl border border-border/30 shadow-sm p-12 max-w-2xl w-full mx-8">
                <div className="text-center">
                  <div className="w-24 h-24 rounded-xl bg-safety-green/10 flex items-center justify-center mx-auto mb-6">
                    <CheckCircle className="w-12 h-12 text-safety-green" />
                  </div>
                  
                  <h3 className="text-2xl font-medium text-foreground mb-2">连接成功</h3>
                  <p className="text-muted-foreground mb-8">已成功连接到 {selectedDevice.name}</p>
                  
                  <div className="bg-card/60 border border-border/20 rounded-xl p-6 mb-8">
                    <div className="grid grid-cols-2 gap-6">
                      <div className="text-center">
                        <Bluetooth className="w-8 h-8 text-industrial-blue mx-auto mb-2" />
                        <div className="font-medium text-foreground mb-1">{selectedDevice.name}</div>
                        <div className="text-sm text-muted-foreground">{selectedDevice.address}</div>
                      </div>
                      <div className="text-center">
                        <CheckCircle className="w-8 h-8 text-safety-green mx-auto mb-2" />
                        <div className="font-medium text-foreground mb-1">连接状态</div>
                        <div className="text-sm text-safety-green font-medium">已连接</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-card/60 border border-border/20 rounded-xl p-6 mb-8">
                    <div className="flex items-center justify-between">
                      <div className="text-left">
                        <div className="font-medium text-foreground mb-1">自动连接</div>
                        <div className="text-sm text-muted-foreground">下次启动时自动连接此设备</div>
                      </div>
                      <Switch
                        checked={autoConnect}
                        onCheckedChange={setAutoConnect}
                      />
                    </div>
                  </div>
                  
                  <Button
                    onClick={handleComplete}
                    className="w-full bg-safety-green hover:bg-safety-green/80 text-white 
                             shadow-md hover:shadow-safety-green/20 transition-all duration-200 h-12"
                  >
                    <CheckCircle className="w-5 h-5 mr-2" />
                    完成连接
                  </Button>
                </div>
              </div>
            </div>
          )}

          {panelState === 'error' && (
            <div className="h-full flex items-center justify-center">
              <div className="bg-muted/20 rounded-xl border border-border/30 shadow-sm p-12 max-w-2xl w-full mx-8">
                <div className="text-center">
                  <div className="w-24 h-24 rounded-xl bg-warning-red/10 flex items-center justify-center mx-auto mb-6">
                    <AlertCircle className="w-12 h-12 text-warning-red" />
                  </div>
                  
                  <h3 className="text-2xl font-medium text-foreground mb-2">连接失败</h3>
                  <p className="text-muted-foreground mb-8">{errorMessage || '连接失败，请检查设备状态后重试'}</p>
                  
                  <div className="bg-card/60 border border-border/20 rounded-xl p-6 mb-8">
                    <div className="space-y-3 text-left">
                      <h4 className="font-medium text-foreground mb-3">可能的解决方案：</h4>
                      <div className="flex items-start gap-3">
                        <div className="w-2 h-2 rounded-full bg-industrial-blue mt-2 flex-shrink-0" />
                        <p className="text-sm text-muted-foreground">确保设备已开启并处于可发现模式</p>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-2 h-2 rounded-full bg-industrial-blue mt-2 flex-shrink-0" />
                        <p className="text-sm text-muted-foreground">检查设备与iPad的距离是否过远</p>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-2 h-2 rounded-full bg-industrial-blue mt-2 flex-shrink-0" />
                        <p className="text-sm text-muted-foreground">尝试重启设备的蓝牙功能</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <Button
                      onClick={handleRetry}
                      className="w-full bg-industrial-blue hover:bg-industrial-blue-dark text-white 
                               shadow-md hover:shadow-industrial-blue/20 transition-all duration-200 h-12"
                    >
                      <RefreshCw className="w-5 h-5 mr-2" />
                      重新搜索
                    </Button>
                    <Button
                      onClick={onClose}
                      variant="outline"
                      className="w-full border-border text-foreground hover:bg-accent h-12"
                    >
                      返回设备管理
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}