import teamConfig from "@/lib/team-config";

export default function Footer() {
  return (
    <footer className="bg-gray-800 text-gray-300 text-sm py-8 mt-16">
      <div className="max-w-5xl mx-auto px-4 text-center">
        <p className="font-bold text-white text-base mb-2">{teamConfig.teamName}メンバー募集</p>
        <p className="mb-4">{teamConfig.catchphrase}</p>
        <p className="text-gray-500 text-xs">© {teamConfig.copyrightYear} {teamConfig.teamName}. All rights reserved.</p>
      </div>
    </footer>
  );
}
