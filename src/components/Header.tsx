
import { Link, useLocation } from 'react-router-dom';
import { Home, Building, KeyRound } from 'lucide-react';
import { cn } from '@/lib/utils';

const Header = () => {
  // Wrap useLocation in a try/catch to prevent errors if rendered outside Router context
  let location = { pathname: '' };
  try {
    location = useLocation();
  } catch (error) {
    console.error('Header rendered outside Router context', error);
  }
  
  return (
    <header className="bg-primary text-white p-4 shadow-md w-full">
      <div className="container mx-auto flex flex-col sm:flex-row justify-between items-center">
        <h1 className="text-2xl font-bold mb-4 sm:mb-0">Cristina Bolelli Imóveis</h1>
        
        <nav className="flex items-center space-x-2">
          <NavLink 
            to="/dashboard" 
            active={location.pathname === '/dashboard'} 
            icon={<Home size={20} />}
          >
            Dashboard
          </NavLink>
          
          <NavLink 
            to="/imoveis" 
            active={location.pathname === '/imoveis'} 
            icon={<Building size={20} />}
          >
            Imóveis
          </NavLink>
          
          <NavLink 
            to="/alugueis" 
            active={location.pathname === '/alugueis'} 
            icon={<KeyRound size={20} />}
          >
            Aluguéis
          </NavLink>
        </nav>
      </div>
    </header>
  );
};

interface NavLinkProps {
  to: string;
  active: boolean;
  icon: React.ReactNode;
  children: React.ReactNode;
}

const NavLink = ({ to, active, icon, children }: NavLinkProps) => {
  return (
    <Link
      to={to}
      className={cn(
        "flex items-center px-4 py-2 rounded-md transition-colors",
        active 
          ? "bg-white text-primary" 
          : "text-white hover:bg-blue-600"
      )}
    >
      <span className="mr-2">{icon}</span>
      <span>{children}</span>
    </Link>
  );
};

export default Header;
