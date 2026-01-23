import { HelmetProvider, Helmet } from 'react-helmet-async';
import { Mail, MessageSquare, Users, Globe } from 'lucide-react';
import { type Language } from '../constants/translations';

interface ContactPageProps {
  language: Language;
}

export function ContactPage({ language }: ContactPageProps) {
  const content = {
    en: {
      title: 'Contact Us',
      description: 'Get in touch with the Wakfu Job Calculator team and community',
      sections: [
        {
          icon: MessageSquare,
          title: 'Community Feedback',
          content: 'We value your feedback and suggestions! As a community-driven project, your input helps us improve the tools and features we provide. Share your ideas, report bugs, or request new features.',
          action: 'Join the discussion on Wakfu community forums and Discord servers'
        },
        {
          icon: Users,
          title: 'Connect with the Community',
          content: 'Wakfu Job Calculator is maintained by passionate players. Connect with other Wakfu players on various community platforms:',
          list: [
            'Official Wakfu Discord servers',
            'Wakfu subreddit community',
            'Ankama forums',
            'Social media groups dedicated to Wakfu'
          ]
        },
        {
          icon: Globe,
          title: 'Website Support',
          content: 'If you encounter technical issues or have questions about using our tools, you can:',
          list: [
            'Check our Changelog page for recent updates and known issues',
            'Visit our About page for detailed information about features',
            'Report critical bugs through community channels',
            'Suggest improvements for calculators and databases'
          ]
        },
        {
          icon: Mail,
          title: 'Collaboration & Contributions',
          content: 'Interested in contributing to the project? We welcome collaboration from the community! Whether you have data corrections, translation improvements, or feature ideas, your contributions make a difference.',
          additional: 'Reach out through Wakfu community platforms to discuss how you can help improve Wakfu Job Calculator.'
        }
      ],
      note: 'Note: We are not affiliated with Ankama. For official Wakfu game support, please contact Ankama directly through their official channels.',
      credits: 'Created by KreedAc and LadyKreedAc with love for the Wakfu community'
    },
    fr: {
      title: 'Nous Contacter',
      description: 'Entrez en contact avec l\'équipe et la communauté de Wakfu Job Calculator',
      sections: [
        {
          icon: MessageSquare,
          title: 'Retours de la Communauté',
          content: 'Nous valorisons vos retours et suggestions ! En tant que projet communautaire, vos contributions nous aident à améliorer les outils et fonctionnalités que nous proposons. Partagez vos idées, signalez des bugs ou demandez de nouvelles fonctionnalités.',
          action: 'Rejoignez la discussion sur les forums de la communauté Wakfu et les serveurs Discord'
        },
        {
          icon: Users,
          title: 'Connectez-vous avec la Communauté',
          content: 'Wakfu Job Calculator est maintenu par des joueurs passionnés. Connectez-vous avec d\'autres joueurs de Wakfu sur diverses plateformes communautaires :',
          list: [
            'Serveurs Discord officiels de Wakfu',
            'Communauté subreddit Wakfu',
            'Forums Ankama',
            'Groupes de médias sociaux dédiés à Wakfu'
          ]
        },
        {
          icon: Globe,
          title: 'Support du Site Web',
          content: 'Si vous rencontrez des problèmes techniques ou avez des questions sur l\'utilisation de nos outils, vous pouvez :',
          list: [
            'Consulter notre page Changelog pour les mises à jour récentes et les problèmes connus',
            'Visiter notre page À propos pour des informations détaillées sur les fonctionnalités',
            'Signaler les bugs critiques via les canaux communautaires',
            'Suggérer des améliorations pour les calculateurs et bases de données'
          ]
        },
        {
          icon: Mail,
          title: 'Collaboration & Contributions',
          content: 'Intéressé à contribuer au projet ? Nous accueillons la collaboration de la communauté ! Que vous ayez des corrections de données, des améliorations de traduction ou des idées de fonctionnalités, vos contributions font la différence.',
          additional: 'Contactez-nous via les plateformes communautaires Wakfu pour discuter de la façon dont vous pouvez aider à améliorer Wakfu Job Calculator.'
        }
      ],
      note: 'Note : Nous ne sommes pas affiliés à Ankama. Pour le support officiel du jeu Wakfu, veuillez contacter Ankama directement via leurs canaux officiels.',
      credits: 'Créé par KreedAc et LadyKreedAc avec amour pour la communauté Wakfu'
    },
    es: {
      title: 'Contáctenos',
      description: 'Póngase en contacto con el equipo y la comunidad de Wakfu Job Calculator',
      sections: [
        {
          icon: MessageSquare,
          title: 'Comentarios de la Comunidad',
          content: '¡Valoramos sus comentarios y sugerencias! Como proyecto impulsado por la comunidad, sus aportes nos ayudan a mejorar las herramientas y características que proporcionamos. Comparta sus ideas, reporte errores o solicite nuevas funciones.',
          action: 'Únase a la discusión en los foros de la comunidad Wakfu y servidores Discord'
        },
        {
          icon: Users,
          title: 'Conéctese con la Comunidad',
          content: 'Wakfu Job Calculator es mantenido por jugadores apasionados. Conéctese con otros jugadores de Wakfu en varias plataformas comunitarias:',
          list: [
            'Servidores Discord oficiales de Wakfu',
            'Comunidad subreddit de Wakfu',
            'Foros de Ankama',
            'Grupos de redes sociales dedicados a Wakfu'
          ]
        },
        {
          icon: Globe,
          title: 'Soporte del Sitio Web',
          content: 'Si encuentra problemas técnicos o tiene preguntas sobre el uso de nuestras herramientas, puede:',
          list: [
            'Consultar nuestra página Changelog para actualizaciones recientes y problemas conocidos',
            'Visitar nuestra página Acerca de para información detallada sobre características',
            'Reportar errores críticos a través de canales comunitarios',
            'Sugerir mejoras para calculadoras y bases de datos'
          ]
        },
        {
          icon: Mail,
          title: 'Colaboración y Contribuciones',
          content: '¿Interesado en contribuir al proyecto? ¡Damos la bienvenida a la colaboración de la comunidad! Ya sea que tenga correcciones de datos, mejoras de traducción o ideas de características, sus contribuciones marcan la diferencia.',
          additional: 'Comuníquese a través de las plataformas comunitarias de Wakfu para discutir cómo puede ayudar a mejorar Wakfu Job Calculator.'
        }
      ],
      note: 'Nota: No estamos afiliados con Ankama. Para soporte oficial del juego Wakfu, contacte directamente a Ankama a través de sus canales oficiales.',
      credits: 'Creado por KreedAc y LadyKreedAc con amor para la comunidad Wakfu'
    },
    pt: {
      title: 'Entre em Contato',
      description: 'Entre em contato com a equipe e comunidade do Wakfu Job Calculator',
      sections: [
        {
          icon: MessageSquare,
          title: 'Feedback da Comunidade',
          content: 'Valorizamos seu feedback e sugestões! Como um projeto impulsionado pela comunidade, suas contribuições nos ajudam a melhorar as ferramentas e recursos que fornecemos. Compartilhe suas ideias, reporte bugs ou solicite novos recursos.',
          action: 'Participe da discussão nos fóruns da comunidade Wakfu e servidores Discord'
        },
        {
          icon: Users,
          title: 'Conecte-se com a Comunidade',
          content: 'Wakfu Job Calculator é mantido por jogadores apaixonados. Conecte-se com outros jogadores de Wakfu em várias plataformas comunitárias:',
          list: [
            'Servidores Discord oficiais do Wakfu',
            'Comunidade subreddit do Wakfu',
            'Fóruns Ankama',
            'Grupos de mídia social dedicados ao Wakfu'
          ]
        },
        {
          icon: Globe,
          title: 'Suporte do Site',
          content: 'Se você encontrar problemas técnicos ou tiver dúvidas sobre o uso de nossas ferramentas, você pode:',
          list: [
            'Verificar nossa página Changelog para atualizações recentes e problemas conhecidos',
            'Visitar nossa página Sobre para informações detalhadas sobre recursos',
            'Reportar bugs críticos através de canais comunitários',
            'Sugerir melhorias para calculadoras e bancos de dados'
          ]
        },
        {
          icon: Mail,
          title: 'Colaboração e Contribuições',
          content: 'Interessado em contribuir com o projeto? Damos as boas-vindas à colaboração da comunidade! Seja você tenha correções de dados, melhorias de tradução ou ideias de recursos, suas contribuições fazem a diferença.',
          additional: 'Entre em contato através das plataformas comunitárias Wakfu para discutir como você pode ajudar a melhorar o Wakfu Job Calculator.'
        }
      ],
      note: 'Nota: Não somos afiliados à Ankama. Para suporte oficial do jogo Wakfu, entre em contato diretamente com a Ankama através de seus canais oficiais.',
      credits: 'Criado por KreedAc e LadyKreedAc com amor para a comunidade Wakfu'
    }
  };

  const pageContent = content[language];

  return (
    <HelmetProvider>
      <Helmet>
        <title>{pageContent.title} - Wakfu Job Calculator</title>
        <meta name="description" content={pageContent.description} />
      </Helmet>

      <div className="w-full max-w-5xl mx-auto px-4">
        <div className="backdrop-blur-xl bg-gray-900/80 border border-white/10 shadow-2xl rounded-3xl p-8 md:p-12">
          <h1 className="text-4xl md:text-5xl font-bold text-orange-300 mb-4 text-center">
            {pageContent.title}
          </h1>
          <p className="text-orange-100/70 text-center text-lg mb-12">
            {pageContent.description}
          </p>

          <div className="space-y-8">
            {pageContent.sections.map((section, idx) => {
              const IconComponent = section.icon;
              return (
                <div
                  key={idx}
                  className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-xl bg-orange-500/20 border border-orange-500/30 flex items-center justify-center">
                      <IconComponent className="w-6 h-6 text-orange-300" />
                    </div>
                    <h2 className="text-2xl font-bold text-orange-200">
                      {section.title}
                    </h2>
                  </div>

                  <p className="text-orange-100/80 leading-relaxed">
                    {section.content}
                  </p>

                  {section.action && (
                    <p className="text-orange-300 font-medium mt-3">
                      {section.action}
                    </p>
                  )}

                  {section.list && (
                    <ul className="space-y-2 mt-4">
                      {section.list.map((item, itemIdx) => (
                        <li
                          key={itemIdx}
                          className="flex items-start gap-2 text-orange-100/80"
                        >
                          <span className="text-orange-400 mt-1.5">•</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  )}

                  {section.additional && (
                    <p className="text-orange-100/70 leading-relaxed mt-4 text-sm">
                      {section.additional}
                    </p>
                  )}
                </div>
              );
            })}
          </div>

          <div className="mt-12 space-y-4">
            <div className="p-6 bg-orange-500/10 border border-orange-500/20 rounded-2xl">
              <p className="text-center text-orange-200/90 text-sm leading-relaxed">
                <strong className="text-orange-300">Important:</strong> {pageContent.note}
              </p>
            </div>

            <div className="text-center text-orange-200/70 text-sm">
              {pageContent.credits}
            </div>
          </div>
        </div>
      </div>
    </HelmetProvider>
  );
}
