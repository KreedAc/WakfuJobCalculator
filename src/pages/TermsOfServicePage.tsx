import { HelmetProvider, Helmet } from 'react-helmet-async';
import { FileText } from 'lucide-react';
import { type Language } from '../constants/translations';

interface TermsOfServicePageProps {
  language: Language;
}

export function TermsOfServicePage({ language }: TermsOfServicePageProps) {
  const content = {
    en: {
      title: 'Terms of Service',
      lastUpdated: 'Last Updated: January 23, 2026',
      sections: [
        {
          title: 'Agreement to Terms',
          content: 'By accessing and using Wakfu Job Calculator, you accept and agree to be bound by the terms and provisions of this agreement. If you do not agree to these Terms of Service, please do not use our website.'
        },
        {
          title: 'Description of Service',
          content: 'Wakfu Job Calculator provides free online tools and resources for players of the MMORPG Wakfu, including:',
          list: [
            'XP calculators for crafting professions',
            'Sublimations database with filtering capabilities',
            'Items craft guide and recipe exploration',
            'Multi-language support and localized content',
            'Community-driven updates and improvements'
          ]
        },
        {
          title: 'Intellectual Property',
          content: 'All content, features, and functionality on Wakfu Job Calculator, including but not limited to text, graphics, logos, and software, are owned by the site creators or licensed to us. WAKFU, its characters, items, and game assets are intellectual property of Ankama Games. We do not claim ownership of any Wakfu-related content.'
        },
        {
          title: 'User Responsibilities',
          content: 'When using our services, you agree to:',
          list: [
            'Use the website only for lawful purposes',
            'Not attempt to interfere with the proper functioning of the website',
            'Not use automated systems to access the website excessively',
            'Respect intellectual property rights',
            'Not engage in any activity that could harm other users or the website'
          ]
        },
        {
          title: 'Disclaimer of Warranties',
          content: 'Wakfu Job Calculator is provided "as is" and "as available" without warranties of any kind, either express or implied. We do not guarantee that:',
          list: [
            'The website will be uninterrupted or error-free',
            'All information will be accurate or up-to-date',
            'Defects will be corrected',
            'The website is free of viruses or harmful components'
          ],
          additional: 'We strive to keep all game data current with the latest Wakfu updates, but there may be delays or inaccuracies. Always verify critical information in-game.'
        },
        {
          title: 'Limitation of Liability',
          content: 'To the fullest extent permitted by law, Wakfu Job Calculator and its creators shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of or inability to use the website, even if we have been advised of the possibility of such damages.'
        },
        {
          title: 'Third-Party Links',
          content: 'Our website may contain links to third-party websites or services that are not owned or controlled by Wakfu Job Calculator. We have no control over and assume no responsibility for the content, privacy policies, or practices of any third-party websites or services.'
        },
        {
          title: 'Game Content and Updates',
          content: 'Game data, including items, recipes, and sublimations, is sourced from Wakfu and belongs to Ankama Games. We make reasonable efforts to update our database regularly, but:',
          list: [
            'Updates may not be immediate after game patches',
            'Some information may be incomplete or outdated',
            'Calculations are based on game mechanics that may change',
            'We are not responsible for decisions made based on our data'
          ]
        },
        {
          title: 'Modifications to Service',
          content: 'We reserve the right to modify, suspend, or discontinue any part of the website at any time without notice. We may also impose limits on certain features or restrict access to parts or all of the website without liability.'
        },
        {
          title: 'Changes to Terms',
          content: 'We may update these Terms of Service from time to time. We will notify users of any material changes by posting the new terms on this page. Your continued use of the website after any changes constitutes acceptance of the new terms.'
        },
        {
          title: 'Governing Law',
          content: 'These Terms shall be governed by and construed in accordance with applicable international laws. Any disputes relating to these terms or the use of our website shall be subject to the exclusive jurisdiction of the appropriate courts.'
        },
        {
          title: 'Contact Information',
          content: 'If you have any questions about these Terms of Service, please contact us through our Contact page or reach out to the community on social media platforms.'
        }
      ]
    },
    fr: {
      title: 'Conditions d\'Utilisation',
      lastUpdated: 'Dernière mise à jour : 23 janvier 2026',
      sections: [
        {
          title: 'Acceptation des Conditions',
          content: 'En accédant et en utilisant Wakfu Job Calculator, vous acceptez et vous vous engagez à respecter les termes et dispositions de cet accord. Si vous n\'acceptez pas ces Conditions d\'Utilisation, veuillez ne pas utiliser notre site web.'
        },
        {
          title: 'Description du Service',
          content: 'Wakfu Job Calculator fournit des outils et ressources en ligne gratuits pour les joueurs du MMORPG Wakfu, incluant :',
          list: [
            'Calculateurs XP pour les métiers de craft',
            'Base de données de sublimations avec capacités de filtrage',
            'Guide de craft d\'objets et exploration de recettes',
            'Support multilingue et contenu localisé',
            'Mises à jour et améliorations pilotées par la communauté'
          ]
        },
        {
          title: 'Propriété Intellectuelle',
          content: 'Tout le contenu, les fonctionnalités et les fonctions de Wakfu Job Calculator, y compris mais sans s\'y limiter le texte, les graphiques, les logos et les logiciels, appartiennent aux créateurs du site ou nous sont concédés sous licence. WAKFU, ses personnages, objets et actifs de jeu sont la propriété intellectuelle d\'Ankama Games. Nous ne revendiquons pas la propriété de tout contenu lié à Wakfu.'
        },
        {
          title: 'Responsabilités de l\'Utilisateur',
          content: 'En utilisant nos services, vous acceptez de :',
          list: [
            'Utiliser le site web uniquement à des fins légales',
            'Ne pas tenter d\'interférer avec le bon fonctionnement du site web',
            'Ne pas utiliser de systèmes automatisés pour accéder excessivement au site web',
            'Respecter les droits de propriété intellectuelle',
            'Ne pas vous engager dans toute activité pouvant nuire à d\'autres utilisateurs ou au site web'
          ]
        },
        {
          title: 'Clause de Non-Responsabilité',
          content: 'Wakfu Job Calculator est fourni "tel quel" et "tel que disponible" sans garanties d\'aucune sorte, expresses ou implicites. Nous ne garantissons pas que :',
          list: [
            'Le site web sera ininterrompu ou sans erreur',
            'Toutes les informations seront exactes ou à jour',
            'Les défauts seront corrigés',
            'Le site web est exempt de virus ou de composants nuisibles'
          ],
          additional: 'Nous nous efforçons de maintenir toutes les données de jeu à jour avec les dernières mises à jour de Wakfu, mais il peut y avoir des retards ou des inexactitudes. Vérifiez toujours les informations critiques dans le jeu.'
        },
        {
          title: 'Limitation de Responsabilité',
          content: 'Dans toute la mesure permise par la loi, Wakfu Job Calculator et ses créateurs ne seront pas responsables de tout dommage indirect, accessoire, spécial, consécutif ou punitif résultant de votre utilisation ou de votre incapacité à utiliser le site web, même si nous avons été informés de la possibilité de tels dommages.'
        },
        {
          title: 'Liens Tiers',
          content: 'Notre site web peut contenir des liens vers des sites web ou services tiers qui ne sont pas détenus ou contrôlés par Wakfu Job Calculator. Nous n\'avons aucun contrôle et n\'assumons aucune responsabilité pour le contenu, les politiques de confidentialité ou les pratiques de tout site web ou service tiers.'
        },
        {
          title: 'Contenu du Jeu et Mises à Jour',
          content: 'Les données de jeu, y compris les objets, recettes et sublimations, proviennent de Wakfu et appartiennent à Ankama Games. Nous faisons des efforts raisonnables pour mettre à jour notre base de données régulièrement, mais :',
          list: [
            'Les mises à jour peuvent ne pas être immédiates après les patchs du jeu',
            'Certaines informations peuvent être incomplètes ou obsolètes',
            'Les calculs sont basés sur des mécaniques de jeu qui peuvent changer',
            'Nous ne sommes pas responsables des décisions prises sur la base de nos données'
          ]
        },
        {
          title: 'Modifications du Service',
          content: 'Nous nous réservons le droit de modifier, suspendre ou interrompre toute partie du site web à tout moment sans préavis. Nous pouvons également imposer des limites sur certaines fonctionnalités ou restreindre l\'accès à des parties ou à l\'ensemble du site web sans responsabilité.'
        },
        {
          title: 'Modifications des Conditions',
          content: 'Nous pouvons mettre à jour ces Conditions d\'Utilisation de temps à autre. Nous informerons les utilisateurs de tout changement important en publiant les nouvelles conditions sur cette page. Votre utilisation continue du site web après tout changement constitue l\'acceptation des nouvelles conditions.'
        },
        {
          title: 'Loi Applicable',
          content: 'Ces Conditions seront régies et interprétées conformément aux lois internationales applicables. Tout litige relatif à ces conditions ou à l\'utilisation de notre site web sera soumis à la juridiction exclusive des tribunaux appropriés.'
        },
        {
          title: 'Informations de Contact',
          content: 'Si vous avez des questions concernant ces Conditions d\'Utilisation, veuillez nous contacter via notre page Contact ou contactez la communauté sur les plateformes de médias sociaux.'
        }
      ]
    },
    es: {
      title: 'Términos de Servicio',
      lastUpdated: 'Última actualización: 23 de enero de 2026',
      sections: [
        {
          title: 'Acuerdo de Términos',
          content: 'Al acceder y usar Wakfu Job Calculator, usted acepta y se compromete a cumplir con los términos y disposiciones de este acuerdo. Si no está de acuerdo con estos Términos de Servicio, por favor no use nuestro sitio web.'
        },
        {
          title: 'Descripción del Servicio',
          content: 'Wakfu Job Calculator proporciona herramientas y recursos en línea gratuitos para jugadores del MMORPG Wakfu, incluyendo:',
          list: [
            'Calculadoras XP para profesiones de crafting',
            'Base de datos de sublimaciones con capacidades de filtrado',
            'Guía de crafteo de objetos y exploración de recetas',
            'Soporte multiidioma y contenido localizado',
            'Actualizaciones y mejoras impulsadas por la comunidad'
          ]
        },
        {
          title: 'Propiedad Intelectual',
          content: 'Todo el contenido, características y funcionalidad en Wakfu Job Calculator, incluyendo pero no limitado a texto, gráficos, logos y software, son propiedad de los creadores del sitio o están licenciados para nosotros. WAKFU, sus personajes, objetos y activos del juego son propiedad intelectual de Ankama Games. No reclamamos propiedad de ningún contenido relacionado con Wakfu.'
        },
        {
          title: 'Responsabilidades del Usuario',
          content: 'Al usar nuestros servicios, usted acepta:',
          list: [
            'Usar el sitio web solo para propósitos legales',
            'No intentar interferir con el funcionamiento apropiado del sitio web',
            'No usar sistemas automatizados para acceder excesivamente al sitio web',
            'Respetar los derechos de propiedad intelectual',
            'No participar en ninguna actividad que pueda dañar a otros usuarios o al sitio web'
          ]
        },
        {
          title: 'Descargo de Responsabilidad de Garantías',
          content: 'Wakfu Job Calculator se proporciona "tal cual" y "según disponibilidad" sin garantías de ningún tipo, ya sean expresas o implícitas. No garantizamos que:',
          list: [
            'El sitio web será ininterrumpido o libre de errores',
            'Toda la información será precisa o actualizada',
            'Los defectos serán corregidos',
            'El sitio web está libre de virus o componentes dañinos'
          ],
          additional: 'Nos esforzamos por mantener todos los datos del juego actualizados con las últimas actualizaciones de Wakfu, pero puede haber retrasos o inexactitudes. Siempre verifique la información crítica en el juego.'
        },
        {
          title: 'Limitación de Responsabilidad',
          content: 'En la máxima medida permitida por la ley, Wakfu Job Calculator y sus creadores no serán responsables de ningún daño indirecto, incidental, especial, consecuente o punitivo que resulte de su uso o incapacidad para usar el sitio web, incluso si hemos sido advertidos de la posibilidad de tales daños.'
        },
        {
          title: 'Enlaces de Terceros',
          content: 'Nuestro sitio web puede contener enlaces a sitios web o servicios de terceros que no son propiedad ni están controlados por Wakfu Job Calculator. No tenemos control ni asumimos responsabilidad por el contenido, políticas de privacidad o prácticas de sitios web o servicios de terceros.'
        },
        {
          title: 'Contenido del Juego y Actualizaciones',
          content: 'Los datos del juego, incluyendo objetos, recetas y sublimaciones, provienen de Wakfu y pertenecen a Ankama Games. Hacemos esfuerzos razonables para actualizar nuestra base de datos regularmente, pero:',
          list: [
            'Las actualizaciones pueden no ser inmediatas después de los parches del juego',
            'Alguna información puede estar incompleta u obsoleta',
            'Los cálculos se basan en mecánicas del juego que pueden cambiar',
            'No somos responsables de las decisiones tomadas basadas en nuestros datos'
          ]
        },
        {
          title: 'Modificaciones al Servicio',
          content: 'Nos reservamos el derecho de modificar, suspender o descontinuar cualquier parte del sitio web en cualquier momento sin previo aviso. También podemos imponer límites en ciertas características o restringir el acceso a partes o todo el sitio web sin responsabilidad.'
        },
        {
          title: 'Cambios en los Términos',
          content: 'Podemos actualizar estos Términos de Servicio de vez en cuando. Notificaremos a los usuarios de cualquier cambio material publicando los nuevos términos en esta página. Su uso continuado del sitio web después de cualquier cambio constituye aceptación de los nuevos términos.'
        },
        {
          title: 'Ley Aplicable',
          content: 'Estos Términos se regirán e interpretarán de acuerdo con las leyes internacionales aplicables. Cualquier disputa relacionada con estos términos o el uso de nuestro sitio web estará sujeta a la jurisdicción exclusiva de los tribunales apropiados.'
        },
        {
          title: 'Información de Contacto',
          content: 'Si tiene preguntas sobre estos Términos de Servicio, contáctenos a través de nuestra página de Contacto o comuníquese con la comunidad en las plataformas de redes sociales.'
        }
      ]
    },
    pt: {
      title: 'Termos de Serviço',
      lastUpdated: 'Última atualização: 23 de janeiro de 2026',
      sections: [
        {
          title: 'Acordo de Termos',
          content: 'Ao acessar e usar o Wakfu Job Calculator, você aceita e concorda em se comprometer com os termos e disposições deste acordo. Se você não concorda com estes Termos de Serviço, por favor não use nosso site.'
        },
        {
          title: 'Descrição do Serviço',
          content: 'Wakfu Job Calculator fornece ferramentas e recursos online gratuitos para jogadores do MMORPG Wakfu, incluindo:',
          list: [
            'Calculadoras XP para profissões de crafting',
            'Banco de dados de sublimações com capacidades de filtragem',
            'Guia de crafting de itens e exploração de receitas',
            'Suporte multilíngue e conteúdo localizado',
            'Atualizações e melhorias impulsionadas pela comunidade'
          ]
        },
        {
          title: 'Propriedade Intelectual',
          content: 'Todo o conteúdo, recursos e funcionalidades no Wakfu Job Calculator, incluindo mas não limitado a texto, gráficos, logos e software, são de propriedade dos criadores do site ou licenciados para nós. WAKFU, seus personagens, itens e ativos do jogo são propriedade intelectual da Ankama Games. Não reivindicamos propriedade de qualquer conteúdo relacionado ao Wakfu.'
        },
        {
          title: 'Responsabilidades do Usuário',
          content: 'Ao usar nossos serviços, você concorda em:',
          list: [
            'Usar o site apenas para propósitos legais',
            'Não tentar interferir com o funcionamento adequado do site',
            'Não usar sistemas automatizados para acessar o site excessivamente',
            'Respeitar direitos de propriedade intelectual',
            'Não se envolver em qualquer atividade que possa prejudicar outros usuários ou o site'
          ]
        },
        {
          title: 'Isenção de Garantias',
          content: 'Wakfu Job Calculator é fornecido "como está" e "conforme disponível" sem garantias de qualquer tipo, expressas ou implícitas. Não garantimos que:',
          list: [
            'O site será ininterrupto ou livre de erros',
            'Todas as informações serão precisas ou atualizadas',
            'Defeitos serão corrigidos',
            'O site está livre de vírus ou componentes prejudiciais'
          ],
          additional: 'Nos esforçamos para manter todos os dados do jogo atualizados com as últimas atualizações do Wakfu, mas pode haver atrasos ou imprecisões. Sempre verifique informações críticas no jogo.'
        },
        {
          title: 'Limitação de Responsabilidade',
          content: 'Na máxima extensão permitida por lei, Wakfu Job Calculator e seus criadores não serão responsáveis por quaisquer danos indiretos, incidentais, especiais, consequentes ou punitivos resultantes do seu uso ou incapacidade de usar o site, mesmo que tenhamos sido avisados da possibilidade de tais danos.'
        },
        {
          title: 'Links de Terceiros',
          content: 'Nosso site pode conter links para sites ou serviços de terceiros que não são de propriedade ou controlados pelo Wakfu Job Calculator. Não temos controle e não assumimos responsabilidade pelo conteúdo, políticas de privacidade ou práticas de sites ou serviços de terceiros.'
        },
        {
          title: 'Conteúdo do Jogo e Atualizações',
          content: 'Dados do jogo, incluindo itens, receitas e sublimações, são provenientes do Wakfu e pertencem à Ankama Games. Fazemos esforços razoáveis para atualizar nosso banco de dados regularmente, mas:',
          list: [
            'Atualizações podem não ser imediatas após patches do jogo',
            'Algumas informações podem estar incompletas ou desatualizadas',
            'Cálculos são baseados em mecânicas do jogo que podem mudar',
            'Não somos responsáveis por decisões tomadas com base em nossos dados'
          ]
        },
        {
          title: 'Modificações ao Serviço',
          content: 'Reservamo-nos o direito de modificar, suspender ou descontinuar qualquer parte do site a qualquer momento sem aviso prévio. Também podemos impor limites em certos recursos ou restringir o acesso a partes ou todo o site sem responsabilidade.'
        },
        {
          title: 'Alterações aos Termos',
          content: 'Podemos atualizar estes Termos de Serviço periodicamente. Notificaremos os usuários de quaisquer mudanças materiais publicando os novos termos nesta página. Seu uso contínuo do site após quaisquer mudanças constitui aceitação dos novos termos.'
        },
        {
          title: 'Lei Aplicável',
          content: 'Estes Termos serão regidos e interpretados de acordo com as leis internacionais aplicáveis. Quaisquer disputas relacionadas a estes termos ou ao uso de nosso site estarão sujeitas à jurisdição exclusiva dos tribunais apropriados.'
        },
        {
          title: 'Informações de Contato',
          content: 'Se você tiver dúvidas sobre estes Termos de Serviço, entre em contato conosco através da nossa página de Contato ou entre em contato com a comunidade nas plataformas de mídia social.'
        }
      ]
    }
  };

  const pageContent = content[language];

  return (
    <HelmetProvider>
      <Helmet>
        <title>{pageContent.title} - Wakfu Job Calculator</title>
        <meta name="description" content={`Terms of Service for Wakfu Job Calculator. Read our terms and conditions for using the website.`} />
      </Helmet>

      <div className="w-full max-w-5xl mx-auto px-4">
        <div className="backdrop-blur-xl bg-gray-900/80 border border-white/10 shadow-2xl rounded-3xl p-8 md:p-12">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-14 h-14 rounded-2xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center">
              <FileText className="w-7 h-7 text-purple-300" />
            </div>
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-purple-300">
                {pageContent.title}
              </h1>
              <p className="text-purple-100/60 text-sm mt-1">
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
                <h2 className="text-2xl font-bold text-purple-200 mb-4">
                  {section.title}
                </h2>
                <p className="text-purple-100/80 leading-relaxed">
                  {section.content}
                </p>

                {section.list && (
                  <ul className="space-y-2 mt-4">
                    {section.list.map((item, itemIdx) => (
                      <li
                        key={itemIdx}
                        className="flex items-start gap-2 text-purple-100/80"
                      >
                        <span className="text-purple-400 mt-1.5">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                )}

                {section.additional && (
                  <p className="text-purple-100/70 leading-relaxed mt-4 text-sm">
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
