"use client";

import { motion } from "framer-motion";

export default function AchievementsSection({ achievements }: any) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {achievements.map((item: any, i: number) => (
        <motion.div
          key={i}
          whileHover={{ scale: 1.02 }}
          className={`relative overflow-hidden rounded-xl backdrop-blur-xl p-6 border border-${item.color}-500/30 bg-gradient-to-br from-${item.color}-500/10 to-${item.color}-600/10`}
        >
          <div className="flex items-start gap-4">
            <div
              className={`w-12 h-12 rounded-lg flex items-center justify-center bg-gradient-to-br from-${item.color}-500/20 to-${item.color}-600/20`}
            >
              <item.icon className={`w-6 h-6 text-${item.color}-400`} />
            </div>

            <div>
              <h4 className="text-[var(--foreground)] mb-1">{item.title}</h4>
              <p className="text-[var(--foreground-muted)] text-sm">
                {item.desc}
              </p>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
