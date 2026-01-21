interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  className?: string;
}

export default function SectionHeader({ title, subtitle, className = '' }: SectionHeaderProps) {
  return (
    <div className={`mb-10 ${className}`}>
      {/* 
         Adaptamos el estilo base:
         - Si es un título principal grande (como en Dashboard), usa text-3xl.
         - Si es un título de sección (como en Depositos), usa text-sm con tracking amplio.
         Podemos hacer esto flexible o definir variantes. 
         Por consistencia con el diseño actual, usaré el estilo de las secciones interiores por defecto,
         pero permitiré sobreescribir clases si es necesario.
      */}
      <h2 className={`text-[#691C32] font-black uppercase tracking-[0.2em] ${subtitle ? 'text-3xl tracking-tight text-gray-800 normal-case' : 'text-sm'}`}>
        {title}
      </h2>
      {subtitle && (
        <p className="text-sm text-gray-400 font-bold uppercase tracking-widest mt-1">
          {subtitle}
        </p>
      )}
    </div>
  );
}
