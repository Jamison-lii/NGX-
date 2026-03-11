export default function CommunityTabs({ tabs, activeTab, onChange }) {
  return (
    <div className="flex flex-wrap gap-4 pt-4">
      {tabs.map((tab) => {
        const isActive = tab === activeTab;

        return (
          <button
            key={tab}
            onClick={() => onChange(tab)}
            className={`rounded-full px-8 py-3 text-[17px] font-medium transition-all duration-200 ${
              isActive
                ? "bg-[#e8ecfb] text-[#31344a] shadow-[0_6px_16px_rgba(117,136,217,0.14)]"
                : "text-[#9b9ca3] hover:bg-white hover:text-[#4b4d57]"
            }`}
          >
            {tab}
          </button>
        );
      })}
    </div>
  );
}