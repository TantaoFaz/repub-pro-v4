"use client";

import { Platform } from "@/lib/api";
import { Plus, X } from "lucide-react";

interface PlatformSelectorProps {
  selected: Platform[];
  onChange: (platforms: Platform[]) => void;
}

const platforms: { id: Platform; name: string; svg: React.ReactNode }[] = [
  {
    id: "twitter",
    name: "Twitter",
    svg: (
      <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231 5.451-6.231zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77z" />
      </svg>
    ),
  },
  {
    id: "linkedin",
    name: "LinkedIn",
    svg: (
      <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor">
        <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
      </svg>
    ),
  },
  {
    id: "substack",
    name: "Substack",
    svg: (
      <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor">
        <path d="M22.534 15.997H1.466V24L12 18.229 22.534 24v-8.003zM22.534 0H1.466v2.245h21.068V0zM22.534 7.999H1.466v5.753h21.068V7.999z" />
      </svg>
    ),
  },
  {
    id: "instagram",
    name: "Instagram",
    svg: (
      <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
      </svg>
    ),
  },
];

export default function PlatformSelector({
  selected,
  onChange,
}: PlatformSelectorProps) {
  function addPlatform(id: Platform) {
    if (!selected.includes(id)) {
      onChange([...selected, id]);
    }
  }

  function removePlatform(id: Platform) {
    onChange(selected.filter((p) => p !== id));
  }

  const available = platforms.filter((p) => !selected.includes(p.id));

  return (
    <div className="platform-selector">
      <div className="label">Plataformas de Publicação</div>
      
      <div className="platform-list">
        {selected.map((id) => {
          const platform = platforms.find((p) => p.id === id);
          if (!platform) return null;
          
          return (
            <div key={id} className="platform-chip animate-fade">
              {platform.svg}
              <span>{platform.name}</span>
              <X 
                size={14} 
                className="remove-chip" 
                onClick={() => removePlatform(id)} 
              />
            </div>
          );
        })}
        
        {available.length > 0 && (
          <div className="dropdown-wrapper" style={{ position: 'relative' }}>
            <select 
              className="add-platform-trigger"
              value=""
              onChange={(e) => addPlatform(e.target.value as Platform)}
              style={{ appearance: 'none', paddingRight: '32px' }}
            >
              <option value="" disabled>+ Adicionar Plataforma</option>
              {available.map((p) => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
            <Plus 
              size={14} 
              style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} 
            />
          </div>
        )}
      </div>
      
      {selected.length === 0 && (
        <p style={{ fontSize: '0.9rem', color: 'var(--text-tertiary)', fontWeight: 500, marginTop: '8px' }}>
          Selecione ao menos uma plataforma para reformatar seu conteúdo.
        </p>
      )}
    </div>
  );
}
