import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Sidebar from './Sidebar';

export default function LayoutPanel() {
  const [sidebarAbierto, setSidebarAbierto] = useState(true);

  return (
    <div className="flex h-screen overflow-hidden bg-slate-100">
      <Sidebar abierto={sidebarAbierto} onCerrar={() => setSidebarAbierto(false)} />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Navbar onToggleSidebar={() => setSidebarAbierto(!sidebarAbierto)} />
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
