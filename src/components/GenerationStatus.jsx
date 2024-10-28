import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Dot, Zap, Check } from 'lucide-react'

const GenerationStatus = ({ generatingCount = 0 }) => {
  return (
    <div className="flex items-center space-x-2">
      <AnimatePresence>
        {Array.from({ length: generatingCount }).map((_, index) => (
          <motion.div
            key={index}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            className="relative"
          >
            <Dot className="w-6 h-6" />
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="absolute inset-0 flex items-center justify-center"
            >
              <Zap className="w-3 h-3 text-yellow-500" />
            </motion.div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}

export default GenerationStatus