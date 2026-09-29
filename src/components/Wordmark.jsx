import LogoMark from './LogoMark.jsx';

export default function Wordmark({ size = 'md' }) {
  return (
    <div className="flex items-center gap-2.5">
      <LogoMark size={size === 'lg' ? 44 : 34} className="text-ink shrink-0" />
      <div className="flex flex-col leading-none gap-1">
        <span className={`font-display tracking-wide ${size === 'lg' ? 'text-3xl' : 'text-2xl'}`}>
          FORM<span className="text-lagoon">O</span>
        </span>
        <span className="font-mono text-[10px] tracking-[0.2em] uppercase text-ink-45">Maldives</span>
      </div>
    </div>
  );
}
