
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import {
  ChevronLeft,
  ChevronRight,
  ListIcon,
  Edit,
  FileText,
  Clock,
  SearchIcon,
  ArrowDown,
  ArrowUp,
} from 'lucide-react';

export interface Subscriber {
  id: string;
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  typeAbonnement: string;
  dateDebut: string;
  dateFin: string;
  montant: number;
  statut: 'actif' | 'en_attente' | 'expire';
}

interface SubscribersTableProps {
  subscribers: Subscriber[];
}

export function SubscribersTable({ subscribers: initialSubscribers }: SubscribersTableProps) {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<keyof Subscriber | null>(null);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Filter subscribers based on search term
  const filteredSubscribers = initialSubscribers.filter((subscriber) => {
    const searchValue = searchTerm.toLowerCase();
    return (
      subscriber.nom.toLowerCase().includes(searchValue) ||
      subscriber.prenom.toLowerCase().includes(searchValue) ||
      subscriber.email.toLowerCase().includes(searchValue) ||
      subscriber.telephone.toLowerCase().includes(searchValue) ||
      subscriber.typeAbonnement.toLowerCase().includes(searchValue)
    );
  });

  // Sort subscribers
  const sortedSubscribers = sortBy
    ? [...filteredSubscribers].sort((a, b) => {
        const aValue = a[sortBy];
        const bValue = b[sortBy];
        
        if (aValue < bValue) {
          return sortOrder === 'asc' ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortOrder === 'asc' ? 1 : -1;
        }
        return 0;
      })
    : filteredSubscribers;

  // Paginate subscribers
  const paginatedSubscribers = sortedSubscribers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(sortedSubscribers.length / itemsPerPage);

  const handleSort = (column: keyof Subscriber) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortOrder('asc');
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'actif':
        return <Badge className="bg-green-500">Actif</Badge>;
      case 'en_attente':
        return <Badge className="bg-amber-500">En attente</Badge>;
      case 'expire':
        return <Badge className="bg-red-500">Expiré</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const handleRowClick = (subscriberId: string) => {
    navigate(`/abonnes-locaux/${subscriberId}`);
  };

  return (
    <div className="space-y-4">
      <div className="relative w-80">
        <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Rechercher un abonné..."
          className="pl-8"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead 
                className="cursor-pointer" 
                onClick={() => handleSort('nom')}
              >
                Nom 
                {sortBy === 'nom' && (
                  sortOrder === 'asc' ? <ArrowUp className="inline w-4 h-4 ml-1" /> : <ArrowDown className="inline w-4 h-4 ml-1" />
                )}
              </TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Téléphone</TableHead>
              <TableHead>Type d'abonnement</TableHead>
              <TableHead 
                className="cursor-pointer" 
                onClick={() => handleSort('dateFin')}
              >
                Expire le 
                {sortBy === 'dateFin' && (
                  sortOrder === 'asc' ? <ArrowUp className="inline w-4 h-4 ml-1" /> : <ArrowDown className="inline w-4 h-4 ml-1" />
                )}
              </TableHead>
              <TableHead>Montant (DT)</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedSubscribers.length > 0 ? (
              paginatedSubscribers.map((subscriber) => (
                <TableRow
                  key={subscriber.id}
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => handleRowClick(subscriber.id)}
                >
                  <TableCell className="font-medium">
                    {subscriber.nom} {subscriber.prenom}
                  </TableCell>
                  <TableCell>{subscriber.email}</TableCell>
                  <TableCell>{subscriber.telephone}</TableCell>
                  <TableCell>{subscriber.typeAbonnement}</TableCell>
                  <TableCell>{subscriber.dateFin}</TableCell>
                  <TableCell>{subscriber.montant} DT</TableCell>
                  <TableCell>{getStatusBadge(subscriber.statut)}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                        <Button variant="ghost" size="sm">
                          <ListIcon className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem 
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/abonnes-locaux/${subscriber.id}/edit`);
                          }}
                        >
                          <Edit className="h-4 w-4 mr-2" />
                          Modifier
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={(e) => e.stopPropagation()}>
                          <FileText className="h-4 w-4 mr-2" />
                          Facture
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={(e) => e.stopPropagation()}>
                          <Clock className="h-4 w-4 mr-2" />
                          Renouveler
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-6">
                  Aucun abonné trouvé
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Affichage de {Math.min((currentPage - 1) * itemsPerPage + 1, sortedSubscribers.length)} 
            à {Math.min(currentPage * itemsPerPage, sortedSubscribers.length)} 
            sur {sortedSubscribers.length} abonnés
          </p>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(currentPage - 1)}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-sm font-medium">
              Page {currentPage} sur {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
