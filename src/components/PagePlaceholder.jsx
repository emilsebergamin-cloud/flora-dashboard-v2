export default function PagePlaceholder({ title, subtitle, color = 'bg-rosa-claro' }) {
  return (
    <div className="min-h-full flex items-center justify-center px-6 py-16">
      <div className="text-center">
        <div className={`inline-block w-12 h-12 rounded-2xl ${color} mb-6`} />
        <h1 className="font-display text-4xl md:text-5xl text-texto mb-3">{title}</h1>
        {subtitle && (
          <p className="font-body text-texto-suave text-base">{subtitle}</p>
        )}
        <p className="font-body text-xs text-texto-suave/50 mt-8 tracking-widest uppercase">
          Próximamente — Fase 2
        </p>
      </div>
    </div>
  );
}
