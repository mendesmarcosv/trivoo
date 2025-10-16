export default function ResponsiveProfileStyles() {
  return (
    <style jsx global>{`
      /* ================================================
         RESPONSIVIDADE PARA PÁGINAS DE PERFIL
         Professor, Centro de Treinamento, Evento
         ================================================ */

      @media (max-width: 768px) {
        /* Header do perfil - em coluna */
        .profile-header {
          flex-direction: column !important;
          gap: 24px !important;
        }

        /* Avatar menor */
        .profile-avatar-container {
          width: 100px !important;
          height: 100px !important;
        }

        .profile-avatar-container img {
          width: 100px !important;
          height: 100px !important;
        }

        /* Nome menor */
        .profile-name {
          font-size: 28px !important;
          line-height: 36px !important;
        }

        /* Descrição menor */
        .profile-description {
          font-size: 14px !important;
          line-height: 22px !important;
        }

        /* Badges empilhados */
        .profile-badges {
          flex-direction: column !important;
          align-items: flex-start !important;
        }

        /* Botões de ação em coluna e largura total */
        .profile-actions {
          flex-direction: column !important;
          width: 100% !important;
          gap: 12px !important;
        }

        .profile-actions button,
        .profile-actions > div {
          width: 100% !important;
        }

        /* Imagem - largura total */
        .profile-image-side {
          width: 100% !important;
          height: auto !important;
          aspect-ratio: 16/9 !important;
        }

        /* Banner sticky - não sticky em mobile */
        .profile-sticky-banner {
          position: relative !important;
          top: auto !important;
          width: 100% !important;
          margin-bottom: 24px !important;
        }

        /* Container descrição + banner - coluna reversa */
        .profile-description-wrapper {
          flex-direction: column-reverse !important;
          gap: 24px !important;
        }

        /* Info grid - 1 coluna */
        .profile-info-grid-2,
        .profile-info-grid-3 {
          grid-template-columns: 1fr !important;
        }

        /* Seção de esportes - em coluna */
        .profile-sports-section {
          flex-direction: column !important;
          align-items: flex-start !important;
        }

        /* Horário - esconder separadores */
        .profile-schedule-separator {
          display: none !important;
        }

        /* Cards com padding menor */
        div[style*="padding: 24px"][style*="background: #F7F7F7"],
        div[style*="padding: 32px"] {
          padding: 16px !important;
        }

        /* Rating e títulos menores */
        .profile-rating-number {
          font-size: 18px !important;
        }

        .profile-section-title {
          font-size: 20px !important;
          line-height: 28px !important;
        }

        /* Tags menores */
        div[style*="fontSize: 16px"][style*="background: #758A25"] div,
        div[style*="fontSize: 16px"][style*="background: #FFE097"] div,
        div[style*="fontSize: 16px"][style*="background: #B2E8FF"] div {
          font-size: 14px !important;
        }
      }

      /* Tablet: 769px a 1024px */
      @media (min-width: 769px) and (max-width: 1024px) {
        /* Imagens um pouco menores */
        .profile-image-side {
          width: 350px !important;
          height: 197px !important;
        }

        /* Banner sticky menor */
        .profile-sticky-banner {
          width: 280px !important;
        }

        /* Nome um pouco menor */
        .profile-name {
          font-size: 34px !important;
          line-height: 44px !important;
        }
      }
    `}</style>
  )
}

