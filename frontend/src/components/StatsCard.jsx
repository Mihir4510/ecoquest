function StatsCard({ label, value, icon }) {
  return (
    <div className="bg-green-100 p-4 rounded-lg shadow-md flex items-center space-x-3">
      <span className="text-2xl">{icon}</span>
      <div>
        <p className="text-gray-500">{label}</p>
        <h3 className="text-xl font-bold">{value}</h3>
      </div>
    </div>
  )
}

export default StatsCard
