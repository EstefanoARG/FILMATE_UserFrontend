import { useState } from 'react';
import { Music2, X, BookOpen, ChevronRight, Smartphone } from 'lucide-react';
import PwaInstallButton from './PwaInstallButton.jsx';

const itemDetails = {
  'Quienes somos':
    'Filmate es una cadena peruana de cines enfocada en funciones digitales, reserva de asientos en tiempo real, dulceria online y una comunidad donde los usuarios pueden calificar peliculas y compartir resenas.',
  'Nuestra historia':
    'Nacimos en Lima con la idea de unir la experiencia de ir al cine con herramientas digitales simples: cartelera actualizada, compra rapida, seleccion de butacas y recomendaciones segun tus gustos.',
  'Contactanos':
    'Central telefonica: (01) 640-2525. Atencion al cliente: atencionalcliente@filmate.pe. Horario de soporte: lunes a domingo de 9:00 a.m. a 11:00 p.m.',
  'Trabaja con nosotros':
    'Buscamos talento para atencion en cines, operaciones, soporte digital, marketing y administracion. Puedes escribir a talento@filmate.pe indicando el puesto y sede de interes.',
  'Libro de reclamaciones':
    'Si tuviste un inconveniente con una compra, funcion, dulceria o atencion en sede, registra tu reclamo con tus datos, codigo de compra y detalle del caso. Responderemos dentro del plazo legal correspondiente.',
};

const footerGroups = [
  {
    title: 'SOBRE NOSOTROS',
    items: ['Quienes somos', 'Nuestra historia'],
  },
  {
    title: 'CONTACTO',
    items: ['Contactanos', 'Trabaja con nosotros'],
  },
  {
    title: 'AYUDA',
    items: ['Libro de reclamaciones'],
  },
];

const socialItems = [
  { label: 'Instagram', text: 'IG', color: 'from-pink-500 via-red-500 to-yellow-400' },
  { label: 'X', icon: X, color: 'from-slate-900 to-slate-950' },
  { label: 'Facebook', text: 'f', color: 'from-blue-500 to-blue-700' },
  { label: 'YouTube', text: '▶', color: 'from-red-500 to-red-600' },
  { label: 'TikTok', icon: Music2, color: 'from-slate-900 to-slate-950' },
];

export const Footer = () => {
  const [openItem, setOpenItem] = useState('');

  const toggleItem = (item) => {
    setOpenItem((currentItem) => (currentItem === item ? '' : item));
  };

  return (
    <footer className="border-t border-slate-800 bg-slate-950 px-4 pb-[max(2rem,env(safe-area-inset-bottom))] pt-8 sm:px-6 sm:py-10 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-7 sm:gap-10 lg:grid-cols-3">
          {footerGroups.map((group) => (
            <div key={group.title}>
              <h3 className="mb-3 text-xl font-black uppercase tracking-wide text-white sm:mb-5 sm:text-2xl lg:text-3xl">
                {group.title}
              </h3>

              <div className="space-y-1 sm:space-y-3">
                {group.items.map((item) => {
                  const isOpen = openItem === item;

                  return (
                    <div key={item}>
                      <button
                        type="button"
                        onClick={() => toggleItem(item)}
                        aria-expanded={isOpen}
                        className="flex w-full items-center gap-2 text-left text-base font-semibold text-slate-100 transition-colors hover:text-blue-300 sm:text-lg lg:text-2xl"
                      >
                        {item === 'Libro de reclamaciones' ? (
                          <BookOpen className="h-5 w-5 shrink-0 text-blue-300 sm:h-6 sm:w-6" />
                        ) : (
                          <ChevronRight className={`h-5 w-5 shrink-0 text-slate-500 transition-transform ${isOpen ? 'rotate-90' : ''}`} />
                        )}
                        <span>{item}</span>
                      </button>

                      <div
                        className={`overflow-hidden transition-all duration-300 ease-in-out ${
                          isOpen ? 'max-h-64 opacity-100 mt-2' : 'max-h-0 opacity-0'
                        }`}
                      >
                        <div className="border-l-2 border-blue-400/40 pl-4 text-sm font-medium leading-relaxed text-slate-400 sm:text-base">
                          {itemDetails[item]}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 flex flex-col gap-6 border-t border-slate-800 pt-6 sm:mt-12 sm:gap-8 sm:pt-8 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-1 text-slate-100">
            <p className="text-sm font-bold sm:text-base lg:text-lg">Filmate S.A. | RUC 20429683581</p>
            <p className="text-sm font-bold sm:text-base lg:text-lg">Todos los derechos reservados 2026</p>
          </div>

          <div className="hidden lg:block">
            <PwaInstallButton variant="footer" />
          </div>

          <div className="flex flex-col gap-4 lg:items-end">
            <p className="text-lg font-bold text-white sm:text-xl lg:text-2xl">Siguenos en:</p>
            <div className="flex flex-wrap items-center gap-4">
              {socialItems.map((social) => {
                const Icon = social.icon;

                return (
                  <button
                    key={social.label}
                    type="button"
                    aria-label={social.label}
                    className={`flex h-12 w-12 items-center justify-center rounded-full border border-slate-700 bg-gradient-to-br ${social.color} text-white shadow-lg shadow-black/30 transition-transform hover:scale-105 sm:h-14 sm:w-14`}
                  >
                    {Icon ? (
                      <Icon className="h-7 w-7" />
                    ) : (
                      <span className="text-xl font-black leading-none">{social.text}</span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
