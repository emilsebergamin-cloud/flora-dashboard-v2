import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

export default function Modal({ open, onClose, title, children }) {
  // Cierra con Escape
  useEffect(() => {
    if (!open) return;
    const handler = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [open, onClose]);

  // Bloquea el scroll del fondo mientras el modal está abierto
  useEffect(() => {
    if (!open) return;
    const main = document.querySelector('main');
    const prevBody = document.body.style.overflow;
    const prevMain = main?.style.overflow ?? '';
    document.body.style.overflow = 'hidden';
    if (main) main.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prevBody;
      if (main) main.style.overflow = prevMain;
    };
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[60] flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
        >
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-texto/30 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Panel */}
          <motion.div
            className="relative z-10 w-full max-w-lg bg-blanco rounded-3xl shadow-xl p-6 md:p-8 max-h-[88vh] overflow-y-auto overscroll-contain"
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 40, opacity: 0 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-display text-2xl text-texto">{title}</h2>
              <button
                onClick={onClose}
                className="text-texto-suave hover:text-texto transition-colors p-1"
              >
                <X size={20} strokeWidth={1.75} />
              </button>
            </div>
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
