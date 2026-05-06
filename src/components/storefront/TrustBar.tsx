import { MapPin, Zap, ShieldCheck, Battery } from "lucide-react";

const trustItems = [
  { icon: MapPin,       title: "Physical Store",         subtitle: "Moi Avenue, Nairobi CBD",  color: "text-blue-400",   bg: "bg-blue-500/10" },
  { icon: Zap,          title: "Same-Day Delivery",      subtitle: "Order before 2 PM",         color: "text-amber-400",  bg: "bg-amber-500/10" },
  { icon: ShieldCheck,  title: "Genuine Stock Only",     subtitle: "100% verified devices",     color: "text-emerald-400",bg: "bg-emerald-500/10" },
  { icon: Battery,      title: "Battery Certified",      subtitle: "Every phone tested",        color: "text-violet-400", bg: "bg-violet-500/10" },
];

export function TrustBar() {
  return (
    <section className="bg-gray-950 border-y border-white/[0.06] py-5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          {trustItems.map((item) => (
            <div key={item.title} className="flex items-center gap-3">
              <div className={`flex-shrink-0 p-2.5 rounded-xl ${item.bg}`}>
                <item.icon className={`w-4.5 h-4.5 ${item.color}`} style={{ width: "18px", height: "18px" }} />
              </div>
              <div>
                <p className="text-sm font-semibold text-white/80 leading-tight">{item.title}</p>
                <p className="text-xs text-gray-600 mt-0.5">{item.subtitle}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
