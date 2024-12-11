const Tabs = ({activeTab, setActiveTab, tabs, className} : {
    activeTab: string,
    setActiveTab: (type : string | any) => void,
    tabs: {id: string, label: string}[],
    className?: string
}) => {
    return (
        <div
        role="tablist"
        className={`sticky top-[-2px] flex w-full items-end justify-between tabs tabs-bordered h-[54px] bg-base-100 z-[1] ${className}`}
    >
        {tabs.map((tab) => (
            <a
                key={tab.id}
                role="tab"
                className={`tab w-full h-full flex text-base text-neutral ${
                    activeTab === tab.id ? "tab-active" : "text-base-content/70"
                }`}
                onClick={() => setActiveTab(tab.id)}
            >
                {tab.label}
            </a>
        ))}
    </div>
    )
}

export default Tabs