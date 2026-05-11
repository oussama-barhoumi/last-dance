import clsx from 'clsx';
import { motion } from 'framer-motion';

export default function Skeleton({ className, ...props }) {
    return (
        <motion.div
            initial={{ opacity: 0.5 }}
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            className={clsx("bg-gray-200 dark:bg-zinc-800/80 rounded-xl", className)}
            {...props}
        />
    );
}
