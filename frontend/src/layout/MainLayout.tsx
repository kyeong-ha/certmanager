import Sidebar from './components/Sidebar';
import Topbar from './components/Topbar';

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex flex-col flex-1">
        <Topbar />
        <main className="p-6 overflow-y-auto bg-gray-50 h-full">
          {children}
        </main>
      </div>
    </div>
  );
}