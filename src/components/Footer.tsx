
const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-gray-100 p-4 mt-auto text-center text-sm text-gray-600">
      <p>© {currentYear} Casa Aluguel Gestor. Todos os direitos reservados.</p>
    </footer>
  );
};

export default Footer;
