import { Outlet, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import Sidebar from './Sidebar.jsx';
import BottomTabs from './BottomTabs.jsx';

const pageVariants = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.22, ease: 'easeOut' } },
  exit:    { opacity: 0, y: -4, transition: { duration: 0.15, ease: 'easeIn' } },
};

export default function Layout({ syncStatus }) {
  const location = useLocation();

  return (
    <div className="min-h-screen flex bg-crema">
      <Sidebar syncStatus={syncStatus} />

      <main className="flex-1 flex flex-col min-h-screen pb-16 md:pb-0 overflow-y-auto">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={location.pathname}
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="flex-1"
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </main>

      <BottomTabs />
    </div>
  );
}
