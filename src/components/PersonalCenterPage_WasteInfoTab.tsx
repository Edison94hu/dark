// 这是危废信息录入标签页的完整内容
// 用于替换PersonalCenterPage中的renderWasteInfoTab函数

  // Waste Info Tab
  const renderWasteInfoTab = () => (
    <div className="h-full overflow-hidden p-8 bg-gradient-to-br from-background via-secondary/10 to-industrial-blue/5">
      <div className="h-full flex gap-8">
        {/* Waste Records List - 30% */}
        <div className="w-[30%] flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-industrial-blue/10 to-safety-green/10 flex items-center justify-center border border-industrial-blue/20">
                <Beaker className="w-5 h-5 text-industrial-blue" />
              </div>
              <h3 className="text-lg font-medium text-industrial-blue">危废信息记录</h3>
            </div>
            <Button
              onClick={() => setShowWasteForm(true)}
              className="gap-2 bg-gradient-to-r from-industrial-blue to-safety-green hover:from-industrial-blue/80 hover:to-safety-green/80 text-white rounded-[var(--radius-button)] shadow-md hover:shadow-lg transition-all duration-200"
            >
              <Plus className="w-4 h-4" />
              添加
            </Button>
          </div>

          <div className="flex-1 overflow-auto space-y-3">
            {wasteInfoRecords.map((record) => (
              <div key={record.id} className="bg-card rounded-[var(--radius-card)] border border-industrial-blue/15 p-4 shadow-md hover:shadow-lg transition-all duration-300">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-warning-red/10 to-industrial-blue/10 flex items-center justify-center border border-warning-red/30">
                        <AlertTriangle className="w-4 h-4 text-warning-red" />
                      </div>
                      <div>
                        <h4 className="font-medium text-industrial-blue text-sm">{record.wasteName}</h4>
                        <p className="text-xs text-warning-red font-medium">{record.wasteCategory}</p>
                      </div>
                    </div>
                    <div className="space-y-2 text-xs">
                      <div className="flex items-center justify-between p-2 bg-industrial-blue/5 rounded">
                        <span className="text-neutral-gray">编号</span>
                        <span className="font-medium text-industrial-blue">{record.wasteId}</span>
                      </div>
                      <div className="flex items-center justify-between p-2 bg-safety-green/5 rounded">
                        <span className="text-neutral-gray">形态</span>
                        <span className="font-medium text-safety-green">{record.wasteForm}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2 ml-3">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEditWasteInfo(record)}
                      className="w-8 h-8 p-0 border-industrial-blue text-industrial-blue hover:bg-industrial-blue hover:text-white rounded-[var(--radius-button)]"
                    >
                      <Edit className="w-3 h-3" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteWasteInfo(record.id)}
                      className="w-8 h-8 p-0 border-warning-red text-warning-red hover:bg-warning-red hover:text-white rounded-[var(--radius-button)]"
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Waste Form - 70% */}
        {showWasteForm && (
          <div className="w-[70%] bg-card rounded-[var(--radius-card)] border border-industrial-blue/20 p-6 shadow-[var(--shadow-elevated)]">
            <div className="flex items-center justify-between mb-6 p-4 bg-gradient-to-r from-industrial-blue/8 to-safety-green/8 rounded-xl border border-industrial-blue/15">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-industrial-blue/15 to-safety-green/15 flex items-center justify-center border border-industrial-blue/20">
                  <FileText className="w-5 h-5 text-industrial-blue" />
                </div>
                <div>
                  <h3 className="text-lg font-medium text-industrial-blue">
                    {selectedWasteRecord ? '编辑危废信息' : '新增危废信息'}
                  </h3>
                  <p className="text-sm text-neutral-gray">请填写完整的危废信息资料</p>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleCancelWasteForm}
                className="border-neutral-gray text-neutral-gray hover:bg-light-gray rounded-[var(--radius-button)]"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>

            <div className="space-y-6 max-h-[calc(100vh-280px)] overflow-y-auto pr-2">
              {/* 基础信息区域 */}
              <div className="p-4 bg-gradient-to-r from-industrial-blue/5 to-safety-green/5 rounded-xl border border-industrial-blue/10">
                <div className="flex items-center gap-2 mb-4">
                  <Database className="w-4 h-4 text-industrial-blue" />
                  <h4 className="font-medium text-industrial-blue">基础信息</h4>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-neutral-gray">危废ID</label>
                    <Input
                      value={wasteFormData.wasteId}
                      onChange={(e) => handleWasteFormChange('wasteId', e.target.value)}
                      className="mt-1 rounded-[var(--radius-input)] border-medium-gray focus:border-industrial-blue focus:ring-industrial-blue/20"
                      placeholder="输入危废ID"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-neutral-gray">设施代码</label>
                    <Input
                      value={wasteFormData.facilityCode}
                      onChange={(e) => handleWasteFormChange('facilityCode', e.target.value)}
                      className="mt-1 rounded-[var(--radius-input)] border-medium-gray focus:border-industrial-blue focus:ring-industrial-blue/20"
                      placeholder="输入设施代码"
                    />
                  </div>
                </div>
                
                <div className="mt-4">
                  <label className="text-sm font-medium text-neutral-gray">危废名称</label>
                  <Input
                    value={wasteFormData.wasteName}
                    onChange={(e) => handleWasteFormChange('wasteName', e.target.value)}
                    className="mt-1 rounded-[var(--radius-input)] border-medium-gray focus:border-industrial-blue focus:ring-industrial-blue/20"
                    placeholder="输入危废名称"
                  />
                </div>
              </div>

              {/* 分类信息区域 */}
              <div className="p-4 bg-gradient-to-r from-warning-red/5 to-industrial-blue/5 rounded-xl border border-warning-red/15">
                <div className="flex items-center gap-2 mb-4">
                  <AlertTriangle className="w-4 h-4 text-warning-red" />
                  <h4 className="font-medium text-warning-red">分类信息</h4>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-neutral-gray">危废类别</label>
                    <Input
                      value={wasteFormData.wasteCategory}
                      onChange={(e) => handleWasteFormChange('wasteCategory', e.target.value)}
                      className="mt-1 rounded-[var(--radius-input)] border-medium-gray focus:border-warning-red focus:ring-warning-red/20"
                      placeholder="如：HW08"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-neutral-gray">危废代码</label>
                    <Input
                      value={wasteFormData.wasteCode}
                      onChange={(e) => handleWasteFormChange('wasteCode', e.target.value)}
                      className="mt-1 rounded-[var(--radius-input)] border-medium-gray focus:border-warning-red focus:ring-warning-red/20"
                      placeholder="如：900-041-49"
                    />
                  </div>
                </div>

                <div className="mt-4">
                  <label className="text-sm font-medium text-neutral-gray">危废形态</label>
                  <Select value={wasteFormData.wasteForm} onValueChange={(value) => handleWasteFormChange('wasteForm', value)}>
                    <SelectTrigger className="mt-1 rounded-[var(--radius-input)] border-medium-gray focus:border-warning-red focus:ring-warning-red/20">
                      <SelectValue placeholder="选择危废形态" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="固态">固态</SelectItem>
                      <SelectItem value="液态">液态</SelectItem>
                      <SelectItem value="气态">气态</SelectItem>
                      <SelectItem value="半固态">半固态</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* 成分信息区域 */}
              <div className="p-4 bg-gradient-to-r from-safety-green/5 to-industrial-blue/5 rounded-xl border border-safety-green/15">
                <div className="flex items-center gap-2 mb-4">
                  <Beaker className="w-4 h-4 text-safety-green" />
                  <h4 className="font-medium text-safety-green">成分信息</h4>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-neutral-gray">主要成分</label>
                    <Textarea
                      value={wasteFormData.mainComponents}
                      onChange={(e) => handleWasteFormChange('mainComponents', e.target.value)}
                      className="mt-1 rounded-[var(--radius-input)] border-medium-gray focus:border-safety-green focus:ring-safety-green/20"
                      placeholder="描述危废的主要成分"
                      rows={2}
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-neutral-gray">有害成分</label>
                    <Textarea
                      value={wasteFormData.harmfulComponents}
                      onChange={(e) => handleWasteFormChange('harmfulComponents', e.target.value)}
                      className="mt-1 rounded-[var(--radius-input)] border-medium-gray focus:border-warning-red focus:ring-warning-red/20"
                      placeholder="描述危废的有害成分"
                      rows={2}
                    />
                  </div>
                </div>
              </div>

              {/* 安全信息区域 */}
              <div className="p-4 bg-gradient-to-r from-industrial-blue/5 to-warning-red/5 rounded-xl border border-industrial-blue/10">
                <div className="flex items-center gap-2 mb-4">
                  <Shield className="w-4 h-4 text-industrial-blue" />
                  <h4 className="font-medium text-industrial-blue">安全信息</h4>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-neutral-gray">预防措施</label>
                    <Textarea
                      value={wasteFormData.precautions}
                      onChange={(e) => handleWasteFormChange('precautions', e.target.value)}
                      className="mt-1 rounded-[var(--radius-input)] border-medium-gray focus:border-industrial-blue focus:ring-industrial-blue/20"
                      placeholder="描述必要的预防措施"
                      rows={2}
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-neutral-gray">危险特性</label>
                    <Textarea
                      value={wasteFormData.hazardousProperties}
                      onChange={(e) => handleWasteFormChange('hazardousProperties', e.target.value)}
                      className="mt-1 rounded-[var(--radius-input)] border-medium-gray focus:border-warning-red focus:ring-warning-red/20"
                      placeholder="描述危险特性"
                      rows={2}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-4 mt-6 pt-4 border-t border-border">
              <Button 
                onClick={handleSaveWasteInfo} 
                className="flex-1 bg-gradient-to-r from-industrial-blue to-safety-green hover:from-industrial-blue/80 hover:to-safety-green/80 text-white rounded-[var(--radius-button)] shadow-md hover:shadow-lg transition-all duration-200"
              >
                <Save className="w-4 h-4 mr-2" />
                {selectedWasteRecord ? '更新信息' : '保存信息'}
              </Button>
              <Button 
                variant="outline" 
                onClick={handleCancelWasteForm}
                className="border-neutral-gray text-neutral-gray hover:bg-light-gray rounded-[var(--radius-button)]"
              >
                取消
              </Button>
            </div>
          </div>
        )}

        {/* Empty State when no form is shown */}
        {!showWasteForm && (
          <div className="w-[70%] flex items-center justify-center">
            <div className="text-center p-12 bg-gradient-to-br from-industrial-blue/5 to-safety-green/5 rounded-[var(--radius-card)] border border-industrial-blue/10">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-industrial-blue/10 to-safety-green/10 flex items-center justify-center mx-auto mb-4 border border-industrial-blue/20">
                <FileText className="w-8 h-8 text-industrial-blue" />
              </div>
              <h3 className="text-lg font-medium text-industrial-blue mb-2">选择或新增危废信息</h3>
              <p className="text-neutral-gray text-sm mb-6">点击左侧记录进行编辑，或点击"添加"按钮新增危废信息</p>
              <Button
                onClick={() => setShowWasteForm(true)}
                className="gap-2 bg-gradient-to-r from-industrial-blue to-safety-green hover:from-industrial-blue/80 hover:to-safety-green/80 text-white rounded-[var(--radius-button)] shadow-md hover:shadow-lg transition-all duration-200"
              >
                <Plus className="w-4 h-4" />
                新增危废信息
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );