"use client";

import { Minus, Plus } from "lucide-react";
import { useEffect, useState } from "react";

interface QuantityStepperProps {
  value: number;
  onChange: (nextQuantity: number) => void;
  min?: number;
  max?: number;
  size?: "sm" | "md";
  ariaLabel?: string;
  className?: string;
}

/**
 * Selector numérico accesible con botones +/- e ingreso libre por teclado
 * (permite escribir cantidades grandes como 500 o 1000 sin borrar el ítem ni perder foco).
 */
export function QuantityStepper({
  value,
  onChange,
  min = 1,
  max = 999999,
  size = "sm",
  ariaLabel = "Cantidad de unidades",
  className = "",
}: QuantityStepperProps) {
  const [draft, setDraft] = useState<string>(String(value));
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    if (!isFocused) {
      setDraft(String(value));
    }
  }, [value, isFocused]);

  const clampQuantity = (qty: number) => Math.min(max, Math.max(min, Math.floor(qty)));

  const commitDraft = (raw: string) => {
    const parsed = Number.parseInt(raw.replace(/\D/g, ""), 10);
    if (Number.isNaN(parsed) || parsed < min) {
      setDraft(String(value));
      return;
    }
    const clamped = clampQuantity(parsed);
    setDraft(String(clamped));
    if (clamped !== value) {
      onChange(clamped);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const digitsOnly = e.target.value.replace(/\D/g, "");
    setDraft(digitsOnly);

    if (digitsOnly.length > 0) {
      const parsed = Number.parseInt(digitsOnly, 10);
      if (!Number.isNaN(parsed) && parsed >= min) {
        onChange(clampQuantity(parsed));
      }
    }
  };

  const handleDecrement = () => {
    const next = clampQuantity(value - 1);
    setDraft(String(next));
    onChange(next);
  };

  const handleIncrement = () => {
    const next = clampQuantity(value + 1);
    setDraft(String(next));
    onChange(next);
  };

  const btnPadding = size === "md" ? "p-2.5" : "p-1.5";
  const iconSize = size === "md" ? "w-4 h-4" : "w-3 h-3";
  const inputSizing =
    size === "md"
      ? "w-16 sm:w-20 text-sm py-1.5"
      : "w-14 sm:w-16 text-xs py-1";

  return (
    <div
      className={`inline-flex items-center border border-[#DCD6C9] rounded-xl bg-[#FAF8F5] focus-within:ring-2 focus-within:ring-[#9E734E]/40 focus-within:border-[#9E734E] transition-all ${className}`}
    >
      <button
        type="button"
        onClick={handleDecrement}
        disabled={value <= min}
        className={`${btnPadding} text-[#57534E] hover:text-[#141413] hover:bg-[#EBE7DF] rounded-l-xl transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed`}
        aria-label="Disminuir cantidad"
      >
        <Minus className={iconSize} />
      </button>

      <input
        type="text"
        inputMode="numeric"
        pattern="[0-9]*"
        aria-label={ariaLabel}
        value={draft}
        onFocus={(e) => {
          setIsFocused(true);
          e.currentTarget.select();
        }}
        onBlur={() => {
          setIsFocused(false);
          commitDraft(draft);
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.currentTarget.blur();
          }
        }}
        onChange={handleInputChange}
        className={`${inputSizing} text-center font-mono font-bold bg-white/70 text-[#141413] border-x border-[#E6E2DC] focus:bg-white focus:outline-hidden`}
      />

      <button
        type="button"
        onClick={handleIncrement}
        disabled={value >= max}
        className={`${btnPadding} text-[#57534E] hover:text-[#141413] hover:bg-[#EBE7DF] rounded-r-xl transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed`}
        aria-label="Aumentar cantidad"
      >
        <Plus className={iconSize} />
      </button>
    </div>
  );
}
