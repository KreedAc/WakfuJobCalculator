import { HelmetProvider, Helmet } from 'react-helmet-async';
import { AlertTriangle } from 'lucide-react';
import { type Language } from '../constants/translations';

interface DisclaimerPageProps {
  language: Language;
}

export function DisclaimerPage({ language }: DisclaimerPageProps) {
  const content = {
    en: {
      title: 'Disclaimer',
      lastUpdated: 'Last Updated: February 2, 2026',
      intro: 'Please read this disclaimer carefully before using Wakfu Job Calculator. By accessing and using this website, you acknowledge and agree to the terms outlined below.',
      sections: [
        {
          title: 'General Information',
          content: 'The information provided on Wakfu Job Calculator is for general informational and entertainment purposes only. While we strive to keep the information accurate and up-to-date, we make no representations or warranties of any kind, express or implied, about the completeness, accuracy, reliability, suitability, or availability of the website or the information contained on the website for any purpose.'
        },
        {
          title: 'Game Content and Intellectual Property',
          content: 'WAKFU is a registered trademark and MMORPG created and owned by Ankama Games. Wakfu Job Calculator is an unofficial, fan-made website that is not affiliated with, endorsed by, or sponsored by Ankama Games in any way.',
          details: [
            'All WAKFU game content, including but not limited to character names, item names, recipes, icons, graphics, and game mechanics, are the intellectual property of Ankama Games.',
            'We do not claim any ownership of WAKFU-related content displayed on this website.',
            'All trademarks, service marks, trade names, trade dress, product names, and logos appearing on this website are the property of their respective owners.',
            'The use of WAKFU-related content on this website is for informational purposes only and falls under fair use for fan-created content.'
          ]
        },
        {
          title: 'Accuracy of Information',
          content: 'While we make every effort to ensure that the data displayed on Wakfu Job Calculator is accurate and reflects the current state of the game:',
          warnings: [
            'Game data may become outdated following game updates, patches, or balance changes by Ankama.',
            'There may be delays between official game updates and updates to our database.',
            'Calculations and formulas are based on community research and may not be 100% accurate.',
            'Some information may be incomplete, missing, or contain errors.',
            'We rely on community contributions and automated data extraction which may introduce inaccuracies.'
          ],
          recommendation: 'We strongly recommend verifying any critical information directly in the game before making important decisions based on data from this website.'
        },
        {
          title: 'No Professional Advice',
          content: 'The content on this website is provided for informational and entertainment purposes only and should not be considered as professional advice of any kind. We are not responsible for any decisions you make based on information found on this website.'
        },
        {
          title: 'Website Availability and Functionality',
          content: 'We strive to keep Wakfu Job Calculator operational and accessible, however:',
          points: [
            'We do not guarantee that the website will be available at all times or that it will be free from errors, viruses, or other harmful components.',
            'The website may experience downtime for maintenance, updates, or due to technical issues beyond our control.',
            'Features and functionality may change, be added, or removed without prior notice.',
            'We reserve the right to modify, suspend, or discontinue any part of the website at any time.'
          ]
        },
        {
          title: 'User-Generated Content and Community Contributions',
          content: 'If our website allows user submissions, comments, or other forms of user-generated content, please be aware that:',
          notes: [
            'User-generated content represents the views and opinions of the individual users, not Wakfu Job Calculator.',
            'We do not endorse, support, or guarantee the accuracy of user-generated content.',
            'Users are responsible for the content they submit and must comply with our Terms of Service.',
            'We reserve the right to moderate, edit, or remove user-generated content at our discretion.'
          ]
        },
        {
          title: 'Third-Party Links and Resources',
          content: 'Our website may contain links to external websites, resources, or services. These links are provided for your convenience, but:',
          disclaimers: [
            'We have no control over the content, availability, or practices of third-party websites.',
            'The inclusion of any link does not imply endorsement, approval, or recommendation by Wakfu Job Calculator.',
            'We are not responsible for the content, accuracy, or opinions expressed on third-party websites.',
            'Visiting third-party websites is at your own risk, and you should review their terms and privacy policies.'
          ]
        },
        {
          title: 'Limitation of Liability',
          content: 'To the fullest extent permitted by applicable law, Wakfu Job Calculator, its creators, contributors, and affiliated parties shall not be held liable for:',
          liabilities: [
            'Any direct, indirect, incidental, consequential, or punitive damages arising from your use of the website.',
            'Any errors, inaccuracies, or omissions in the content provided on the website.',
            'Any loss of data, profits, or opportunities resulting from the use of or inability to use the website.',
            'Any harm to your computer system, loss of data, or other harm resulting from access to or use of the website.',
            'Any decisions made based on information obtained from the website.'
          ],
          note: 'Your use of this website is at your own risk, and you agree to assume full responsibility for any consequences resulting from your use of the information provided.'
        },
        {
          title: 'No Warranty',
          content: 'Wakfu Job Calculator is provided on an "as is" and "as available" basis without any warranties of any kind, whether express or implied, including but not limited to:',
          warranties: [
            'Warranties of merchantability or fitness for a particular purpose.',
            'Warranties regarding the accuracy, reliability, or completeness of information.',
            'Warranties that the website will meet your requirements or expectations.',
            'Warranties that the website will be uninterrupted, secure, or error-free.'
          ]
        },
        {
          title: 'Changes and Updates',
          content: 'We reserve the right to update, modify, or revise this disclaimer at any time without prior notice. Any changes will be effective immediately upon posting to this page. Your continued use of the website following the posting of changes constitutes your acceptance of those changes.',
          recommendation: 'We encourage you to review this disclaimer periodically to stay informed of any updates.'
        },
        {
          title: 'Advertisements',
          content: 'This website may display advertisements provided by third-party advertising networks such as Google AdSense. Please note:',
          adNotes: [
            'We do not control the content of advertisements displayed on our website.',
            'The appearance of advertisements does not constitute endorsement of the advertised products or services.',
            'Advertisers may use cookies and tracking technologies to serve personalized ads.',
            'We are not responsible for the accuracy of claims made in advertisements.',
            'Interactions with advertisements and any resulting transactions are solely between you and the advertiser.'
          ]
        },
        {
          title: 'Geographic Limitations',
          content: 'Wakfu Job Calculator is designed for a global audience and may be accessed from countries around the world. However, we make no representation that the content on this website is appropriate or available for use in all locations. If you access this website from outside your country of residence, you are responsible for compliance with local laws.'
        },
        {
          title: 'Contact Information',
          content: 'If you have any questions, concerns, or feedback regarding this disclaimer or any aspect of Wakfu Job Calculator, please feel free to contact us through our Contact page. While we strive to respond to all inquiries, we cannot guarantee a response to every message received.'
        }
      ],
      finalNote: 'By using Wakfu Job Calculator, you acknowledge that you have read, understood, and agree to be bound by this disclaimer. If you do not agree with any part of this disclaimer, please discontinue use of the website immediately.'
    },
    fr: {
      title: 'Avertissement',
      lastUpdated: 'Dernière mise à jour : 2 février 2026',
      intro: 'Veuillez lire attentivement cet avertissement avant d\'utiliser Wakfu Job Calculator. En accédant et en utilisant ce site web, vous reconnaissez et acceptez les termes décrits ci-dessous.',
      sections: [
        {
          title: 'Informations Générales',
          content: 'Les informations fournies sur Wakfu Job Calculator sont à des fins d\'information générale et de divertissement uniquement. Bien que nous nous efforcions de maintenir les informations exactes et à jour, nous ne faisons aucune déclaration ou garantie de quelque nature que ce soit concernant l\'exhaustivité, l\'exactitude, la fiabilité ou la disponibilité du site web.'
        },
        {
          title: 'Contenu du Jeu et Propriété Intellectuelle',
          content: 'WAKFU est une marque déposée et un MMORPG créé et détenu par Ankama Games. Wakfu Job Calculator est un site web non officiel créé par des fans qui n\'est pas affilié, approuvé ou sponsorisé par Ankama Games.',
          details: [
            'Tout le contenu du jeu WAKFU, y compris les noms de personnages, les noms d\'objets, les recettes, les icônes et les mécaniques de jeu, sont la propriété intellectuelle d\'Ankama Games.',
            'Nous ne revendiquons aucune propriété sur le contenu lié à WAKFU affiché sur ce site.',
            'Toutes les marques commerciales apparaissant sur ce site sont la propriété de leurs propriétaires respectifs.',
            'L\'utilisation du contenu lié à WAKFU sur ce site est à des fins d\'information uniquement.'
          ]
        },
        {
          title: 'Exactitude des Informations',
          content: 'Bien que nous fassions tout notre possible pour nous assurer que les données affichées sont exactes :',
          warnings: [
            'Les données du jeu peuvent devenir obsolètes après les mises à jour du jeu.',
            'Il peut y avoir des retards entre les mises à jour officielles et les mises à jour de notre base de données.',
            'Les calculs sont basés sur des recherches communautaires et peuvent ne pas être 100% précis.',
            'Certaines informations peuvent être incomplètes ou contenir des erreurs.'
          ],
          recommendation: 'Nous recommandons fortement de vérifier toute information critique directement dans le jeu.'
        },
        {
          title: 'Aucun Conseil Professionnel',
          content: 'Le contenu de ce site web est fourni à des fins d\'information et de divertissement uniquement.'
        },
        {
          title: 'Disponibilité et Fonctionnalité du Site Web',
          content: 'Nous nous efforçons de maintenir Wakfu Job Calculator opérationnel et accessible, cependant :',
          points: [
            'Nous ne garantissons pas que le site web sera disponible à tout moment.',
            'Le site peut connaître des temps d\'arrêt pour maintenance ou problèmes techniques.',
            'Les fonctionnalités peuvent changer sans préavis.',
            'Nous nous réservons le droit de modifier ou suspendre toute partie du site.'
          ]
        },
        {
          title: 'Contenu Généré par les Utilisateurs',
          content: 'Si notre site permet des soumissions d\'utilisateurs :',
          notes: [
            'Le contenu généré par les utilisateurs représente les opinions individuelles.',
            'Nous n\'approuvons pas le contenu généré par les utilisateurs.',
            'Les utilisateurs sont responsables du contenu qu\'ils soumettent.',
            'Nous nous réservons le droit de modérer le contenu.'
          ]
        },
        {
          title: 'Liens et Ressources Tiers',
          content: 'Notre site peut contenir des liens vers des sites web externes :',
          disclaimers: [
            'Nous n\'avons aucun contrôle sur le contenu des sites tiers.',
            'L\'inclusion de liens n\'implique pas d\'approbation.',
            'Nous ne sommes pas responsables du contenu des sites tiers.',
            'Visitez les sites tiers à vos propres risques.'
          ]
        },
        {
          title: 'Limitation de Responsabilité',
          content: 'Wakfu Job Calculator ne sera pas tenu responsable de :',
          liabilities: [
            'Tout dommage direct ou indirect résultant de l\'utilisation du site.',
            'Toute erreur ou omission dans le contenu.',
            'Toute perte de données ou de profits.',
            'Tout préjudice à votre système informatique.',
            'Toute décision prise sur la base des informations du site.'
          ],
          note: 'Votre utilisation de ce site web est à vos propres risques.'
        },
        {
          title: 'Aucune Garantie',
          content: 'Wakfu Job Calculator est fourni "tel quel" sans aucune garantie.',
          warranties: [
            'Garanties de qualité marchande.',
            'Garanties concernant l\'exactitude des informations.',
            'Garanties que le site répondra à vos attentes.',
            'Garanties que le site sera ininterrompu ou sécurisé.'
          ]
        },
        {
          title: 'Modifications et Mises à Jour',
          content: 'Nous nous réservons le droit de mettre à jour cet avertissement à tout moment.',
          recommendation: 'Nous vous encourageons à consulter régulièrement cet avertissement.'
        },
        {
          title: 'Publicités',
          content: 'Ce site peut afficher des publicités de réseaux publicitaires tiers :',
          adNotes: [
            'Nous ne contrôlons pas le contenu des publicités.',
            'L\'apparition de publicités ne constitue pas une approbation.',
            'Les annonceurs peuvent utiliser des cookies.',
            'Nous ne sommes pas responsables de l\'exactitude des publicités.'
          ]
        },
        {
          title: 'Limitations Géographiques',
          content: 'Wakfu Job Calculator est conçu pour un public mondial. Si vous accédez au site depuis l\'extérieur de votre pays de résidence, vous êtes responsable du respect des lois locales.'
        },
        {
          title: 'Informations de Contact',
          content: 'Si vous avez des questions concernant cet avertissement, veuillez nous contacter via notre page Contact.'
        }
      ],
      finalNote: 'En utilisant Wakfu Job Calculator, vous reconnaissez avoir lu, compris et accepté cet avertissement.'
    },
    es: {
      title: 'Descargo de Responsabilidad',
      lastUpdated: 'Última actualización: 2 de febrero de 2026',
      intro: 'Por favor lea este descargo de responsabilidad cuidadosamente antes de usar Wakfu Job Calculator.',
      sections: [
        {
          title: 'Información General',
          content: 'La información proporcionada en Wakfu Job Calculator es solo para fines informativos y de entretenimiento.'
        },
        {
          title: 'Contenido del Juego y Propiedad Intelectual',
          content: 'WAKFU es una marca registrada propiedad de Ankama Games. Wakfu Job Calculator es un sitio web no oficial no afiliado con Ankama Games.',
          details: [
            'Todo el contenido del juego WAKFU es propiedad intelectual de Ankama Games.',
            'No reclamamos propiedad del contenido relacionado con WAKFU.',
            'Todas las marcas comerciales son propiedad de sus respectivos dueños.',
            'El uso del contenido relacionado con WAKFU es solo informativo.'
          ]
        },
        {
          title: 'Exactitud de la Información',
          content: 'Aunque hacemos todo lo posible para asegurar que los datos sean precisos:',
          warnings: [
            'Los datos pueden quedar obsoletos tras actualizaciones del juego.',
            'Puede haber retrasos entre actualizaciones oficiales y de nuestra base de datos.',
            'Los cálculos pueden no ser 100% precisos.',
            'Alguna información puede estar incompleta.'
          ],
          recommendation: 'Recomendamos verificar información crítica directamente en el juego.'
        },
        {
          title: 'Sin Asesoramiento Profesional',
          content: 'El contenido se proporciona solo con fines informativos y de entretenimiento.'
        },
        {
          title: 'Disponibilidad y Funcionalidad del Sitio Web',
          content: 'Nos esforzamos por mantener el sitio operativo, sin embargo:',
          points: [
            'No garantizamos que el sitio esté disponible en todo momento.',
            'El sitio puede experimentar tiempo de inactividad.',
            'Las funcionalidades pueden cambiar sin previo aviso.',
            'Nos reservamos el derecho de modificar el sitio.'
          ]
        },
        {
          title: 'Contenido Generado por Usuarios',
          content: 'Si nuestro sitio permite envíos de usuarios:',
          notes: [
            'El contenido generado representa opiniones individuales.',
            'No respaldamos el contenido generado por usuarios.',
            'Los usuarios son responsables del contenido que envían.',
            'Nos reservamos el derecho de moderar contenido.'
          ]
        },
        {
          title: 'Enlaces y Recursos de Terceros',
          content: 'Nuestro sitio puede contener enlaces a sitios web externos:',
          disclaimers: [
            'No tenemos control sobre el contenido de sitios terceros.',
            'La inclusión de enlaces no implica respaldo.',
            'No somos responsables del contenido de sitios terceros.',
            'Visite sitios terceros bajo su propio riesgo.'
          ]
        },
        {
          title: 'Limitación de Responsabilidad',
          content: 'Wakfu Job Calculator no será responsable de:',
          liabilities: [
            'Cualquier daño resultante del uso del sitio.',
            'Cualquier error u omisión en el contenido.',
            'Cualquier pérdida de datos o beneficios.',
            'Cualquier daño a su sistema informático.',
            'Cualquier decisión basada en información del sitio.'
          ],
          note: 'Su uso del sitio es bajo su propio riesgo.'
        },
        {
          title: 'Sin Garantía',
          content: 'Wakfu Job Calculator se proporciona "tal cual" sin garantías.',
          warranties: [
            'Garantías de comerciabilidad.',
            'Garantías sobre la exactitud de la información.',
            'Garantías de que el sitio cumplirá sus expectativas.',
            'Garantías de que el sitio será ininterrumpido.'
          ]
        },
        {
          title: 'Cambios y Actualizaciones',
          content: 'Nos reservamos el derecho de actualizar este descargo en cualquier momento.',
          recommendation: 'Le recomendamos revisar este descargo periódicamente.'
        },
        {
          title: 'Publicidad',
          content: 'Este sitio puede mostrar anuncios de redes publicitarias de terceros:',
          adNotes: [
            'No controlamos el contenido de los anuncios.',
            'La aparición de anuncios no constituye respaldo.',
            'Los anunciantes pueden usar cookies.',
            'No somos responsables de la exactitud de los anuncios.'
          ]
        },
        {
          title: 'Limitaciones Geográficas',
          content: 'Wakfu Job Calculator está diseñado para una audiencia global. Si accede desde fuera de su país, es responsable del cumplimiento de las leyes locales.'
        },
        {
          title: 'Información de Contacto',
          content: 'Si tiene preguntas sobre este descargo, contáctenos a través de nuestra página de Contacto.'
        }
      ],
      finalNote: 'Al usar Wakfu Job Calculator, usted reconoce haber leído y aceptado este descargo.'
    },
    pt: {
      title: 'Isenção de Responsabilidade',
      lastUpdated: 'Última atualização: 2 de fevereiro de 2026',
      intro: 'Por favor, leia esta isenção de responsabilidade cuidadosamente antes de usar o Wakfu Job Calculator.',
      sections: [
        {
          title: 'Informações Gerais',
          content: 'As informações fornecidas no Wakfu Job Calculator são apenas para fins informativos e de entretenimento.'
        },
        {
          title: 'Conteúdo do Jogo e Propriedade Intelectual',
          content: 'WAKFU é uma marca registrada de propriedade da Ankama Games. Wakfu Job Calculator é um site não oficial não afiliado com a Ankama Games.',
          details: [
            'Todo o conteúdo do jogo WAKFU é propriedade intelectual da Ankama Games.',
            'Não reivindicamos propriedade do conteúdo relacionado ao WAKFU.',
            'Todas as marcas comerciais são propriedade de seus respectivos donos.',
            'O uso do conteúdo relacionado ao WAKFU é apenas informativo.'
          ]
        },
        {
          title: 'Precisão das Informações',
          content: 'Embora façamos todo o possível para garantir que os dados sejam precisos:',
          warnings: [
            'Os dados podem ficar desatualizados após atualizações do jogo.',
            'Pode haver atrasos entre atualizações oficiais e de nosso banco de dados.',
            'Os cálculos podem não ser 100% precisos.',
            'Algumas informações podem estar incompletas.'
          ],
          recommendation: 'Recomendamos verificar informações críticas diretamente no jogo.'
        },
        {
          title: 'Nenhum Conselho Profissional',
          content: 'O conteúdo é fornecido apenas para fins informativos e de entretenimento.'
        },
        {
          title: 'Disponibilidade e Funcionalidade do Site',
          content: 'Nos esforçamos para manter o site operacional, no entanto:',
          points: [
            'Não garantimos que o site estará disponível o tempo todo.',
            'O site pode experimentar tempo de inatividade.',
            'As funcionalidades podem mudar sem aviso prévio.',
            'Reservamo-nos o direito de modificar o site.'
          ]
        },
        {
          title: 'Conteúdo Gerado por Usuários',
          content: 'Se nosso site permitir envios de usuários:',
          notes: [
            'O conteúdo gerado representa opiniões individuais.',
            'Não endossamos conteúdo gerado por usuários.',
            'Os usuários são responsáveis pelo conteúdo que enviam.',
            'Reservamo-nos o direito de moderar conteúdo.'
          ]
        },
        {
          title: 'Links e Recursos de Terceiros',
          content: 'Nosso site pode conter links para sites externos:',
          disclaimers: [
            'Não temos controle sobre o conteúdo de sites de terceiros.',
            'A inclusão de links não implica endosso.',
            'Não somos responsáveis pelo conteúdo de sites de terceiros.',
            'Visite sites de terceiros por sua própria conta e risco.'
          ]
        },
        {
          title: 'Limitação de Responsabilidade',
          content: 'Wakfu Job Calculator não será responsável por:',
          liabilities: [
            'Qualquer dano resultante do uso do site.',
            'Qualquer erro ou omissão no conteúdo.',
            'Qualquer perda de dados ou lucros.',
            'Qualquer dano ao seu sistema de computador.',
            'Qualquer decisão baseada em informações do site.'
          ],
          note: 'Seu uso do site é por sua própria conta e risco.'
        },
        {
          title: 'Sem Garantia',
          content: 'Wakfu Job Calculator é fornecido "como está" sem garantias.',
          warranties: [
            'Garantias de comercialização.',
            'Garantias sobre a precisão das informações.',
            'Garantias de que o site atenderá suas expectativas.',
            'Garantias de que o site será ininterrupto.'
          ]
        },
        {
          title: 'Alterações e Atualizações',
          content: 'Reservamo-nos o direito de atualizar esta isenção a qualquer momento.',
          recommendation: 'Recomendamos que você revise esta isenção periodicamente.'
        },
        {
          title: 'Publicidade',
          content: 'Este site pode exibir anúncios de redes publicitárias de terceiros:',
          adNotes: [
            'Não controlamos o conteúdo dos anúncios.',
            'A aparição de anúncios não constitui endosso.',
            'Os anunciantes podem usar cookies.',
            'Não somos responsáveis pela precisão dos anúncios.'
          ]
        },
        {
          title: 'Limitações Geográficas',
          content: 'Wakfu Job Calculator é projetado para um público global. Se você acessar de fora do seu país, é responsável pelo cumprimento das leis locais.'
        },
        {
          title: 'Informações de Contato',
          content: 'Se você tiver dúvidas sobre esta isenção, entre em contato através da nossa página de Contato.'
        }
      ],
      finalNote: 'Ao usar Wakfu Job Calculator, você reconhece ter lido e concordado com esta isenção.'
    }
  };

  const pageContent = content[language];

  return (
    <HelmetProvider>
      <Helmet>
        <title>{pageContent.title} - Wakfu Job Calculator</title>
        <meta name="description" content="Important disclaimer for Wakfu Job Calculator. Read about limitations, accuracy, and terms of use." />
      </Helmet>

      <div className="w-full max-w-5xl mx-auto px-4">
        <div className="backdrop-blur-xl bg-gray-900/80 border border-white/10 shadow-2xl rounded-3xl p-8 md:p-12">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-14 h-14 rounded-2xl bg-red-500/20 border border-red-500/30 flex items-center justify-center">
              <AlertTriangle className="w-7 h-7 text-red-300" />
            </div>
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-red-300">
                {pageContent.title}
              </h1>
              <p className="text-red-100/60 text-sm mt-1">
                {pageContent.lastUpdated}
              </p>
            </div>
          </div>

          <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-6 mb-8">
            <p className="text-red-100/90 leading-relaxed">
              {pageContent.intro}
            </p>
          </div>

          <div className="space-y-8">
            {pageContent.sections.map((section, idx) => (
              <div
                key={idx}
                className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300"
              >
                <h2 className="text-2xl font-bold text-red-200 mb-4">
                  {section.title}
                </h2>
                <p className="text-red-100/80 leading-relaxed">
                  {section.content}
                </p>

                {section.details && (
                  <ul className="space-y-2 mt-4">
                    {section.details.map((detail, detailIdx) => (
                      <li
                        key={detailIdx}
                        className="flex items-start gap-2 text-red-100/70 text-sm"
                      >
                        <span className="text-red-400 mt-1.5">•</span>
                        <span>{detail}</span>
                      </li>
                    ))}
                  </ul>
                )}

                {section.warnings && (
                  <ul className="space-y-2 mt-4">
                    {section.warnings.map((warning, warnIdx) => (
                      <li
                        key={warnIdx}
                        className="flex items-start gap-2 text-red-100/70 text-sm"
                      >
                        <span className="text-red-400 mt-1.5">⚠</span>
                        <span>{warning}</span>
                      </li>
                    ))}
                  </ul>
                )}

                {section.points && (
                  <ul className="space-y-2 mt-4">
                    {section.points.map((point, pointIdx) => (
                      <li
                        key={pointIdx}
                        className="flex items-start gap-2 text-red-100/70 text-sm"
                      >
                        <span className="text-red-400 mt-1.5">•</span>
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                )}

                {section.notes && (
                  <ul className="space-y-2 mt-4">
                    {section.notes.map((note, noteIdx) => (
                      <li
                        key={noteIdx}
                        className="flex items-start gap-2 text-red-100/70 text-sm"
                      >
                        <span className="text-red-400 mt-1.5">•</span>
                        <span>{note}</span>
                      </li>
                    ))}
                  </ul>
                )}

                {section.disclaimers && (
                  <ul className="space-y-2 mt-4">
                    {section.disclaimers.map((disclaimer, disclaimerIdx) => (
                      <li
                        key={disclaimerIdx}
                        className="flex items-start gap-2 text-red-100/70 text-sm"
                      >
                        <span className="text-red-400 mt-1.5">•</span>
                        <span>{disclaimer}</span>
                      </li>
                    ))}
                  </ul>
                )}

                {section.liabilities && (
                  <ul className="space-y-2 mt-4">
                    {section.liabilities.map((liability, liabilityIdx) => (
                      <li
                        key={liabilityIdx}
                        className="flex items-start gap-2 text-red-100/70 text-sm"
                      >
                        <span className="text-red-400 mt-1.5">•</span>
                        <span>{liability}</span>
                      </li>
                    ))}
                  </ul>
                )}

                {section.warranties && (
                  <ul className="space-y-2 mt-4">
                    {section.warranties.map((warranty, warrantyIdx) => (
                      <li
                        key={warrantyIdx}
                        className="flex items-start gap-2 text-red-100/70 text-sm"
                      >
                        <span className="text-red-400 mt-1.5">•</span>
                        <span>{warranty}</span>
                      </li>
                    ))}
                  </ul>
                )}

                {section.adNotes && (
                  <ul className="space-y-2 mt-4">
                    {section.adNotes.map((adNote, adNoteIdx) => (
                      <li
                        key={adNoteIdx}
                        className="flex items-start gap-2 text-red-100/70 text-sm"
                      >
                        <span className="text-red-400 mt-1.5">•</span>
                        <span>{adNote}</span>
                      </li>
                    ))}
                  </ul>
                )}

                {section.recommendation && (
                  <p className="text-red-100/80 leading-relaxed mt-4 text-sm font-medium bg-red-500/10 p-4 rounded-lg border border-red-500/20">
                    {section.recommendation}
                  </p>
                )}

                {section.note && (
                  <p className="text-red-100/70 leading-relaxed mt-4 text-sm italic">
                    {section.note}
                  </p>
                )}
              </div>
            ))}
          </div>

          <div className="mt-12 p-6 bg-red-500/15 border-2 border-red-500/30 rounded-2xl">
            <p className="text-center text-red-200 font-semibold leading-relaxed">
              {pageContent.finalNote}
            </p>
          </div>
        </div>
      </div>
    </HelmetProvider>
  );
}
