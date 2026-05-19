"use client";

interface TextInputProps {
  value: string;
  onChange: (value: string) => void;
}

const MAX_CHARS = 10000;

export default function TextInput({ value, onChange }: TextInputProps) {
  const charCount = value.length;
  const pct = charCount / MAX_CHARS;

  return (
    <div className="card">
      <div className="card-title">Seu texto</div>
      <div className="textarea-wrapper">
        <textarea
          id="text-input"
          className="text-input"
          placeholder="Cole seu texto aqui... artigo, thread, ideia, newsletter — qualquer coisa que você quer reformatar."
          value={value}
          onChange={(e) => onChange(e.target.value)}
          maxLength={MAX_CHARS}
        />
        {charCount > 0 && (
          <span
            className={`char-counter ${
              pct > 0.9 ? "danger" : pct > 0.75 ? "warning" : ""
            }`}
          >
            {charCount.toLocaleString()} / {MAX_CHARS.toLocaleString()}
          </span>
        )}
      </div>
    </div>
  );
}
