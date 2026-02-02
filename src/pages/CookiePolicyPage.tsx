import { HelmetProvider, Helmet } from 'react-helmet-async';
import { Cookie } from 'lucide-react';
import { type Language } from '../constants/translations';

interface CookiePolicyPageProps {
  language: Language;
}

export function CookiePolicyPage({ language }: CookiePolicyPageProps) {
  const content = {
    en: {
      title: 'Cookie Policy',
      lastUpdated: 'Last Updated: February 2, 2026',
      intro: 'This Cookie Policy explains how Wakfu Job Calculator uses cookies and similar technologies to recognize you when you visit our website. It explains what these technologies are and why we use them, as well as your rights to control our use of them.',
      sections: [
        {
          title: 'What Are Cookies?',
          content: 'Cookies are small data files that are placed on your computer or mobile device when you visit a website. Cookies are widely used by website owners to make their websites work, or to work more efficiently, as well as to provide reporting information.',
          details: 'Cookies set by the website owner (in this case, Wakfu Job Calculator) are called "first-party cookies". Cookies set by parties other than the website owner are called "third-party cookies". Third-party cookies enable third-party features or functionality to be provided on or through the website (e.g., advertising, interactive content, and analytics).'
        },
        {
          title: 'Why Do We Use Cookies?',
          content: 'We use first-party and third-party cookies for several reasons. Some cookies are required for technical reasons in order for our website to operate, and we refer to these as "essential" or "strictly necessary" cookies. Other cookies enable us to track and target the interests of our users to enhance the experience on our website. Third parties serve cookies through our website for advertising, analytics, and other purposes.',
          list: [
            'Essential cookies: Required for the website to function properly',
            'Preference cookies: Remember your settings and choices',
            'Analytics cookies: Help us understand how visitors interact with our website',
            'Advertising cookies: Used to deliver relevant advertisements'
          ]
        },
        {
          title: 'Types of Cookies We Use',
          subsections: [
            {
              title: 'Essential Website Cookies',
              content: 'These cookies are strictly necessary to provide you with services available through our website and to use some of its features, such as access to secure areas. Because these cookies are strictly necessary to deliver the website, you cannot refuse them without impacting how our website functions.'
            },
            {
              title: 'Performance and Functionality Cookies',
              content: 'These cookies are used to enhance the performance and functionality of our website but are non-essential to their use. However, without these cookies, certain functionality may become unavailable, such as language preferences and calculator settings.'
            },
            {
              title: 'Analytics and Customization Cookies',
              content: 'These cookies collect information that is used either in aggregate form to help us understand how our website is being used or how effective our marketing campaigns are, or to help us customize our website for you.',
              examples: 'We may use Google Analytics or similar services to help us understand user behavior and improve our service.'
            },
            {
              title: 'Advertising Cookies',
              content: 'These cookies are used to make advertising messages more relevant to you. They perform functions like preventing the same ad from continuously reappearing, ensuring that ads are properly displayed, and in some cases selecting advertisements that are based on your interests.',
              examples: 'We use Google AdSense to display advertisements on our website. Google may use cookies to serve ads based on your prior visits to our website or other websites.'
            }
          ]
        },
        {
          title: 'Third-Party Cookies',
          content: 'In addition to our own cookies, we may also use various third-party cookies to report usage statistics of the website and deliver advertisements on and through the website.',
          providers: [
            'Google AdSense: For displaying advertisements',
            'Google Analytics: For analyzing website traffic and user behavior',
            'Content Delivery Networks: For faster content delivery'
          ]
        },
        {
          title: 'How Can You Control Cookies?',
          content: 'You have the right to decide whether to accept or reject cookies. You can exercise your cookie preferences by clicking on the appropriate opt-out links provided in the cookie banner or by setting your browser to refuse cookies.',
          methods: [
            'Browser Settings: Most web browsers allow you to control cookies through their settings preferences. However, if you limit the ability of websites to set cookies, you may worsen your overall user experience.',
            'Cookie Banner: When you first visit our website, you can accept or reject non-essential cookies through our cookie consent banner.',
            'Browser Add-ons: You can install browser add-ons that block cookies and tracking scripts.',
            'Do Not Track: You can enable "Do Not Track" in your browser settings, though not all websites honor this setting.'
          ],
          note: 'Note that blocking or deleting cookies may affect your experience on our website and some features may not function properly.'
        },
        {
          title: 'Google AdSense and Advertising',
          content: 'We use Google AdSense to display advertisements on our website. Google AdSense uses cookies and similar technologies to show you personalized ads based on your browsing history and interests.',
          details: 'You can opt out of personalized advertising by visiting Google\'s Ads Settings at https://www.google.com/settings/ads. You can also opt out of a third-party vendor\'s use of cookies for personalized advertising by visiting www.aboutads.info.',
          commitment: 'We are committed to transparency in our advertising practices and comply with all applicable advertising regulations and guidelines.'
        },
        {
          title: 'Session Storage and Local Storage',
          content: 'In addition to cookies, we also use browser storage technologies like sessionStorage and localStorage to store information locally on your device. This helps us remember your preferences, calculator settings, and improve your overall experience.',
          usage: [
            'Language preferences',
            'Calculator input values',
            'UI preferences and settings',
            'Session tracking to prevent duplicate visit counts'
          ],
          note: 'This data is stored locally on your device and is not transmitted to our servers unless you explicitly submit it through forms or interactions.'
        },
        {
          title: 'Updates to This Cookie Policy',
          content: 'We may update this Cookie Policy from time to time to reflect changes in the cookies we use or for other operational, legal, or regulatory reasons. Please revisit this Cookie Policy regularly to stay informed about our use of cookies and related technologies.',
          lastUpdate: 'The date at the top of this Cookie Policy indicates when it was last updated.'
        },
        {
          title: 'Contact Us',
          content: 'If you have any questions about our use of cookies or other technologies, please contact us through our Contact page. We are committed to addressing your concerns and ensuring your privacy is protected.'
        }
      ]
    },
    fr: {
      title: 'Politique de Cookies',
      lastUpdated: 'Dernière mise à jour : 2 février 2026',
      intro: 'Cette Politique de Cookies explique comment Wakfu Job Calculator utilise les cookies et technologies similaires pour vous reconnaître lorsque vous visitez notre site web. Elle explique ce que sont ces technologies et pourquoi nous les utilisons, ainsi que vos droits pour contrôler notre utilisation.',
      sections: [
        {
          title: 'Que Sont les Cookies?',
          content: 'Les cookies sont de petits fichiers de données placés sur votre ordinateur ou appareil mobile lorsque vous visitez un site web. Les cookies sont largement utilisés par les propriétaires de sites web pour faire fonctionner leurs sites, ou pour les faire fonctionner plus efficacement, ainsi que pour fournir des informations de rapport.',
          details: 'Les cookies définis par le propriétaire du site web (dans ce cas, Wakfu Job Calculator) sont appelés "cookies first-party". Les cookies définis par des parties autres que le propriétaire du site web sont appelés "cookies third-party". Les cookies third-party permettent à des fonctionnalités ou fonctions tierces d\'être fournies sur ou via le site web.'
        },
        {
          title: 'Pourquoi Utilisons-Nous des Cookies?',
          content: 'Nous utilisons des cookies first-party et third-party pour plusieurs raisons. Certains cookies sont nécessaires pour des raisons techniques afin que notre site web fonctionne, et nous les appelons cookies "essentiels" ou "strictement nécessaires". D\'autres cookies nous permettent de suivre et cibler les intérêts de nos utilisateurs pour améliorer l\'expérience sur notre site web.',
          list: [
            'Cookies essentiels: Requis pour le bon fonctionnement du site web',
            'Cookies de préférence: Mémorisent vos paramètres et choix',
            'Cookies d\'analyse: Nous aident à comprendre comment les visiteurs interagissent avec notre site',
            'Cookies publicitaires: Utilisés pour diffuser des publicités pertinentes'
          ]
        },
        {
          title: 'Types de Cookies que Nous Utilisons',
          subsections: [
            {
              title: 'Cookies Essentiels du Site Web',
              content: 'Ces cookies sont strictement nécessaires pour vous fournir les services disponibles via notre site web et pour utiliser certaines de ses fonctionnalités. Parce que ces cookies sont strictement nécessaires pour fournir le site web, vous ne pouvez pas les refuser sans impacter le fonctionnement de notre site.'
            },
            {
              title: 'Cookies de Performance et de Fonctionnalité',
              content: 'Ces cookies sont utilisés pour améliorer la performance et la fonctionnalité de notre site web mais ne sont pas essentiels à leur utilisation. Cependant, sans ces cookies, certaines fonctionnalités peuvent devenir indisponibles, telles que les préférences linguistiques et les paramètres de calculateur.'
            },
            {
              title: 'Cookies d\'Analyse et de Personnalisation',
              content: 'Ces cookies collectent des informations utilisées soit sous forme agrégée pour nous aider à comprendre comment notre site web est utilisé, soit pour nous aider à personnaliser notre site web pour vous.',
              examples: 'Nous pouvons utiliser Google Analytics ou des services similaires pour nous aider à comprendre le comportement des utilisateurs et améliorer notre service.'
            },
            {
              title: 'Cookies Publicitaires',
              content: 'Ces cookies sont utilisés pour rendre les messages publicitaires plus pertinents pour vous. Ils effectuent des fonctions comme empêcher la même publicité de réapparaître continuellement, s\'assurer que les publicités sont correctement affichées, et dans certains cas sélectionner des publicités basées sur vos intérêts.',
              examples: 'Nous utilisons Google AdSense pour afficher des publicités sur notre site web. Google peut utiliser des cookies pour diffuser des publicités basées sur vos visites précédentes.'
            }
          ]
        },
        {
          title: 'Cookies Tiers',
          content: 'En plus de nos propres cookies, nous pouvons également utiliser divers cookies tiers pour rapporter les statistiques d\'utilisation du site web et diffuser des publicités.',
          providers: [
            'Google AdSense: Pour afficher des publicités',
            'Google Analytics: Pour analyser le trafic du site web',
            'Réseaux de diffusion de contenu: Pour une livraison de contenu plus rapide'
          ]
        },
        {
          title: 'Comment Pouvez-Vous Contrôler les Cookies?',
          content: 'Vous avez le droit de décider d\'accepter ou de refuser les cookies. Vous pouvez exercer vos préférences en matière de cookies en cliquant sur les liens de désinscription appropriés ou en configurant votre navigateur pour refuser les cookies.',
          methods: [
            'Paramètres du Navigateur: La plupart des navigateurs web vous permettent de contrôler les cookies via leurs préférences de paramètres.',
            'Bannière de Cookies: Lors de votre première visite, vous pouvez accepter ou refuser les cookies non essentiels.',
            'Extensions de Navigateur: Vous pouvez installer des extensions qui bloquent les cookies et les scripts de suivi.',
            'Ne Pas Suivre: Vous pouvez activer "Ne Pas Suivre" dans les paramètres de votre navigateur.'
          ],
          note: 'Notez que bloquer ou supprimer les cookies peut affecter votre expérience sur notre site web.'
        },
        {
          title: 'Google AdSense et Publicité',
          content: 'Nous utilisons Google AdSense pour afficher des publicités sur notre site web. Google AdSense utilise des cookies pour vous montrer des publicités personnalisées basées sur votre historique de navigation.',
          details: 'Vous pouvez désactiver la publicité personnalisée en visitant les Paramètres d\'annonces de Google à https://www.google.com/settings/ads.',
          commitment: 'Nous nous engageons à la transparence dans nos pratiques publicitaires et respectons toutes les réglementations applicables.'
        },
        {
          title: 'Session Storage et Local Storage',
          content: 'En plus des cookies, nous utilisons également des technologies de stockage de navigateur comme sessionStorage et localStorage pour stocker des informations localement sur votre appareil.',
          usage: [
            'Préférences linguistiques',
            'Valeurs de calculateur',
            'Préférences d\'interface utilisateur',
            'Suivi de session'
          ],
          note: 'Ces données sont stockées localement sur votre appareil et ne sont pas transmises à nos serveurs.'
        },
        {
          title: 'Mises à Jour de Cette Politique',
          content: 'Nous pouvons mettre à jour cette Politique de Cookies de temps à autre. Veuillez revisiter régulièrement cette politique pour rester informé.',
          lastUpdate: 'La date en haut de cette Politique de Cookies indique quand elle a été mise à jour pour la dernière fois.'
        },
        {
          title: 'Nous Contacter',
          content: 'Si vous avez des questions sur notre utilisation des cookies, veuillez nous contacter via notre page Contact.'
        }
      ]
    },
    es: {
      title: 'Política de Cookies',
      lastUpdated: 'Última actualización: 2 de febrero de 2026',
      intro: 'Esta Política de Cookies explica cómo Wakfu Job Calculator utiliza cookies y tecnologías similares para reconocerlo cuando visita nuestro sitio web.',
      sections: [
        {
          title: '¿Qué Son las Cookies?',
          content: 'Las cookies son pequeños archivos de datos que se colocan en su computadora o dispositivo móvil cuando visita un sitio web.',
          details: 'Las cookies establecidas por el propietario del sitio web se llaman "cookies first-party". Las cookies establecidas por otras partes se llaman "cookies third-party".'
        },
        {
          title: '¿Por Qué Usamos Cookies?',
          content: 'Usamos cookies first-party y third-party por varias razones. Algunas cookies son necesarias por razones técnicas para que nuestro sitio web funcione.',
          list: [
            'Cookies esenciales: Requeridas para el funcionamiento del sitio',
            'Cookies de preferencia: Recuerdan su configuración',
            'Cookies de análisis: Nos ayudan a entender cómo los visitantes interactúan',
            'Cookies publicitarias: Usadas para entregar anuncios relevantes'
          ]
        },
        {
          title: 'Tipos de Cookies que Usamos',
          subsections: [
            {
              title: 'Cookies Esenciales del Sitio Web',
              content: 'Estas cookies son estrictamente necesarias para proporcionarle servicios disponibles a través de nuestro sitio web.'
            },
            {
              title: 'Cookies de Rendimiento y Funcionalidad',
              content: 'Estas cookies se utilizan para mejorar el rendimiento y la funcionalidad de nuestro sitio web.'
            },
            {
              title: 'Cookies de Análisis y Personalización',
              content: 'Estas cookies recopilan información que se utiliza para ayudarnos a entender cómo se usa nuestro sitio web.',
              examples: 'Podemos usar Google Analytics para ayudarnos a entender el comportamiento del usuario.'
            },
            {
              title: 'Cookies Publicitarias',
              content: 'Estas cookies se utilizan para hacer que los mensajes publicitarios sean más relevantes para usted.',
              examples: 'Usamos Google AdSense para mostrar anuncios en nuestro sitio web.'
            }
          ]
        },
        {
          title: 'Cookies de Terceros',
          content: 'Además de nuestras propias cookies, también podemos usar varias cookies de terceros.',
          providers: [
            'Google AdSense: Para mostrar anuncios',
            'Google Analytics: Para analizar el tráfico del sitio web',
            'Redes de distribución de contenido: Para entrega más rápida'
          ]
        },
        {
          title: '¿Cómo Puede Controlar las Cookies?',
          content: 'Tiene el derecho de decidir si acepta o rechaza las cookies.',
          methods: [
            'Configuración del Navegador: La mayoría de los navegadores le permiten controlar las cookies',
            'Banner de Cookies: Puede aceptar o rechazar cookies no esenciales',
            'Complementos del Navegador: Puede instalar complementos que bloquean cookies',
            'No Rastrear: Puede habilitar "No Rastrear" en su navegador'
          ],
          note: 'Tenga en cuenta que bloquear cookies puede afectar su experiencia.'
        },
        {
          title: 'Google AdSense y Publicidad',
          content: 'Usamos Google AdSense para mostrar anuncios. Google AdSense usa cookies para mostrarle anuncios personalizados.',
          details: 'Puede optar por no recibir publicidad personalizada visitando la Configuración de anuncios de Google.',
          commitment: 'Estamos comprometidos con la transparencia en nuestras prácticas publicitarias.'
        },
        {
          title: 'Session Storage y Local Storage',
          content: 'Además de cookies, también usamos tecnologías de almacenamiento del navegador para almacenar información localmente.',
          usage: [
            'Preferencias de idioma',
            'Valores de calculadora',
            'Preferencias de interfaz',
            'Seguimiento de sesión'
          ],
          note: 'Estos datos se almacenan localmente en su dispositivo.'
        },
        {
          title: 'Actualizaciones a Esta Política',
          content: 'Podemos actualizar esta Política de Cookies periódicamente.',
          lastUpdate: 'La fecha en la parte superior indica cuándo se actualizó por última vez.'
        },
        {
          title: 'Contáctenos',
          content: 'Si tiene preguntas sobre nuestro uso de cookies, contáctenos a través de nuestra página de Contacto.'
        }
      ]
    },
    pt: {
      title: 'Política de Cookies',
      lastUpdated: 'Última atualização: 2 de fevereiro de 2026',
      intro: 'Esta Política de Cookies explica como Wakfu Job Calculator usa cookies e tecnologias similares para reconhecê-lo quando você visita nosso site.',
      sections: [
        {
          title: 'O Que São Cookies?',
          content: 'Cookies são pequenos arquivos de dados que são colocados em seu computador ou dispositivo móvel quando você visita um site.',
          details: 'Cookies definidos pelo proprietário do site são chamados de "cookies first-party". Cookies definidos por outras partes são chamados de "cookies third-party".'
        },
        {
          title: 'Por Que Usamos Cookies?',
          content: 'Usamos cookies first-party e third-party por várias razões. Alguns cookies são necessários por razões técnicas para que nosso site funcione.',
          list: [
            'Cookies essenciais: Necessários para o funcionamento do site',
            'Cookies de preferência: Lembram suas configurações',
            'Cookies de análise: Nos ajudam a entender como os visitantes interagem',
            'Cookies publicitários: Usados para entregar anúncios relevantes'
          ]
        },
        {
          title: 'Tipos de Cookies que Usamos',
          subsections: [
            {
              title: 'Cookies Essenciais do Site',
              content: 'Estes cookies são estritamente necessários para fornecer serviços disponíveis através do nosso site.'
            },
            {
              title: 'Cookies de Desempenho e Funcionalidade',
              content: 'Estes cookies são usados para melhorar o desempenho e a funcionalidade do nosso site.'
            },
            {
              title: 'Cookies de Análise e Personalização',
              content: 'Estes cookies coletam informações usadas para nos ajudar a entender como nosso site está sendo usado.',
              examples: 'Podemos usar Google Analytics para nos ajudar a entender o comportamento do usuário.'
            },
            {
              title: 'Cookies Publicitários',
              content: 'Estes cookies são usados para tornar as mensagens publicitárias mais relevantes para você.',
              examples: 'Usamos Google AdSense para exibir anúncios em nosso site.'
            }
          ]
        },
        {
          title: 'Cookies de Terceiros',
          content: 'Além de nossos próprios cookies, também podemos usar vários cookies de terceiros.',
          providers: [
            'Google AdSense: Para exibir anúncios',
            'Google Analytics: Para analisar o tráfego do site',
            'Redes de distribuição de conteúdo: Para entrega mais rápida'
          ]
        },
        {
          title: 'Como Você Pode Controlar Cookies?',
          content: 'Você tem o direito de decidir se aceita ou rejeita cookies.',
          methods: [
            'Configurações do Navegador: A maioria dos navegadores permite controlar cookies',
            'Banner de Cookies: Você pode aceitar ou rejeitar cookies não essenciais',
            'Complementos do Navegador: Você pode instalar complementos que bloqueiam cookies',
            'Não Rastrear: Você pode habilitar "Não Rastrear" no seu navegador'
          ],
          note: 'Note que bloquear cookies pode afetar sua experiência.'
        },
        {
          title: 'Google AdSense e Publicidade',
          content: 'Usamos Google AdSense para exibir anúncios. Google AdSense usa cookies para mostrar anúncios personalizados.',
          details: 'Você pode desativar a publicidade personalizada visitando as Configurações de anúncios do Google.',
          commitment: 'Estamos comprometidos com a transparência em nossas práticas publicitárias.'
        },
        {
          title: 'Session Storage e Local Storage',
          content: 'Além de cookies, também usamos tecnologias de armazenamento do navegador para armazenar informações localmente.',
          usage: [
            'Preferências de idioma',
            'Valores da calculadora',
            'Preferências de interface',
            'Rastreamento de sessão'
          ],
          note: 'Estes dados são armazenados localmente no seu dispositivo.'
        },
        {
          title: 'Atualizações a Esta Política',
          content: 'Podemos atualizar esta Política de Cookies periodicamente.',
          lastUpdate: 'A data no topo indica quando foi atualizada pela última vez.'
        },
        {
          title: 'Entre em Contato',
          content: 'Se você tiver dúvidas sobre nosso uso de cookies, entre em contato através da nossa página de Contato.'
        }
      ]
    }
  };

  const pageContent = content[language];

  return (
    <HelmetProvider>
      <Helmet>
        <title>{pageContent.title} - Wakfu Job Calculator</title>
        <meta name="description" content="Learn about how Wakfu Job Calculator uses cookies and similar technologies. Understand your privacy and control options." />
      </Helmet>

      <div className="w-full max-w-5xl mx-auto px-4">
        <div className="backdrop-blur-xl bg-gray-900/80 border border-white/10 shadow-2xl rounded-3xl p-8 md:p-12">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-14 h-14 rounded-2xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center">
              <Cookie className="w-7 h-7 text-amber-300" />
            </div>
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-amber-300">
                {pageContent.title}
              </h1>
              <p className="text-amber-100/60 text-sm mt-1">
                {pageContent.lastUpdated}
              </p>
            </div>
          </div>

          <p className="text-amber-100/80 leading-relaxed mb-8">
            {pageContent.intro}
          </p>

          <div className="space-y-8">
            {pageContent.sections.map((section, idx) => (
              <div
                key={idx}
                className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300"
              >
                <h2 className="text-2xl font-bold text-amber-200 mb-4">
                  {section.title}
                </h2>
                <p className="text-amber-100/80 leading-relaxed">
                  {section.content}
                </p>

                {section.details && (
                  <p className="text-amber-100/70 leading-relaxed mt-4 text-sm">
                    {section.details}
                  </p>
                )}

                {section.list && (
                  <ul className="space-y-2 mt-4">
                    {section.list.map((item, itemIdx) => (
                      <li
                        key={itemIdx}
                        className="flex items-start gap-2 text-amber-100/80"
                      >
                        <span className="text-amber-400 mt-1.5">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                )}

                {section.subsections && (
                  <div className="mt-6 space-y-4">
                    {section.subsections.map((subsection, subIdx) => (
                      <div key={subIdx} className="pl-4 border-l-2 border-amber-500/30">
                        <h3 className="text-lg font-semibold text-amber-200 mb-2">
                          {subsection.title}
                        </h3>
                        <p className="text-amber-100/70 text-sm leading-relaxed">
                          {subsection.content}
                        </p>
                        {subsection.examples && (
                          <p className="text-amber-100/60 text-xs leading-relaxed mt-2 italic">
                            {subsection.examples}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {section.providers && (
                  <ul className="space-y-2 mt-4">
                    {section.providers.map((provider, provIdx) => (
                      <li
                        key={provIdx}
                        className="flex items-start gap-2 text-amber-100/80 text-sm"
                      >
                        <span className="text-amber-400 mt-1.5">•</span>
                        <span>{provider}</span>
                      </li>
                    ))}
                  </ul>
                )}

                {section.methods && (
                  <div className="mt-4 space-y-3">
                    {section.methods.map((method, methodIdx) => (
                      <div key={methodIdx} className="text-amber-100/70 text-sm">
                        <span className="text-amber-300 font-medium">
                          {method.split(':')[0]}:
                        </span>
                        <span> {method.split(':').slice(1).join(':')}</span>
                      </div>
                    ))}
                  </div>
                )}

                {section.usage && (
                  <ul className="space-y-2 mt-4">
                    {section.usage.map((item, itemIdx) => (
                      <li
                        key={itemIdx}
                        className="flex items-start gap-2 text-amber-100/80 text-sm"
                      >
                        <span className="text-amber-400 mt-1.5">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                )}

                {section.note && (
                  <p className="text-amber-100/60 leading-relaxed mt-4 text-sm italic bg-amber-500/10 p-3 rounded-lg border border-amber-500/20">
                    {section.note}
                  </p>
                )}

                {section.commitment && (
                  <p className="text-amber-100/70 leading-relaxed mt-4 text-sm">
                    {section.commitment}
                  </p>
                )}

                {section.lastUpdate && (
                  <p className="text-amber-100/60 leading-relaxed mt-4 text-sm">
                    {section.lastUpdate}
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
