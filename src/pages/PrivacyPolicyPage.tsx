import { HelmetProvider, Helmet } from 'react-helmet-async';
import { Shield } from 'lucide-react';
import { type Language } from '../constants/translations';

interface PrivacyPolicyPageProps {
  language: Language;
}

export function PrivacyPolicyPage({ language }: PrivacyPolicyPageProps) {
  const content = {
    en: {
      title: 'Privacy Policy',
      lastUpdated: 'Last Updated: January 23, 2026',
      sections: [
        {
          title: 'Introduction',
          content: 'Wakfu Job Calculator ("we", "our", or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website.'
        },
        {
          title: 'Information We Collect',
          content: 'We collect information that you voluntarily provide to us when using our services. This may include:',
          list: [
            'Language preferences and settings',
            'Calculator inputs and saved configurations',
            'Anonymous usage statistics to improve our services',
            'Browser type and operating system information'
          ]
        },
        {
          title: 'How We Use Your Information',
          content: 'We use the information we collect to:',
          list: [
            'Provide, maintain, and improve our services',
            'Personalize your experience on our website',
            'Understand how users interact with our tools',
            'Communicate updates and important notices',
            'Ensure the security and integrity of our platform'
          ]
        },
        {
          title: 'Third-Party Services',
          content: 'Our website may use third-party services including:',
          list: [
            'Google AdSense for displaying advertisements',
            'Analytics services to understand user behavior',
            'Content Delivery Networks (CDN) for faster loading times'
          ],
          additional: 'These third-party services may collect information about you according to their own privacy policies. We encourage you to review their privacy policies.'
        },
        {
          title: 'Cookies and Tracking',
          content: 'We use cookies and similar tracking technologies to enhance your experience. Cookies are small data files stored on your device. You can control cookie preferences through your browser settings. Note that disabling cookies may affect website functionality.'
        },
        {
          title: 'Data Security',
          content: 'We implement appropriate technical and organizational security measures to protect your information. However, no method of transmission over the internet is 100% secure, and we cannot guarantee absolute security.'
        },
        {
          title: 'Children\'s Privacy',
          content: 'Our services are not directed to individuals under the age of 13. We do not knowingly collect personal information from children. If you are a parent or guardian and believe your child has provided us with personal information, please contact us.'
        },
        {
          title: 'Your Rights',
          content: 'Depending on your location, you may have certain rights regarding your personal information, including:',
          list: [
            'The right to access your personal data',
            'The right to rectification of inaccurate data',
            'The right to erasure of your data',
            'The right to restrict processing',
            'The right to data portability',
            'The right to object to processing'
          ]
        },
        {
          title: 'Changes to This Policy',
          content: 'We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last Updated" date.'
        },
        {
          title: 'Contact Us',
          content: 'If you have any questions about this Privacy Policy, please contact us through our Contact page or reach out to the community on social media platforms where Wakfu players gather.'
        }
      ]
    },
    fr: {
      title: 'Politique de Confidentialité',
      lastUpdated: 'Dernière mise à jour : 23 janvier 2026',
      sections: [
        {
          title: 'Introduction',
          content: 'Wakfu Job Calculator ("nous", "notre" ou "nos") s\'engage à protéger votre vie privée. Cette Politique de Confidentialité explique comment nous collectons, utilisons, divulguons et protégeons vos informations lorsque vous visitez notre site web.'
        },
        {
          title: 'Informations que Nous Collectons',
          content: 'Nous collectons les informations que vous nous fournissez volontairement lors de l\'utilisation de nos services. Cela peut inclure :',
          list: [
            'Préférences linguistiques et paramètres',
            'Entrées de calculateur et configurations sauvegardées',
            'Statistiques d\'utilisation anonymes pour améliorer nos services',
            'Type de navigateur et informations sur le système d\'exploitation'
          ]
        },
        {
          title: 'Comment Nous Utilisons Vos Informations',
          content: 'Nous utilisons les informations collectées pour :',
          list: [
            'Fournir, maintenir et améliorer nos services',
            'Personnaliser votre expérience sur notre site',
            'Comprendre comment les utilisateurs interagissent avec nos outils',
            'Communiquer des mises à jour et des avis importants',
            'Assurer la sécurité et l\'intégrité de notre plateforme'
          ]
        },
        {
          title: 'Services Tiers',
          content: 'Notre site web peut utiliser des services tiers incluant :',
          list: [
            'Google AdSense pour l\'affichage de publicités',
            'Services d\'analyse pour comprendre le comportement des utilisateurs',
            'Réseaux de diffusion de contenu (CDN) pour des temps de chargement plus rapides'
          ],
          additional: 'Ces services tiers peuvent collecter des informations vous concernant selon leurs propres politiques de confidentialité. Nous vous encourageons à consulter leurs politiques.'
        },
        {
          title: 'Cookies et Suivi',
          content: 'Nous utilisons des cookies et des technologies de suivi similaires pour améliorer votre expérience. Les cookies sont de petits fichiers de données stockés sur votre appareil. Vous pouvez contrôler les préférences des cookies via les paramètres de votre navigateur. Notez que la désactivation des cookies peut affecter les fonctionnalités du site.'
        },
        {
          title: 'Sécurité des Données',
          content: 'Nous mettons en œuvre des mesures de sécurité techniques et organisationnelles appropriées pour protéger vos informations. Cependant, aucune méthode de transmission sur Internet n\'est sécurisée à 100%, et nous ne pouvons garantir une sécurité absolue.'
        },
        {
          title: 'Confidentialité des Enfants',
          content: 'Nos services ne sont pas destinés aux personnes de moins de 13 ans. Nous ne collectons pas sciemment d\'informations personnelles auprès d\'enfants. Si vous êtes parent ou tuteur et pensez que votre enfant nous a fourni des informations personnelles, veuillez nous contacter.'
        },
        {
          title: 'Vos Droits',
          content: 'Selon votre localisation, vous pouvez avoir certains droits concernant vos informations personnelles, notamment :',
          list: [
            'Le droit d\'accéder à vos données personnelles',
            'Le droit de rectification des données inexactes',
            'Le droit à l\'effacement de vos données',
            'Le droit de restreindre le traitement',
            'Le droit à la portabilité des données',
            'Le droit de s\'opposer au traitement'
          ]
        },
        {
          title: 'Modifications de Cette Politique',
          content: 'Nous pouvons mettre à jour cette Politique de Confidentialité de temps à autre. Nous vous informerons de tout changement en publiant la nouvelle politique sur cette page et en mettant à jour la date de "Dernière mise à jour".'
        },
        {
          title: 'Nous Contacter',
          content: 'Si vous avez des questions concernant cette Politique de Confidentialité, veuillez nous contacter via notre page Contact ou contactez la communauté sur les plateformes de médias sociaux où les joueurs de Wakfu se rassemblent.'
        }
      ]
    },
    es: {
      title: 'Política de Privacidad',
      lastUpdated: 'Última actualización: 23 de enero de 2026',
      sections: [
        {
          title: 'Introducción',
          content: 'Wakfu Job Calculator ("nosotros", "nuestro" o "nos") está comprometido a proteger su privacidad. Esta Política de Privacidad explica cómo recopilamos, usamos, divulgamos y protegemos su información cuando visita nuestro sitio web.'
        },
        {
          title: 'Información que Recopilamos',
          content: 'Recopilamos información que usted nos proporciona voluntariamente al usar nuestros servicios. Esto puede incluir:',
          list: [
            'Preferencias de idioma y configuraciones',
            'Entradas de calculadora y configuraciones guardadas',
            'Estadísticas de uso anónimas para mejorar nuestros servicios',
            'Tipo de navegador e información del sistema operativo'
          ]
        },
        {
          title: 'Cómo Usamos Su Información',
          content: 'Usamos la información que recopilamos para:',
          list: [
            'Proporcionar, mantener y mejorar nuestros servicios',
            'Personalizar su experiencia en nuestro sitio web',
            'Entender cómo los usuarios interactúan con nuestras herramientas',
            'Comunicar actualizaciones y avisos importantes',
            'Garantizar la seguridad e integridad de nuestra plataforma'
          ]
        },
        {
          title: 'Servicios de Terceros',
          content: 'Nuestro sitio web puede usar servicios de terceros incluyendo:',
          list: [
            'Google AdSense para mostrar anuncios',
            'Servicios de análisis para entender el comportamiento del usuario',
            'Redes de distribución de contenido (CDN) para tiempos de carga más rápidos'
          ],
          additional: 'Estos servicios de terceros pueden recopilar información sobre usted según sus propias políticas de privacidad. Le recomendamos revisar sus políticas.'
        },
        {
          title: 'Cookies y Seguimiento',
          content: 'Usamos cookies y tecnologías de seguimiento similares para mejorar su experiencia. Las cookies son pequeños archivos de datos almacenados en su dispositivo. Puede controlar las preferencias de cookies a través de la configuración de su navegador. Tenga en cuenta que deshabilitar las cookies puede afectar la funcionalidad del sitio web.'
        },
        {
          title: 'Seguridad de Datos',
          content: 'Implementamos medidas de seguridad técnicas y organizativas apropiadas para proteger su información. Sin embargo, ningún método de transmisión por Internet es 100% seguro, y no podemos garantizar seguridad absoluta.'
        },
        {
          title: 'Privacidad de los Niños',
          content: 'Nuestros servicios no están dirigidos a personas menores de 13 años. No recopilamos conscientemente información personal de niños. Si usted es padre o tutor y cree que su hijo nos ha proporcionado información personal, por favor contáctenos.'
        },
        {
          title: 'Sus Derechos',
          content: 'Dependiendo de su ubicación, puede tener ciertos derechos con respecto a su información personal, incluyendo:',
          list: [
            'El derecho a acceder a sus datos personales',
            'El derecho a rectificación de datos inexactos',
            'El derecho al borrado de sus datos',
            'El derecho a restringir el procesamiento',
            'El derecho a la portabilidad de datos',
            'El derecho a oponerse al procesamiento'
          ]
        },
        {
          title: 'Cambios a Esta Política',
          content: 'Podemos actualizar esta Política de Privacidad de vez en cuando. Le notificaremos de cualquier cambio publicando la nueva política en esta página y actualizando la fecha de "Última actualización".'
        },
        {
          title: 'Contáctenos',
          content: 'Si tiene preguntas sobre esta Política de Privacidad, contáctenos a través de nuestra página de Contacto o comuníquese con la comunidad en las plataformas de redes sociales donde se reúnen los jugadores de Wakfu.'
        }
      ]
    },
    pt: {
      title: 'Política de Privacidade',
      lastUpdated: 'Última atualização: 23 de janeiro de 2026',
      sections: [
        {
          title: 'Introdução',
          content: 'Wakfu Job Calculator ("nós", "nosso" ou "nos") está comprometido em proteger sua privacidade. Esta Política de Privacidade explica como coletamos, usamos, divulgamos e protegemos suas informações quando você visita nosso site.'
        },
        {
          title: 'Informações que Coletamos',
          content: 'Coletamos informações que você nos fornece voluntariamente ao usar nossos serviços. Isso pode incluir:',
          list: [
            'Preferências de idioma e configurações',
            'Entradas da calculadora e configurações salvas',
            'Estatísticas de uso anônimas para melhorar nossos serviços',
            'Tipo de navegador e informações do sistema operacional'
          ]
        },
        {
          title: 'Como Usamos Suas Informações',
          content: 'Usamos as informações que coletamos para:',
          list: [
            'Fornecer, manter e melhorar nossos serviços',
            'Personalizar sua experiência em nosso site',
            'Entender como os usuários interagem com nossas ferramentas',
            'Comunicar atualizações e avisos importantes',
            'Garantir a segurança e integridade de nossa plataforma'
          ]
        },
        {
          title: 'Serviços de Terceiros',
          content: 'Nosso site pode usar serviços de terceiros incluindo:',
          list: [
            'Google AdSense para exibição de anúncios',
            'Serviços de análise para entender o comportamento do usuário',
            'Redes de distribuição de conteúdo (CDN) para tempos de carregamento mais rápidos'
          ],
          additional: 'Estes serviços de terceiros podem coletar informações sobre você de acordo com suas próprias políticas de privacidade. Recomendamos que você revise suas políticas.'
        },
        {
          title: 'Cookies e Rastreamento',
          content: 'Usamos cookies e tecnologias de rastreamento similares para melhorar sua experiência. Cookies são pequenos arquivos de dados armazenados em seu dispositivo. Você pode controlar as preferências de cookies através das configurações do seu navegador. Note que desabilitar cookies pode afetar a funcionalidade do site.'
        },
        {
          title: 'Segurança de Dados',
          content: 'Implementamos medidas de segurança técnicas e organizacionais apropriadas para proteger suas informações. No entanto, nenhum método de transmissão pela Internet é 100% seguro, e não podemos garantir segurança absoluta.'
        },
        {
          title: 'Privacidade das Crianças',
          content: 'Nossos serviços não são direcionados a indivíduos menores de 13 anos. Não coletamos conscientemente informações pessoais de crianças. Se você é pai ou responsável e acredita que seu filho nos forneceu informações pessoais, entre em contato conosco.'
        },
        {
          title: 'Seus Direitos',
          content: 'Dependendo da sua localização, você pode ter certos direitos em relação às suas informações pessoais, incluindo:',
          list: [
            'O direito de acessar seus dados pessoais',
            'O direito à retificação de dados imprecisos',
            'O direito ao apagamento de seus dados',
            'O direito de restringir o processamento',
            'O direito à portabilidade de dados',
            'O direito de se opor ao processamento'
          ]
        },
        {
          title: 'Alterações a Esta Política',
          content: 'Podemos atualizar esta Política de Privacidade periodicamente. Notificaremos você sobre quaisquer mudanças publicando a nova política nesta página e atualizando a data de "Última atualização".'
        },
        {
          title: 'Entre em Contato',
          content: 'Se você tiver dúvidas sobre esta Política de Privacidade, entre em contato conosco através da nossa página de Contato ou entre em contato com a comunidade nas plataformas de mídia social onde os jogadores de Wakfu se reúnem.'
        }
      ]
    }
  };

  const pageContent = content[language];

  return (
    <HelmetProvider>
      <Helmet>
        <title>{pageContent.title} - Wakfu Job Calculator</title>
        <meta name="description" content={`Privacy Policy for Wakfu Job Calculator. Learn about how we collect, use, and protect your data.`} />
      </Helmet>

      <div className="w-full max-w-5xl mx-auto px-4">
        <div className="backdrop-blur-xl bg-gray-900/80 border border-white/10 shadow-2xl rounded-3xl p-8 md:p-12">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-14 h-14 rounded-2xl bg-blue-500/20 border border-blue-500/30 flex items-center justify-center">
              <Shield className="w-7 h-7 text-blue-300" />
            </div>
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-blue-300">
                {pageContent.title}
              </h1>
              <p className="text-blue-100/60 text-sm mt-1">
                {pageContent.lastUpdated}
              </p>
            </div>
          </div>

          <div className="space-y-8 mt-10">
            {pageContent.sections.map((section, idx) => (
              <div
                key={idx}
                className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300"
              >
                <h2 className="text-2xl font-bold text-blue-200 mb-4">
                  {section.title}
                </h2>
                <p className="text-blue-100/80 leading-relaxed">
                  {section.content}
                </p>

                {section.list && (
                  <ul className="space-y-2 mt-4">
                    {section.list.map((item, itemIdx) => (
                      <li
                        key={itemIdx}
                        className="flex items-start gap-2 text-blue-100/80"
                      >
                        <span className="text-blue-400 mt-1.5">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                )}

                {section.additional && (
                  <p className="text-blue-100/70 leading-relaxed mt-4 text-sm">
                    {section.additional}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </HelmetProvider>
  );
}
