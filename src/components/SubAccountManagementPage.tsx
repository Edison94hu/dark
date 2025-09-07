import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { 
  Edit,
  Trash2,
  Plus,
  User,
  Shield,
  Eye,
  Settings,
  FileText,
  History,
  Database,
  Printer,
  MoreHorizontal
} from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Badge } from "./ui/badge";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "./ui/alert-dialog";

interface SubAccount {
  id: string;
  username: string;
  role: "操作员" | "管理员" | "查看者";
  phone: string;
  status: "启用" | "停用";
  permissions: string[];
}

type FormMode = "view" | "add" | "edit";

export function SubAccountManagementPage() {
  const location = useLocation();
  const navigate = useNavigate();
  // Mock sub accounts data
  const [subAccounts, setSubAccounts] = useState<SubAccount[]>([
    {
      id: "1",
      username: "张操作员",
      role: "操作员",
      phone: "138****8888",
      status: "启用",
      permissions: ["数据采集", "标签打印", "查看历史"]
    },
    {
      id: "2", 
      username: "李管理员",
      role: "管理员",
      phone: "139****9999",
      status: "启用",
      permissions: ["数据采集", "标签打印", "查看历史", "用户管理", "系统设置"]
    },
    {
      id: "3",
      username: "王查看员",
      role: "查看者", 
      phone: "137****7777",
      status: "停用",
      permissions: ["查看历史"]
    },
    {
      id: "4",
      username: "赵操作员",
      role: "操作员",
      phone: "136****6666",
      status: "启用",
      permissions: ["数据采集", "标签打印", "查看历史"]
    }
  ]);

  // Form state
  const [formMode, setFormMode] = useState<FormMode>("view");
  const [selectedAccountId, setSelectedAccountId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    username: "",
    role: "操作员" as SubAccount["role"],
    phone: "",
    password: "",
    confirmPassword: ""
  });

  // Get role-based permissions
  const getRolePermissions = (role: SubAccount["role"]): string[] => {
    switch (role) {
      case "操作员":
        return ["数据采集", "标签打印", "查看历史"];
      case "管理员":
        return ["数据采集", "标签打印", "查看历史", "用户管理", "系统设置"];
      case "查看者":
        return ["查看历史"];
      default:
        return [];
    }
  };

  // Get permission icon
  const getPermissionIcon = (permission: string) => {
    switch (permission) {
      case "数据采集":
        return Database;
      case "标签打印":
        return Printer;
      case "查看历史":
        return History;
      case "用户管理":
        return User;
      case "系统设置":
        return Settings;
      default:
        return FileText;
    }
  };

  // Handle add new account
  const handleAddNew = () => {
    setFormMode("add");
    setSelectedAccountId(null);
    setFormData({
      username: "",
      role: "操作员",
      phone: "",
      password: "",
      confirmPassword: ""
    });
    navigate('/profile/sub-accounts/new');
  };

  // Handle edit account
  const handleEdit = (account: SubAccount) => {
    setFormMode("edit");
    setSelectedAccountId(account.id);
    setFormData({
      username: account.username,
      role: account.role,
      phone: account.phone,
      password: "",
      confirmPassword: ""
    });
    navigate(`/profile/sub-accounts/edit/${account.id}`);
  };

  // Handle toggle status
  const handleToggleStatus = (id: string) => {
    setSubAccounts(prev => prev.map(account => 
      account.id === id 
        ? { 
            ...account, 
            status: account.status === "启用" ? "停用" : "启用"
          }
        : account
    ));
  };

  // Handle delete account
  const handleDelete = (id: string) => {
    setSubAccounts(prev => prev.filter(account => account.id !== id));
    if (selectedAccountId === id) {
      setFormMode("view");
      setSelectedAccountId(null);
    }
    navigate('/profile/sub-accounts');
  };

  // Handle form input change
  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Handle form save
  const handleSave = () => {
    // Validate form
    if (!formData.username || !formData.phone || !formData.password) {
      alert("请填写所有必填字段");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      alert("两次输入的密码不一致");
      return;
    }

    const permissions = getRolePermissions(formData.role);

    if (formMode === "add") {
      // Add new account
      const newAccount: SubAccount = {
        id: `new-${Date.now()}`,
        username: formData.username,
        role: formData.role,
        phone: formData.phone,
        status: "启用",
        permissions
      };
      setSubAccounts(prev => [...prev, newAccount]);
    } else if (formMode === "edit" && selectedAccountId) {
      // Update existing account
      setSubAccounts(prev => prev.map(account => 
        account.id === selectedAccountId
          ? {
              ...account,
              username: formData.username,
              role: formData.role,
              phone: formData.phone,
              permissions
            }
          : account
      ));
    }

    // Reset form
    setFormMode("view");
    setSelectedAccountId(null);
    setFormData({
      username: "",
      role: "操作员",
      phone: "",
      password: "",
      confirmPassword: ""
    });
    navigate('/profile/sub-accounts');
  };

  // Handle form cancel
  const handleCancel = () => {
    setFormMode("view");
    setSelectedAccountId(null);
    setFormData({
      username: "",
      role: "操作员",
      phone: "",
      password: "",
      confirmPassword: ""
    });
    navigate('/profile/sub-accounts');
  };

  // Sync state from URL
  useEffect(() => {
    const parts = location.pathname.split('/').filter(Boolean);
    // expect: ["profile", "sub-accounts", ...]
    if (parts[0] !== 'profile' || parts[1] !== 'sub-accounts') return;
    const sub = parts[2];
    if (!sub) {
      if (formMode !== 'view' || selectedAccountId !== null) {
        setFormMode('view');
        setSelectedAccountId(null);
      }
      return;
    }
    if (sub === 'new') {
      if (formMode !== 'add') {
        setFormMode('add');
        setSelectedAccountId(null);
        setFormData({ username: '', role: '操作员', phone: '', password: '', confirmPassword: '' });
      }
      return;
    }
    if (sub === 'edit') {
      const id = parts[3];
      if (id) {
        const acc = subAccounts.find(a => a.id === id);
        if (acc) {
          setFormMode('edit');
          setSelectedAccountId(id);
          setFormData({ username: acc.username, role: acc.role, phone: acc.phone, password: '', confirmPassword: '' });
          return;
        }
      }
      // fallback
      setFormMode('view');
      setSelectedAccountId(null);
      navigate('/profile/sub-accounts', { replace: true });
    }
  }, [location.pathname]);

  return (
    <div 
      className="settings-dark h-full bg-background p-6 overflow-hidden"
      style={{
        '--background': '#0b1220',
        '--foreground': '#e5e7eb',
        '--input-background': '#0b1220',
        '--card': '#0f172a',
        '--border': '#334155'
      } as any}
    >
      <div className="h-full flex gap-6">
        {/* 左侧卡片 - 子账户列表 */}
        <div className="w-[45%] bg-card rounded-2xl border border-border overflow-hidden" style={{ boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)" }}>
          {/* 标题 */}
          <div className="p-6 border-b border-border">
            <h2 className="text-xl font-semibold text-foreground">子账户管理</h2>
          </div>

          {/* 账户列表 */}
          <div className="flex-1 p-6 space-y-4 overflow-y-auto">
            {subAccounts.map((account) => (
              <div
                key={account.id}
                className={`bg-muted border-2 rounded-xl p-4 transition-all duration-200 hover:shadow-md ${
                  account.status === "启用" 
                    ? "border-[var(--color-safety-green)] hover:border-[var(--color-safety-green)]" 
                    : "border-border hover:border-border"
                }`}
              >
                {/* 用户信息头部 */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-foreground">{account.username}</h3>
                      <Badge 
                        variant={account.role === "管理员" ? "default" : account.role === "操作员" ? "secondary" : "outline"}
                        className={`text-xs ${
                          account.role === "管理员" 
                            ? "bg-[var(--color-industrial-blue)] text-white" 
                            : account.role === "操作员"
                            ? "bg-[var(--color-safety-green)] text-white"
                            : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {account.role}
                      </Badge>
                    </div>

                  </div>

                  {/* 操作按钮 */}
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleToggleStatus(account.id)}
                      className={`h-8 px-3 text-xs transition-all duration-200 ${
                        account.status === "启用"
                          ? "bg-[var(--color-safety-green)]/10 text-[var(--color-safety-green)] hover:bg-[var(--color-safety-green)] hover:text-white"
                          : "bg-muted text-muted-foreground hover:bg-accent hover:text-foreground"
                      }`}
                    >
                      {account.status === "启用" ? "停用" : "启用"}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEdit(account)}
                      className="h-8 w-8 p-0 hover:bg-[var(--color-industrial-blue)] hover:text-white"
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 hover:bg-[var(--color-warning-red)] hover:text-white"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent className="bg-card">
                        <AlertDialogHeader>
                          <AlertDialogTitle>确认删除</AlertDialogTitle>
                          <AlertDialogDescription>
                            确定要删除用户 "{account.username}" 吗？此操作无法撤销。
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>取消</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDelete(account.id)}
                            className="bg-[var(--color-warning-red)] hover:bg-red-700"
                          >
                            删除
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>

                {/* 快捷操作按钮区 */}
                <div className="pt-3 border-t border-border">
                  <div className="grid grid-cols-3 gap-2">
                    {account.permissions.map((permission) => {
                      const Icon = getPermissionIcon(permission);
                      return (
                        <button
                          key={permission}
                          className="flex items-center justify-center gap-1 px-3 py-2 bg-muted hover:bg-industrial-blue/10 hover:border-[var(--color-industrial-blue)] text-muted-foreground hover:text-[var(--color-industrial-blue)] text-xs rounded-lg border border-transparent transition-all duration-200"
                        >
                          <Icon className="w-3 h-3" />
                          <span>{permission}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 右侧卡片 - 表单区域 */}
        <div className="w-[55%] bg-card rounded-2xl border border-border overflow-hidden" style={{ boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)" }}>
          {formMode === "view" ? (
            // 默认占位符状态
            <div className="h-full flex flex-col items-center justify-center text-center p-8">
              <div className="w-24 h-24 bg-industrial-blue/10 rounded-full flex items-center justify-center mb-6">
                <User className="w-12 h-12 text-[var(--color-industrial-blue)]" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3">子账户管理中心</h3>
              <p className="text-muted-foreground mb-8 max-w-md leading-relaxed">
                统一管理企业子账户，分配不同角色权限，确保系统安全高效运行。支持操作员、管理员、查看者三种角色权限配置。
              </p>
              
              {/* 主要添加按钮 */}
              <Button
                onClick={handleAddNew}
                className="w-64 h-14 bg-[var(--color-industrial-blue)] hover:bg-[var(--color-industrial-blue-dark)] text-white rounded-xl transition-all duration-200 mb-8 shadow-lg hover:shadow-xl"
              >
                <Plus className="w-6 h-6 mr-3" />
                <span className="text-lg font-semibold">添加账户</span>
              </Button>
              
              <div className="space-y-3 text-sm text-muted-foreground">
                <div className="flex items-center gap-3 justify-center">
                  <div className="w-2 h-2 bg-[var(--color-safety-green)] rounded-full"></div>
                  <span>点击左侧账户进行编辑管理</span>
                </div>
                <div className="flex items-center gap-3 justify-center">
                  <div className="w-2 h-2 bg-[var(--color-industrial-blue)] rounded-full"></div>
                  <span>新增账户自动分配对应权限</span>
                </div>
                <div className="flex items-center gap-3 justify-center">
                  <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                  <span>快捷操作按钮直达功能模块</span>
                </div>
              </div>
            </div>
          ) : (
            // 表单编辑状态
            <div className="h-full flex flex-col">
              {/* 表单标题 */}
              <div className="p-6 border-b border-border">
                <h2 className="text-xl font-semibold text-foreground">
                  {formMode === "add" ? "新增子账户" : "编辑子账户"}
                </h2>
              </div>

              {/* 表单内容 */}
              <div className="flex-1 p-6 overflow-y-auto">
                <div className="space-y-6">
                  {/* 用户名 */}
                  <div>
                    <label className="block text-sm text-muted-foreground mb-2">用户名 *</label>
                    <Input
                      value={formData.username}
                      onChange={(e) => handleInputChange('username', e.target.value)}
                      placeholder="请输入用户名"
                      className="h-12 border-border focus:border-[var(--color-industrial-blue)] !bg-[#0b1220] text-white rounded-xl"
                    />
                  </div>

                  {/* 角色 */}
                  <div>
                    <label className="block text-sm text-muted-foreground mb-2">角色 *</label>
                    <Select
                      value={formData.role}
                      onValueChange={(value) => handleInputChange('role', value)}
                    >
                      <SelectTrigger className="h-12 border-border focus:border-[var(--color-industrial-blue)] bg-[var(--input-background)] text-foreground rounded-xl">
                        <SelectValue placeholder="请选择角色" />
                      </SelectTrigger>
                      <SelectContent className="bg-card">
                        <SelectItem value="操作员">操作员</SelectItem>
                        <SelectItem value="管理员">管理员</SelectItem>
                        <SelectItem value="查看者">查看者</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* 手机号 */}
                  <div>
                    <label className="block text-sm text-muted-foreground mb-2">手机号 *</label>
                    <input
                      type="text"
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      placeholder="请输入手机号"
                      className="h-12 w-full px-3 py-1 rounded-xl border border-border focus:border-[var(--color-industrial-blue)] focus:outline-none focus:ring-2 focus:ring-[var(--color-industrial-blue)]/20"
                      style={{ backgroundColor: '#0b1220', color: 'white' }}
                    />
                  </div>

                  {/* 密码 */}
                  <div>
                    <label className="block text-sm text-muted-foreground mb-2">密码 *</label>
                    <input
                      type="password"
                      value={formData.password}
                      onChange={(e) => handleInputChange('password', e.target.value)}
                      placeholder="请输入密码"
                      className="h-12 w-full px-3 py-1 rounded-xl border border-border focus:border-[var(--color-industrial-blue)] focus:outline-none focus:ring-2 focus:ring-[var(--color-industrial-blue)]/20"
                      style={{ backgroundColor: '#0b1220', color: 'white' }}
                    />
                  </div>

                  {/* 确认密码 */}
                  <div>
                    <label className="block text-sm text-muted-foreground mb-2">确认密码 *</label>
                    <input
                      type="password"
                      value={formData.confirmPassword}
                      onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                      placeholder="请再次输入密码"
                      className="h-12 w-full px-3 py-1 rounded-xl border border-border focus:border-[var(--color-industrial-blue)] focus:outline-none focus:ring-2 focus:ring-[var(--color-industrial-blue)]/20"
                      style={{ backgroundColor: '#0b1220', color: 'white' }}
                    />
                  </div>

                  {/* 权限预览 */}
                  <div>
                    <label className="block text-sm text-muted-foreground mb-2">权限预览</label>
                    <div className="p-4 bg-muted rounded-xl border border-border">
                      <div className="grid grid-cols-2 gap-2">
                        {getRolePermissions(formData.role).map((permission) => {
                          const Icon = getPermissionIcon(permission);
                          return (
                            <div key={permission} className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Icon className="w-4 h-4 text-[var(--color-industrial-blue)]" />
                              <span>{permission}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* 表单按钮 */}
              <div className="p-6 border-t border-border">
                <div className="flex gap-3">
                  <Button
                    onClick={handleCancel}
                    variant="outline"
                    className="flex-1 h-12 border-border text-muted-foreground hover:bg-accent rounded-xl"
                  >
                    取消
                  </Button>
                  <Button
                    onClick={handleSave}
                    className="flex-1 h-12 bg-[var(--color-industrial-blue)] hover:bg-[var(--color-industrial-blue-dark)] text-white rounded-xl"
                  >
                    保存
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
