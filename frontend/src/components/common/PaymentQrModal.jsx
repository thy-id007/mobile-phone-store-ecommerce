import React, { useState } from 'react';
import { X, Copy, Check, QrCode, Smartphone, Building2, ShieldCheck, Download } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

const PaymentQrModal = ({ isOpen, onClose, totalAmount = 0, orderNumber = '' }) => {
  const { t, language } = useLanguage();
  const [copied, setCopied] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);

  if (!isOpen) return null;

  const formattedAmount = parseFloat(totalAmount || 0).toFixed(2);
  const accountNumber = '001 889 992';
  const accountName = 'MOBILE PHONE STORE CAMBODIA';
  const bankName = 'ABA Bank (KHQR / Bakong)';

  // QR Code data payload
  const qrData = `KHQR:ACCOUNT=${accountNumber.replace(/\s+/g, '')}&NAME=${encodeURIComponent(accountName)}&AMOUNT=${formattedAmount}&CURRENCY=USD&ORDER=${orderNumber || 'CHECKOUT'}`;
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=260x260&margin=8&data=${encodeURIComponent(qrData)}`;

  const handleCopyAccount = () => {
    navigator.clipboard.writeText(accountNumber.replace(/\s+/g, ''));
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        background: 'rgba(5, 10, 24, 0.75)',
        backdropFilter: 'blur(8px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        animation: 'fadeIn 0.2s ease-out',
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: 'linear-gradient(180deg, #111827 0%, #0b1120 100%)',
          border: '1px solid rgba(59, 130, 246, 0.3)',
          borderRadius: '20px',
          width: '100%',
          maxWidth: '440px',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7), 0 0 30px rgba(59, 130, 246, 0.2)',
          overflow: 'hidden',
          animation: 'scaleIn 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with KHQR Banner */}
        <div
          style={{
            background: 'linear-gradient(135deg, #e11d48 0%, #be123c 100%)',
            padding: '16px 20px',
            color: '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            position: 'relative',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                background: '#fff',
                color: '#e11d48',
                fontWeight: '900',
                fontSize: '13px',
                letterSpacing: '1px',
                padding: '3px 8px',
                borderRadius: '6px',
                boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
              }}
            >
              KHQR
            </div>
            <div>
              <div style={{ fontWeight: '800', fontSize: '15px', lineHeight: 1.2 }}>
                {t('qr_payment_title', 'Bank Transfer (QR Code)')}
              </div>
              <div style={{ fontSize: '11px', opacity: 0.9 }}>
                {bankName}
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            aria-label="Close"
            style={{
              background: 'rgba(255, 255, 255, 0.2)',
              border: 'none',
              borderRadius: '50%',
              width: '32px',
              height: '32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
              cursor: 'pointer',
              transition: 'background 0.2s',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255, 255, 255, 0.35)')}
            onMouseLeave={(e) => (e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)')}
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Body */}
        <div style={{ padding: '24px', textAlign: 'center' }}>
          
          {/* Instruction */}
          <p
            style={{
              fontSize: '13px',
              color: 'var(--text-secondary, #94a3b8)',
              marginBottom: '16px',
              lineHeight: 1.4,
            }}
          >
            {t('qr_scan_instruction', 'Scan QR code with your mobile banking app (ABA, Wing, ACLEDA, Bakong, etc.) to complete payment.')}
          </p>

          {/* QR Code White Card */}
          <div
            style={{
              background: '#ffffff',
              padding: '16px',
              borderRadius: '16px',
              display: 'inline-block',
              boxShadow: '0 10px 25px rgba(0, 0, 0, 0.4)',
              border: '3px solid #e11d48',
              position: 'relative',
              marginBottom: '18px',
            }}
          >
            <div style={{ width: 'min(220px, 60vw)', height: 'min(220px, 60vw)', position: 'relative', margin: '0 auto' }}>
              <img
                src={qrUrl}
                alt="Bank Transfer QR Code"
                onLoad={() => setImgLoaded(true)}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'contain',
                  display: 'block',
                }}
              />
              {/* KHQR Center Badge */}
              <div
                style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  background: '#e11d48',
                  color: '#fff',
                  width: '38px',
                  height: '38px',
                  borderRadius: '8px',
                  border: '3px solid #fff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: '900',
                  fontSize: '16px',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
                }}
              >
                $
              </div>
            </div>

            {/* Merchant info inside QR Card */}
            <div
              style={{
                marginTop: '10px',
                paddingTop: '8px',
                borderTop: '1px dashed #cbd5e1',
                color: '#0f172a',
              }}
            >
              <div style={{ fontWeight: '800', fontSize: '13px', letterSpacing: '0.3px' }}>
                {accountName}
              </div>
              <div style={{ fontSize: '12px', color: '#64748b', marginTop: '2px' }}>
                {bankName}
              </div>
            </div>
          </div>

          {/* Total Due Banner */}
          <div
            style={{
              background: 'rgba(59, 130, 246, 0.08)',
              border: '1px solid rgba(59, 130, 246, 0.25)',
              borderRadius: '12px',
              padding: '12px 16px',
              marginBottom: '16px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontSize: '11px', color: 'var(--text-muted, #64748b)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                {t('qr_amount_due', 'Total Amount Due')}
              </div>
              <div style={{ fontSize: '22px', fontWeight: '900', color: '#38bdf8' }}>
                ${formattedAmount} <span style={{ fontSize: '13px', fontWeight: '600', color: '#94a3b8' }}>USD</span>
              </div>
            </div>

            <div
              style={{
                background: 'rgba(16, 185, 129, 0.15)',
                color: '#10b981',
                borderRadius: '8px',
                padding: '6px 10px',
                fontSize: '11px',
                fontWeight: '700',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
              }}
            >
              <ShieldCheck size={14} />
              <span>Instant Scan</span>
            </div>
          </div>

          {/* Bank Account Number with One-Click Copy */}
          <div
            style={{
              background: 'var(--bg-card, #1e293b)',
              border: '1px solid var(--border-subtle, rgba(255,255,255,0.08))',
              borderRadius: '12px',
              padding: '10px 14px',
              marginBottom: '20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', textAlign: 'left' }}>
              <Building2 size={16} color="#94a3b8" />
              <div>
                <div style={{ fontSize: '10px', color: '#94a3b8' }}>
                  {t('qr_account_number', 'Account Number')} (ABA USD)
                </div>
                <div style={{ fontSize: '15px', fontWeight: '700', color: '#fff', letterSpacing: '1px' }}>
                  {accountNumber}
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={handleCopyAccount}
              style={{
                background: copied ? 'rgba(16, 185, 129, 0.2)' : 'rgba(59, 130, 246, 0.15)',
                border: copied ? '1px solid #10b981' : '1px solid rgba(59, 130, 246, 0.3)',
                color: copied ? '#10b981' : '#38bdf8',
                borderRadius: '8px',
                padding: '6px 12px',
                fontSize: '12px',
                fontWeight: '600',
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
            >
              {copied ? <Check size={14} /> : <Copy size={14} />}
              <span>{copied ? t('qr_copied', 'Copied!') : t('qr_copy_account', 'Copy')}</span>
            </button>
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              type="button"
              onClick={onClose}
              className="btn btn-primary"
              style={{
                flex: 1,
                padding: '12px',
                fontWeight: '700',
                borderRadius: '10px',
              }}
            >
              {t('qr_done_button', 'I Have Paid / Continue')}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="btn btn-secondary"
              style={{
                padding: '12px 18px',
                borderRadius: '10px',
              }}
            >
              {t('qr_close', 'Close')}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default PaymentQrModal;
