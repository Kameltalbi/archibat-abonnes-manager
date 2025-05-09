import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckIcon, DownloadIcon, FileTextIcon, UserIcon, MailIcon, SettingsIcon } from 'lucide-react';

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <section className="min-h-screen flex items-center justify-center bg-gradient-to-br from-white to-gray-100 text-archibat-dark">
        <div className="container mx-auto text-center px-4">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">Bienvenue sur votre espace pro Archibat</h1>
          <p className="text-xl md:text-2xl mb-10 max-w-3xl mx-auto text-gray-700">Gérez vos abonnements, vos contenus et vos services digitaux</p>
          <Button asChild className="text-lg px-8 py-6 h-auto bg-archibat-blue hover:bg-archibat-blue/80">
            <Link to="/dashboard">Se connecter</Link>
          </Button>
        </div>
      </section>

      {/* Présentation d'Archibat */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="relative">
              <div className="absolute -top-6 -left-6 w-24 h-24 bg-archibat-blue/20 rounded-full"></div>
              <div className="relative z-10 p-4 bg-white shadow-lg rounded-lg">
                <img 
                  src="/placeholder.svg" 
                  alt="Archibat Magazine" 
                  className="w-full h-auto rounded"
                />
              </div>
              <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-archibat-violet/20 rounded-full"></div>
            </div>
            
            <div>
              <h2 className="text-3xl font-bold mb-6 text-archibat-dark">Découvrez Archibat</h2>
              <p className="text-lg mb-6">Archibat est la référence des professionnels de l'architecture et du bâtiment depuis 1997.</p>
              <ul className="space-y-3">
                <li className="flex items-center">
                  <CheckIcon className="h-5 w-5 text-archibat-blue mr-2" />
                  <span>Édition papier distribuée dans toute l'Afrique</span>
                </li>
                <li className="flex items-center">
                  <CheckIcon className="h-5 w-5 text-archibat-blue mr-2" />
                  <span>Version numérique enrichie</span>
                </li>
                <li className="flex items-center">
                  <CheckIcon className="h-5 w-5 text-archibat-blue mr-2" />
                  <span>Plateforme professionnelle exclusive</span>
                </li>
                <li className="flex items-center">
                  <CheckIcon className="h-5 w-5 text-archibat-blue mr-2" />
                  <span>Événements et networking</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Catalogue Abonnements + Tarifs */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Nos Offres d'Abonnement</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">Découvrez nos différentes formules adaptées à vos besoins professionnels</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {/* Carte 1 */}
            <Card className="transition-all duration-300 hover:shadow-xl">
              <CardHeader className="bg-gradient-to-r from-archibat-blue to-archibat-violet text-white">
                <CardTitle className="text-xl">Abonnement Standard</CardTitle>
                <CardDescription className="text-white/80">Pour les professionnels</CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <p className="text-3xl font-bold mb-6">29 900 <span className="text-sm font-normal">FCFA/an</span></p>
                <ul className="space-y-2 mb-6">
                  <li className="flex items-start">
                    <CheckIcon className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                    <span>4 numéros par an (version papier)</span>
                  </li>
                  <li className="flex items-start">
                    <CheckIcon className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                    <span>Accès à l'archive des 3 dernières années</span>
                  </li>
                  <li className="flex items-start">
                    <CheckIcon className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                    <span>Newsletter mensuelle</span>
                  </li>
                </ul>
              </CardContent>
              <CardFooter>
                <Button className="w-full">En savoir plus</Button>
              </CardFooter>
            </Card>
            
            {/* Carte 2 - Featured */}
            <Card className="transition-all duration-300 hover:shadow-xl relative border-archibat-pink">
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-archibat-pink text-white px-4 py-1 rounded-full text-sm font-medium">
                Populaire
              </div>
              <CardHeader className="bg-gradient-to-r from-archibat-violet to-archibat-pink text-white">
                <CardTitle className="text-xl">Abonnement Pro</CardTitle>
                <CardDescription className="text-white/80">Pour les cabinets et entreprises</CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <p className="text-3xl font-bold mb-6">49 900 <span className="text-sm font-normal">FCFA/an</span></p>
                <ul className="space-y-2 mb-6">
                  <li className="flex items-start">
                    <CheckIcon className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                    <span>4 numéros par an (papier et numérique)</span>
                  </li>
                  <li className="flex items-start">
                    <CheckIcon className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                    <span>Accès complet aux archives</span>
                  </li>
                  <li className="flex items-start">
                    <CheckIcon className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                    <span>Invitation aux événements exclusifs</span>
                  </li>
                  <li className="flex items-start">
                    <CheckIcon className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                    <span>Support prioritaire</span>
                  </li>
                </ul>
              </CardContent>
              <CardFooter>
                <Button className="w-full bg-archibat-pink hover:bg-archibat-pink/80">S'abonner</Button>
              </CardFooter>
            </Card>
            
            {/* Carte 3 */}
            <Card className="transition-all duration-300 hover:shadow-xl">
              <CardHeader className="bg-gradient-to-r from-archibat-pink to-archibat-blue/70 text-white">
                <CardTitle className="text-xl">Pack Digital</CardTitle>
                <CardDescription className="text-white/80">Accès 100% numérique</CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <p className="text-3xl font-bold mb-6">19 900 <span className="text-sm font-normal">FCFA/an</span></p>
                <ul className="space-y-2 mb-6">
                  <li className="flex items-start">
                    <CheckIcon className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                    <span>4 numéros par an (version numérique)</span>
                  </li>
                  <li className="flex items-start">
                    <CheckIcon className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                    <span>Accès à l'archive de l'année en cours</span>
                  </li>
                  <li className="flex items-start">
                    <CheckIcon className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                    <span>Contenus exclusifs web</span>
                  </li>
                </ul>
              </CardContent>
              <CardFooter>
                <Button className="w-full">En savoir plus</Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </section>

      {/* Fonctionnalités de l'espace abonné */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Fonctionnalités de l'espace abonné</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">Tout ce dont vous avez besoin, accessible en quelques clics</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-lg shadow-md hover:shadow-lg transition-shadow text-center">
              <div className="mb-4 mx-auto bg-archibat-blue/10 w-16 h-16 flex items-center justify-center rounded-full">
                <DownloadIcon className="h-8 w-8 text-archibat-blue" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Télécharger les revues</h3>
              <p className="text-gray-600">Accédez à toutes nos publications en version numérique, optimisée pour tous vos appareils.</p>
            </div>
            
            <div className="bg-white p-8 rounded-lg shadow-md hover:shadow-lg transition-shadow text-center">
              <div className="mb-4 mx-auto bg-archibat-violet/10 w-16 h-16 flex items-center justify-center rounded-full">
                <FileTextIcon className="h-8 w-8 text-archibat-violet" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Accéder aux factures</h3>
              <p className="text-gray-600">Retrouvez et téléchargez facilement l'historique de vos factures et paiements.</p>
            </div>
            
            <div className="bg-white p-8 rounded-lg shadow-md hover:shadow-lg transition-shadow text-center">
              <div className="mb-4 mx-auto bg-archibat-pink/10 w-16 h-16 flex items-center justify-center rounded-full">
                <UserIcon className="h-8 w-8 text-archibat-pink" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Modifier vos informations</h3>
              <p className="text-gray-600">Mettez à jour vos coordonnées et préférences de communication en toute simplicité.</p>
            </div>
            
            <div className="bg-white p-8 rounded-lg shadow-md hover:shadow-lg transition-shadow text-center">
              <div className="mb-4 mx-auto bg-archibat-blue/10 w-16 h-16 flex items-center justify-center rounded-full">
                <SettingsIcon className="h-8 w-8 text-archibat-blue" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Gérer vos services</h3>
              <p className="text-gray-600">Configurez et personnalisez vos services publicitaires et abonnements.</p>
            </div>
            
            <div className="bg-white p-8 rounded-lg shadow-md hover:shadow-lg transition-shadow text-center">
              <div className="mb-4 mx-auto bg-archibat-violet/10 w-16 h-16 flex items-center justify-center rounded-full">
                <MailIcon className="h-8 w-8 text-archibat-violet" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Contacter le support</h3>
              <p className="text-gray-600">Notre équipe est à votre disposition pour répondre à toutes vos questions.</p>
            </div>
            
            <div className="bg-white p-8 rounded-lg shadow-md hover:shadow-lg transition-shadow text-center relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-r from-archibat-blue to-archibat-pink opacity-0 group-hover:opacity-10 transition-opacity"></div>
              <div className="mb-4 mx-auto bg-archibat-pink/10 w-16 h-16 flex items-center justify-center rounded-full">
                <FileTextIcon className="h-8 w-8 text-archibat-pink" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Contenus exclusifs</h3>
              <p className="text-gray-600">Découvrez nos articles, interviews et analyses réservés aux abonnés.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center mb-8">
            <div className="mb-6 md:mb-0">
              <h2 className="text-3xl font-bold">Archibat</h2>
              <p className="text-gray-400">La référence en architecture depuis 1997</p>
            </div>
            <div className="flex space-x-4">
              <a href="#" className="bg-white/10 p-2 rounded-full hover:bg-white/20 transition-colors">
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd"></path>
                </svg>
              </a>
              <a href="#" className="bg-white/10 p-2 rounded-full hover:bg-white/20 transition-colors">
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd"></path>
                </svg>
              </a>
              <a href="#" className="bg-white/10 p-2 rounded-full hover:bg-white/20 transition-colors">
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"></path>
                </svg>
              </a>
              <a href="#" className="bg-white/10 p-2 rounded-full hover:bg-white/20 transition-colors">
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M19 3a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h14m-.5 15.5v-5.3a3.26 3.26 0 00-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 011.4 1.4v4.93h2.79M6.88 8.56a1.68 1.68 0 001.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 00-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" clipRule="evenodd"></path>
                </svg>
              </a>
            </div>
          </div>
          
          <div className="border-t border-gray-800 pt-8">
            <div className="flex flex-col md:flex-row md:justify-between">
              <div className="mb-6 md:mb-0">
                <ul className="flex flex-wrap gap-6">
                  <li><a href="#" className="hover:text-archibat-blue transition-colors">Mentions légales</a></li>
                  <li><a href="#" className="hover:text-archibat-blue transition-colors">Politique de confidentialité</a></li>
                  <li><a href="#" className="hover:text-archibat-blue transition-colors">Contact</a></li>
                </ul>
              </div>
              <div className="text-gray-400">
                <p>© {new Date().getFullYear()} Archibat. Tous droits réservés.</p>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
