import React from 'react';
import { MessageCircle } from 'lucide-react';

interface WhatsAppCTAProps {
  number?: string | null | undefined;
  resortName?: string;
  roomName?: string;
  className?: string;
  label?: string;
}

export const WhatsAppCTA: React.FC<WhatsAppCTAProps> = ({
  number,
  resortName = 'the resort',
  roomName,
  className = '',
  label = 'Chat on WhatsApp'
}) => {
  if (!number || typeof number !== 'string') return null;

  const cleanNumber = number.replace(/[^0-9]/g, '');
  const message = roomName
    ? `Hi, I am interested in booking the ${roomName} at ${resortName}. Could you please share availability and rates?`
    : `Hi! I am visiting your website for ${resortName} and would like to inquire about room reservations.`;

  const whatsappUrl = `https://wa.me/${cleanNumber}?text=${encodeURIComponent(message)}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center gap-2 font-medium transition-all transform hover:scale-105 shadow-lg ${className}`}
    >
      <MessageCircle className="w-5 h-5 fill-current" />
      <span>{label}</span>
    </a>
  );
};
