import { motion } from "framer-motion"

export default function UserCard({ usuario, onClick }) {
  return (
    <motion.div 
      onClick={onClick} 
      className="group relative bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 cursor-pointer overflow-hidden border border-gray-100"
      initial={{ opacity: 0, y: 30 }} 
      animate={{ opacity: 1, y: 0 }} 
      transition={{ duration: 0.4, ease: "easeOut" }}
      whileHover={{ 
        scale: 1.05, 
        rotateY: 5,
        transition: { duration: 0.3 }
      }}
      whileTap={{ scale: 0.98 }}
    >
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full -translate-y-16 translate-x-16 opacity-50 group-hover:opacity-70 transition-opacity duration-300"></div>
      
      <div className="relative z-10 p-6 text-center">
        <div className="relative mb-4">
          <div className="w-24 h-24 mx-auto relative">
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-400 to-purple-500 p-0.5 group-hover:from-blue-500 group-hover:to-purple-600 transition-all duration-300">
              <div className="w-full h-full rounded-full bg-white p-1">
                <img 
                  className="w-full h-full object-cover rounded-full" 
                  src={usuario.foto} 
                  alt={usuario.nombre}
                  onError={(e) => {
                    e.target.src = `https://ui-avatars.com/api/?name=${usuario.nombre}+${usuario.apellidos}&background=6366f1&color=fff&size=200`
                  }}
                />
              </div>
            </div>
            
            <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-400 rounded-full border-2 border-white shadow-md">
              <div className="w-full h-full bg-green-400 rounded-full animate-ping opacity-75"></div>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <h3 className="text-lg font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent group-hover:from-blue-600 group-hover:to-purple-600 transition-all duration-300">
            {usuario.nombre} {usuario.apellidos}
          </h3>
          
          <div className="flex items-center justify-center space-x-2 text-gray-600">
            <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 00-2 2H8a2 2 0 00-2-2V4m8 0H8m0 0v.01M8 4v.01M16 4v.01" />
            </svg>
            <p className="text-sm font-medium">{usuario.ocupacion}</p>
          </div>
          
          <div className="flex items-center justify-center space-x-2 text-gray-600">
            <svg className="w-4 h-4 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
            <p className="text-sm text-gray-500">{usuario.perfil}</p>
          </div>
          
          <div className="mt-4 pt-3 border-t border-gray-100">
            <div className="flex items-center justify-center space-x-2">
              <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <p className="text-xs text-blue-600 font-medium group-hover:text-blue-700 transition-colors duration-300">
                {usuario.correo}
              </p>
            </div>
          </div>
          
          {/* Mostrar número de tareas */}
          <div className="mt-2 px-2 py-1 bg-green-100 rounded-full">
            <p className="text-xs text-green-700 font-semibold">
              {usuario.tareas ? usuario.tareas.length : 0} tareas
            </p>
          </div>
        </div>
      </div>

      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-purple-50 opacity-0 group-hover:opacity-20 transition-opacity duration-300 pointer-events-none"></div>
    </motion.div>
  )
}