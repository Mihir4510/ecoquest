function StatsCard({ label, value, icon, color = "from-blue-400 to-indigo-500" }) {
  return (
    <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-slate-200 hover:shadow-xl transition-all">
      <div className="flex items-center space-x-4">
        <div className={`w-16 h-16 bg-gradient-to-br ${color} rounded-xl flex items-center justify-center shadow-lg`}>
          <span className="text-2xl text-white">{icon}</span>
        </div>
        <div className="flex-1">
          <p className="text-slate-600 text-sm font-medium mb-1">{label}</p>
          <h3 className="text-2xl font-bold text-slate-800">{value}</h3>
        </div>
      </div>
    </div>
  )
}

export default StatsCard
