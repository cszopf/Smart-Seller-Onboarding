'use client';

import Image from 'next/image';
import { LayoutDashboard, Users, FileText, Settings, Bell, Search } from 'lucide-react';

export default function SpacesDashboard() {
  const logoUrl = "https://lh7-rt.googleusercontent.com/docsz/AD_4nXeSb6s_P3nXRrs9OUquQgATijkDX14cEdeK7kfFUFKVOvUMVife1HmNbLBMS4EQ8b5nKM-enx639-uc6mZ1b9kQbj41a6g4HwvAQPWZVHqq7Ity6k9n7AMSqCQVe-TAnBOOSaJcAhUrAuLw6bnSVj9pQYPDIw?key=kl0MF71HcvaAWt9zvK_MLQ";

  return (
    <div className="min-h-screen bg-[#F1F5F9] flex">
      {/* Sidebar */}
      <aside className="w-64 bg-[#004EA8] text-white hidden lg:flex flex-col">
        <div className="p-6 flex flex-col items-start gap-2">
          <div className="relative w-full h-12">
            <Image 
              src={logoUrl}
              alt="World Class Title Logo"
              fill
              className="object-contain object-left brightness-0 invert"
              priority
              referrerPolicy="no-referrer"
            />
          </div>
          <span className="font-bold text-[10px] tracking-[0.15em] font-nunito uppercase opacity-80">Smart Spaces</span>
        </div>
        
        <nav className="flex-1 px-4 py-6 space-y-2">
          <a href="#" className="flex items-center gap-3 px-4 py-3 bg-white/10 rounded-xl font-bold font-nunito uppercase tracking-wider text-xs">
            <LayoutDashboard className="h-5 w-5" /> Dashboard
          </a>
          <a href="#" className="flex items-center gap-3 px-4 py-3 hover:bg-white/5 rounded-xl transition-colors font-nunito uppercase tracking-wider text-xs">
            <Users className="h-5 w-5" /> Seller Leads
          </a>
          <a href="#" className="flex items-center gap-3 px-4 py-3 hover:bg-white/5 rounded-xl transition-colors font-nunito uppercase tracking-wider text-xs">
            <FileText className="h-5 w-5" /> Documents
          </a>
          <a href="#" className="flex items-center gap-3 px-4 py-3 hover:bg-white/5 rounded-xl transition-colors font-nunito uppercase tracking-wider text-xs">
            <Settings className="h-5 w-5" /> Settings
          </a>
        </nav>

        <div className="p-6 border-t border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-400 flex items-center justify-center font-bold font-nunito text-white">AS</div>
            <div>
              <p className="font-bold text-sm font-nunito">Alex Sterling</p>
              <p className="text-xs text-blue-200 font-nunito">Verified Professional</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col">
        <header className="h-20 bg-white border-b border-gray-200 px-8 flex items-center justify-between">
          <div className="relative w-96">
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search clients, properties, or files..." 
              className="w-full pl-10 pr-4 py-2 bg-gray-100 border-transparent rounded-lg focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all font-nunito"
            />
          </div>
          <div className="flex items-center gap-4">
            <button className="p-2 text-gray-400 hover:text-gray-600 relative">
              <Bell className="h-6 w-6" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
          </div>
        </header>

        <div className="p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 font-nunito uppercase tracking-[0.15em]">Smart Spaces</h1>
            <p className="text-gray-500 font-nunito">Welcome back, Alex. Here is what is happening with your files.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.15em] mb-2 font-montserrat">Active Leads</p>
              <p className="text-4xl font-bold text-gray-900 font-nunito">12</p>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.15em] mb-2 font-montserrat">Pending Auth</p>
              <p className="text-4xl font-bold text-gray-900 font-nunito">4</p>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.15em] mb-2 font-montserrat">Closed This Month</p>
              <p className="text-4xl font-bold text-emerald-600 font-nunito">8</p>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
              <h3 className="font-bold text-gray-900 font-montserrat uppercase tracking-wider text-sm">Recent Activity</h3>
              <button className="text-sm text-blue-600 font-bold font-nunito">View all</button>
            </div>
            <div className="divide-y divide-gray-100">
              {[1, 2, 3].map(i => (
                <div key={i} className="px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
                      <FileText className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-bold text-gray-900 font-nunito">Seller Authorization Signed</p>
                      <p className="text-sm text-gray-500 font-nunito">1234 Hight Street, Columbus OH • Jane Smith</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest font-montserrat">2 hours ago</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
