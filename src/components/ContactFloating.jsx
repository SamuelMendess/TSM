import React from 'react';
import { MessageCircle } from 'lucide-react';

export default function ContactFloating({ onOpenModal }) {
  return (
    <button
      type="button"
      onClick={onOpenModal}
      className="fixed bottom-5 right-5 sm:bottom-6 sm:right-6 z-40 min-h-11 px-4 rounded-full bg-white text-black shadow-xl hover:bg-neutral-200 transition-colors inline-flex items-center gap-2 text-sm font-semibold"
      aria-label="Falar sobre um projeto"
    >
      <MessageCircle className="w-4 h-4" aria-hidden="true" />
      <span>Falar de projeto</span>
    </button>
  );
}
