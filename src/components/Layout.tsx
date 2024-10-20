import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';

const Layout = () => {
  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <main className="flex-1 overflow-hidden bg-background p-4">
        <div className="h-full overflow-y-auto rounded-xl bg-white shadow-sm">
          <div className="container mx-auto px-6 py-8">
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Layout;