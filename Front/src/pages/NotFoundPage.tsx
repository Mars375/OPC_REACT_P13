import { useNavigate } from 'react-router-dom';
import Layout from '../Layouts/Layout';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

/**
 * NotFoundPage component displays a 404 error page.
 * It informs the user that the requested page was not found and provides a button to navigate back to the home page.
 *
 * @component
 * @example
 * return (
 *   <NotFoundPage />
 * )
 */
const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Layout backgroundColor="bg-[#dfe6ed]">
      <div className="flex flex-1 flex-col items-center justify-center text-center">
        <FontAwesomeIcon
          icon="exclamation-circle"
          className="mb-4 text-6xl text-red-500"
        />
        <h1 className="mb-2 text-4xl font-bold">404 - Page Not Found</h1>
        <p className="mb-4 text-lg">
          Désolé, la page que vous recherchez n'existe pas.
        </p>
        <button
          onClick={() => navigate('/')}
          className="rounded bg-secondary px-4 py-2 text-white transition-colors duration-200 hover:bg-[#00A96B]"
        >
          Retour à l'accueil
        </button>
      </div>
    </Layout>
  );
};

export default NotFoundPage;
