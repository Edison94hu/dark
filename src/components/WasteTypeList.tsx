import { useState } from "react";
import { WasteTypeCard, WasteType } from "./WasteTypeCard";
import { TrendingUp, Hash } from "lucide-react";

export type SortMode = "frequency" | "custom";

interface WasteTypeListProps {
  wasteTypes: WasteType[];
  selectedId: string | null;
  sortMode: SortMode;
  onSelect: (id: string) => void;
  onSortModeChange: (mode: SortMode) => void;
  onReorder: (newOrder: WasteType[]) => void;
}

export function WasteTypeList({
  wasteTypes,
  selectedId,
  sortMode,
  onSelect,
  onSortModeChange,
  onReorder
}: WasteTypeListProps) {
  const [draggedItem, setDraggedItem] = useState<string | null>(null);

  // Sort waste types based on current mode
  const sortedWasteTypes = [...wasteTypes].sort((a, b) => {
    if (sortMode === "frequency") {
      return b.frequency - a.frequency;
    }
    // Custom order - maintain current order
    return 0;
  });

  const handleDragStart = (e: React.DragEvent, id: string) => {
    if (sortMode === "custom") {
      setDraggedItem(id);
      e.dataTransfer.effectAllowed = "move";
    } else {
      e.preventDefault();
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    if (sortMode === "custom" && draggedItem) {
      e.preventDefault();
      e.dataTransfer.dropEffect = "move";
    }
  };

  const handleDrop = (e: React.DragEvent, targetId: string) => {
    if (sortMode === "custom" && draggedItem && draggedItem !== targetId) {
      e.preventDefault();
      
      const draggedIndex = wasteTypes.findIndex(item => item.id === draggedItem);
      const targetIndex = wasteTypes.findIndex(item => item.id === targetId);
      
      if (draggedIndex !== -1 && targetIndex !== -1) {
        const newOrder = [...wasteTypes];
        const [draggedWaste] = newOrder.splice(draggedIndex, 1);
        newOrder.splice(targetIndex, 0, draggedWaste);
        onReorder(newOrder);
      }
    }
    setDraggedItem(null);
  };

  const handleDragEnd = () => {
    setDraggedItem(null);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Compressed Header - 适应1024×768 */}
      <div className="flex flex-col gap-2 mb-3">
        <h2 className="text-lg font-semibold text-foreground tracking-wide">危废类别</h2>
        
        {/* Compact iPad-style Segmented Control - 更小尺寸 */}
        <div className="bg-muted p-0.5 rounded-lg shadow-inner backdrop-blur-sm border border-border">
          <div className="flex relative">
            <button
              onClick={() => onSortModeChange("frequency")}
              className={`flex-1 py-1.5 px-2.5 rounded-md text-xs font-semibold transition-all duration-300 
                         flex items-center justify-center gap-1 relative z-10 ${
                sortMode === "frequency"
                  ? 'bg-industrial-blue text-white shadow-md shadow-industrial-blue/20 transform scale-[1.005]'
                  : 'text-muted-foreground hover:text-foreground hover:bg-accent'
              }`}
            >
              <TrendingUp className="w-3 h-3" />
              <span>频次</span>
            </button>
            <button
              onClick={() => onSortModeChange("custom")}
              className={`flex-1 py-1.5 px-2.5 rounded-md text-xs font-semibold transition-all duration-300 
                         flex items-center justify-center gap-1 relative z-10 ${
                sortMode === "custom"
                  ? 'bg-industrial-blue text-white shadow-md shadow-industrial-blue/20 transform scale-[1.005]'
                  : 'text-muted-foreground hover:text-foreground hover:bg-accent'
              }`}
            >
              <Hash className="w-3 h-3" />
              <span>自定义</span>
            </button>
          </div>
        </div>

        {/* Compact Sort mode indicator - 更小字体 */}
        <div className="text-xs text-muted-foreground px-0.5">
          {sortMode === "frequency" ? "按频次排序" : "拖拽调整顺序"}
        </div>
      </div>

      {/* Compressed Scrollable List - 减少间距 */}
      <div className="flex-1 overflow-y-auto space-y-1.5 px-0.5 py-0.5 scrollbar-thin scrollbar-track-gray-100 scrollbar-thumb-gray-300 hover:scrollbar-thumb-gray-400">
        {sortedWasteTypes.map((wasteType) => (
          <div
            key={wasteType.id}
            draggable={sortMode === "custom"}
            onDragStart={(e) => handleDragStart(e, wasteType.id)}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, wasteType.id)}
            onDragEnd={handleDragEnd}
            className={`
              transition-all duration-200 rounded-lg
              ${sortMode === "custom" ? 'cursor-move hover:scale-[1.005]' : 'cursor-pointer'}
              ${draggedItem === wasteType.id ? 'opacity-50 transform rotate-1 scale-105' : ''}
            `}
          >
            <WasteTypeCard
              wasteType={wasteType}
              isSelected={selectedId === wasteType.id}
              onClick={() => onSelect(wasteType.id)}
              isDragging={draggedItem === wasteType.id}
              isDraggable={sortMode === "custom"}
            />
          </div>
        ))}
      </div>

      {/* Compact Statistics - 更紧凑 */}
      <div className="mt-2 pt-2 border-t border-border">
        <div className="bg-card/50 rounded-lg p-2.5 backdrop-blur-sm border border-border">
          <div className="flex justify-between items-center text-center">
            <div className="flex items-center gap-1.5">
              <div className="text-base font-bold text-industrial-blue">
                {wasteTypes.length}
              </div>
              <div className="text-xs text-muted-foreground">类型</div>
            </div>
            <div className="flex items-center gap-1.5">
              <div className={`text-base font-bold ${selectedId ? 'text-safety-green' : 'text-muted-foreground'}`}>
                {selectedId ? '✓' : '○'}
              </div>
              <div className="text-xs text-muted-foreground">
                {selectedId ? '已选择' : '未选择'}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}